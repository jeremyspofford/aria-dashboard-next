import { NextResponse } from 'next/server';

interface GitHubLabel {
  name: string;
  color: string;
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: GitHubLabel[];
  assignee: { login: string } | null;
  created_at: string;
  updated_at: string;
  html_url: string;
}

function getStatus(labels: GitHubLabel[], state: string): string {
  if (state === 'closed') return 'done';
  const statusLabel = labels.find(l => l.name.startsWith('status:'));
  if (statusLabel) {
    return statusLabel.name.replace('status:', '');
  }
  return 'todo';
}

function getPriority(labels: GitHubLabel[]): string {
  const priorityLabel = labels.find(l => l.name.startsWith('priority:'));
  if (priorityLabel) {
    return priorityLabel.name.replace('priority:', '');
  }
  return 'medium';
}

function getProject(labels: GitHubLabel[]): string | null {
  const projectLabel = labels.find(l => l.name.startsWith('project:'));
  if (projectLabel) {
    return projectLabel.name.replace('project:', '');
  }
  return null;
}

function parseAcceptanceCriteria(body: string): string[] {
  const lines = body.split('\n');
  const criteria: string[] = [];
  
  for (const line of lines) {
    const match = line.match(/^-\s*\[[ x]\]\s*(.+)$/);
    if (match) {
      criteria.push(match[1]);
    }
  }
  
  return criteria;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  
  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token not configured', tasks: [] },
      { status: 500 }
    );
  }

  try {
    // Fetch open and recently closed issues
    const [openRes, closedRes] = await Promise.all([
      fetch('https://api.github.com/repos/jeremyspofford/tasks/issues?state=open&per_page=100', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'aria-dashboard',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }),
      fetch('https://api.github.com/repos/jeremyspofford/tasks/issues?state=closed&per_page=20&sort=updated', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'aria-dashboard',
        },
        next: { revalidate: 60 },
      }),
    ]);

    if (!openRes.ok || !closedRes.ok) {
      throw new Error('GitHub API error');
    }

    const [openIssues, closedIssues] = await Promise.all([
      openRes.json(),
      closedRes.json(),
    ]) as [GitHubIssue[], GitHubIssue[]];

    const allIssues = [...openIssues, ...closedIssues];

    const tasks = allIssues.map((issue) => ({
      id: issue.number.toString(),
      title: issue.title,
      description: issue.body?.split('\n\n')[0] || '',
      acceptance_criteria: parseAcceptanceCriteria(issue.body || ''),
      status: getStatus(issue.labels, issue.state),
      priority: getPriority(issue.labels),
      project: getProject(issue.labels),
      assignee: issue.assignee?.login || null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      url: issue.html_url,
    }));

    // Sort: in-progress first, then blocked, then todo, then done
    const statusOrder: Record<string, number> = {
      'in-progress': 0,
      'blocked': 1,
      'todo': 2,
      'done': 3,
    };

    tasks.sort((a, b) => {
      const statusDiff = (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
      if (statusDiff !== 0) return statusDiff;
      // Within same status, sort by priority
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
    });

    return NextResponse.json({
      tasks,
      fetchedAt: new Date().toISOString(),
      source: 'github:jeremyspofford/tasks',
    });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', tasks: [] },
      { status: 500 }
    );
  }
}
