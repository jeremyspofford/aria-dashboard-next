import { NextResponse } from 'next/server';

// Metadata overrides for repos (status, liveUrl, better descriptions)
const repoMeta: Record<string, { status?: string; liveUrl?: string; desc?: string }> = {
  'aria-dashboard-next': { status: 'beta', liveUrl: 'https://dashboard.arialabs.ai', desc: 'Nova monitoring dashboard' },
  'accountability-dashboard': { status: 'alpha', liveUrl: 'https://accountability.arialabs.ai', desc: 'Track what politicians say vs do' },
  'jobhunter': { status: 'alpha', liveUrl: 'https://jobhunter.arialabs.ai', desc: 'AI-powered job search assistant' },
  'suppr': { status: 'beta', liveUrl: 'https://suppr.arialabs.ai', desc: 'Social dining app MVP' },
  'portfolio': { status: 'v1', liveUrl: 'https://jeremyspofford.dev', desc: 'Personal portfolio site' },
  'nova-ai-platform': { status: 'alpha', desc: 'Nova AI platform core' },
  'todo-debt-poc': { status: 'poc', desc: 'Scan codebases for TODO debt' },
  'facedrill-poc': { status: 'poc', desc: 'Face/name flashcard learning app' },
  'deadlinr-poc': { status: 'poc', desc: 'Unified expiry & deadline tracker' },
  'launchpad': { status: 'active', desc: 'Project starter templates' },
  'dotfiles': { status: 'active', desc: 'Machine configs and setup automation' },
  'mercury': { status: 'alpha', desc: 'Privacy-first AI email processing' },
  'moltbot-infra': { status: 'active', desc: 'Infrastructure: Pi gateway, Dell node, tunnels' },
};

// Repos to hide from the dashboard
const hiddenRepos = new Set([
  'jeremyspofford',  // Profile repo
  '.github',
]);

export async function GET() {
  try {
    const response = await fetch(
      'https://api.github.com/users/jeremyspofford/repos?per_page=100&sort=updated',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'aria-dashboard',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    const formatted = repos
      .filter((repo: any) => !hiddenRepos.has(repo.name))
      .map((repo: any) => {
        const meta = repoMeta[repo.name] || {};
        return {
          name: repo.name,
          desc: meta.desc || repo.description || 'No description',
          lang: repo.language || 'Unknown',
          isPrivate: repo.private,
          isArchived: repo.archived,
          status: meta.status || (repo.archived ? 'archived' : 'active'),
          liveUrl: meta.liveUrl,
          url: repo.html_url,
          updatedAt: repo.updated_at,
          stars: repo.stargazers_count,
        };
      });

    return NextResponse.json({ repos: formatted, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories', repos: [] },
      { status: 500 }
    );
  }
}
