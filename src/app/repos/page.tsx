'use client';

import { useState, useEffect } from 'react';

type RepoStatus = 'poc' | 'alpha' | 'beta' | 'v1' | 'archived' | 'active';

interface Repo {
  name: string;
  desc: string;
  lang: string;
  isPrivate: boolean;
  isArchived: boolean;
  status: RepoStatus;
  liveUrl?: string;
  url: string;
  updatedAt: string;
  stars: number;
}

const statusConfig: Record<RepoStatus, { label: string; color: string; icon: string }> = {
  poc: { label: 'POC', color: 'bg-purple-100 text-purple-700', icon: '🧪' },
  alpha: { label: 'Alpha', color: 'bg-orange-100 text-orange-700', icon: '🔬' },
  beta: { label: 'Beta', color: 'bg-yellow-100 text-yellow-700', icon: '🧪' },
  v1: { label: 'v1.0', color: 'bg-green-100 text-green-700', icon: '🚀' },
  active: { label: 'Active', color: 'bg-blue-100 text-blue-700', icon: '⚡' },
  archived: { label: 'Archived', color: 'bg-gray-100 text-gray-600', icon: '📦' },
};

function RepoCard({ repo }: { repo: Repo }) {
  const status = statusConfig[repo.status] || statusConfig.active;
  const timeAgo = getTimeAgo(new Date(repo.updatedAt));
  
  return (
    <div className={`rounded-lg bg-white p-4 sm:p-5 shadow hover:shadow-md transition-shadow ${repo.isArchived ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-medium text-sm sm:text-base text-blue-600 break-words">{repo.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color} flex items-center gap-1 flex-shrink-0`}>
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </span>
            {repo.isPrivate && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 flex-shrink-0">🔒</span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2 break-words">{repo.desc}</p>
          <p className="text-xs text-gray-400 mt-2">Updated {timeAgo}</p>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-shrink-0 h-fit">{repo.lang}</span>
      </div>
      <div className="mt-4 flex gap-4 flex-wrap">
        <a 
          href={repo.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:underline min-h-[44px] flex items-center"
        >
          GitHub ↗
        </a>
        {repo.liveUrl && (
          <a 
            href={repo.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-green-600 hover:text-green-700 hover:underline font-medium min-h-[44px] flex items-center"
          >
            Live Site ↗
          </a>
        )}
      </div>
    </div>
  );
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

export default function ReposPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [statusFilter, setStatusFilter] = useState<RepoStatus | 'all'>('all');
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch('/api/repos');
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setRepos(data.repos);
        setFetchedAt(data.fetchedAt);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repos');
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo => {
    if (filter === 'public' && repo.isPrivate) return false;
    if (filter === 'private' && !repo.isPrivate) return false;
    if (statusFilter !== 'all' && repo.status !== statusFilter) return false;
    return true;
  });

  const publicCount = repos.filter(r => !r.isPrivate).length;
  const privateCount = repos.filter(r => r.isPrivate).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">Repositories</h1>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading from GitHub...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">Repositories</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Repositories</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {repos.length} repos • {publicCount} public • {privateCount} private
              {fetchedAt && <span className="ml-2">• Updated {getTimeAgo(new Date(fetchedAt))}</span>}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border rounded-lg px-3 py-2 bg-white min-h-[44px] flex-1 sm:flex-initial"
            >
              <option value="all">All repos</option>
              <option value="public">Public only</option>
              <option value="private">Private only</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-sm border rounded-lg px-3 py-2 bg-white min-h-[44px] flex-1 sm:flex-initial"
            >
              <option value="all">All statuses</option>
              <option value="v1">v1.0</option>
              <option value="beta">Beta</option>
              <option value="alpha">Alpha</option>
              <option value="poc">POC</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No repositories match your filters
          </div>
        )}
      </div>
    </div>
  );
}
