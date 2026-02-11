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

    // For tasks, we'll fetch from the local tasks.json in the future
    // For now, return placeholder that can be updated
    const taskCount = 12; // TODO: integrate with real task source

    return NextResponse.json({
      repos: { total: repoCount, public: publicCount },
      tasks: { active: taskCount },
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
