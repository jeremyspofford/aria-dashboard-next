import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch repos from GitHub
    const reposRes = await fetch(
      'https://api.github.com/users/jeremyspofford/repos?per_page=100',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'aria-dashboard',
        },
        next: { revalidate: 300 },
      }
    );

    let repoCount = 0;
    let publicCount = 0;
    let recentActivity: { icon: string; text: string; time: string }[] = [];

    if (reposRes.ok) {
      const repos = await reposRes.json();
      repoCount = repos.length;
      publicCount = repos.filter((r: any) => !r.private).length;
    }

    // Fetch recent GitHub events for activity feed
    const eventsRes = await fetch(
      'https://api.github.com/users/jeremyspofford/events?per_page=10',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'aria-dashboard',
        },
        next: { revalidate: 300 },
      }
    );

    if (eventsRes.ok) {
      const events = await eventsRes.json();
      recentActivity = events
        .filter((e: any) => ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(e.type))
        .slice(0, 5)
        .map((e: any) => {
          const repoName = e.repo?.name?.split('/')[1] || e.repo?.name;
          const time = getTimeAgo(new Date(e.created_at));
          
          switch (e.type) {
            case 'PushEvent':
              const commits = e.payload?.commits?.length || 1;
              return { icon: '🚀', text: `Pushed ${commits} commit${commits > 1 ? 's' : ''} to ${repoName}`, time };
            case 'CreateEvent':
              if (e.payload?.ref_type === 'repository') {
                return { icon: '📦', text: `Created repository ${repoName}`, time };
              }
              return { icon: '🌿', text: `Created ${e.payload?.ref_type} in ${repoName}`, time };
            case 'PullRequestEvent':
              return { icon: '🔀', text: `${e.payload?.action} PR in ${repoName}`, time };
            case 'IssuesEvent':
              return { icon: '📋', text: `${e.payload?.action} issue in ${repoName}`, time };
            default:
              return { icon: '⚡', text: `Activity in ${repoName}`, time };
          }
        });
    }

    // Fetch tasks from GitHub Issues
    let taskCount = 0;
    try {
      const tasksRes = await fetch(
        'https://api.github.com/repos/jeremyspofford/tasks/issues?state=open&per_page=100',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'aria-dashboard',
          },
          next: { revalidate: 300 },
        }
      );

      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        taskCount = tasks.filter((t: any) =>
          t.labels?.some((l: any) => 
            l.name === 'status:in-progress' || l.name === 'status:todo'
          )
        ).length;
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }

    // Fetch metrics from generated JSON file
    let metrics = null;
    try {
      const metricsPath = './public/data/metrics.json';
      const fs = await import('fs/promises');
      const metricsData = await fs.readFile(metricsPath, 'utf-8');
      metrics = JSON.parse(metricsData);
    } catch (error) {
      console.error('Failed to read metrics.json:', error);
    }

    // Calculate success rate from metrics
    const totalMessages = metrics?.messages?.total ?? 0;
    const errorMessages = metrics?.messages?.errors ?? 0;
    const successRate = totalMessages > 0 
      ? ((totalMessages - errorMessages) / totalMessages * 100).toFixed(1)
      : null;

    // Read infrastructure config
    let infrastructureCount = 0;
    try {
      const configPath = './public/data/infrastructure.json';
      const fs = await import('fs/promises');
      const infraData = await fs.readFile(configPath, 'utf-8');
      const infraConfig = JSON.parse(infraData);
      infrastructureCount = infraConfig.devices?.filter((d: any) => d.online).length ?? 0;
    } catch (error) {
      console.error('Failed to read infrastructure.json:', error);
    }

    return NextResponse.json({
      repos: { total: repoCount, public: publicCount },
      tasks: { active: taskCount },
      metrics: {
        successRate: successRate ? `${successRate}%` : null,
        totalMessages: totalMessages,
        errors: errorMessages,
      },
      infrastructure: {
        devicesOnline: infrastructureCount,
      },
      activity: recentActivity,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}
