'use client';

import { useState } from 'react';

type RepoStatus = 'poc' | 'alpha' | 'beta' | 'v1' | 'archived' | 'active';

interface Repo {
  name: string;
  desc: string;
  lang: string;
  isPrivate: boolean;
  status: RepoStatus;
  liveUrl?: string;
}

const statusConfig: Record<RepoStatus, { label: string; color: string; icon: string }> = {
  poc: { label: 'POC', color: 'bg-purple-100 text-purple-700', icon: '🧪' },
  alpha: { label: 'Alpha', color: 'bg-orange-100 text-orange-700', icon: '🔬' },
  beta: { label: 'Beta', color: 'bg-yellow-100 text-yellow-700', icon: '🧪' },
  v1: { label: 'v1.0', color: 'bg-green-100 text-green-700', icon: '🚀' },
  active: { label: 'Active', color: 'bg-blue-100 text-blue-700', icon: '⚡' },
  archived: { label: 'Archived', color: 'bg-gray-100 text-gray-600', icon: '📦' },
};

const publicRepos: Repo[] = [
  { name: 'aria-dashboard-next', desc: 'Nova monitoring dashboard', lang: 'TypeScript', isPrivate: false, status: 'beta', liveUrl: 'https://dashboard.arialabs.ai' },
  { name: 'accountability-dashboard', desc: 'Track what politicians say vs do', lang: 'TypeScript', isPrivate: false, status: 'alpha', liveUrl: 'https://accountability.arialabs.ai' },
  { name: 'dotfiles', desc: 'Machine configs and setup automation', lang: 'Shell', isPrivate: false, status: 'active' },
  { name: 'launchpad', desc: 'Project starter templates', lang: 'TypeScript', isPrivate: false, status: 'active' },
  { name: 'ai-coding-templates', desc: 'Secure AI coding templates with git-secrets', lang: 'Shell', isPrivate: false, status: 'v1' },
  { name: 'n8n-builder', desc: 'AI-assisted n8n workflow builder', lang: 'TypeScript', isPrivate: false, status: 'alpha' },
  { name: 'nova-ai-platform', desc: 'Nova AI platform core', lang: 'TypeScript', isPrivate: false, status: 'alpha' },
  { name: 'serverless-auth-app', desc: 'AWS Lambda serverless auth example', lang: 'TypeScript', isPrivate: false, status: 'v1' },
  { name: 'ai-chatbot', desc: 'Modular chatbot with plugin capabilities', lang: 'TypeScript', isPrivate: false, status: 'poc' },
  { name: 'ai', desc: 'AI experiments and tools', lang: 'Python', isPrivate: false, status: 'poc' },
  { name: 'ai-engineer-mlops-track', desc: 'MLOps learning track', lang: 'Python', isPrivate: false, status: 'active' },
  { name: 'portfolio-original', desc: 'Original portfolio (deprecated)', lang: 'TypeScript', isPrivate: false, status: 'archived' },
  { name: 'aria-labs-dashboard', desc: 'Old dashboard (deprecated)', lang: 'TypeScript', isPrivate: false, status: 'archived' },
];

const privateRepos: Repo[] = [
  { name: 'portfolio', desc: 'Personal portfolio site', lang: 'TypeScript', isPrivate: true, status: 'v1', liveUrl: 'https://jeremyspofford.dev' },
  { name: 'suppr', desc: 'Social dining app MVP', lang: 'TypeScript', isPrivate: true, status: 'beta', liveUrl: 'https://suppr.arialabs.ai' },
  { name: 'mercury', desc: 'Privacy-first AI email processing', lang: 'TypeScript', isPrivate: true, status: 'alpha' },
  { name: 'nova', desc: 'Nova AI Assistant core', lang: 'TypeScript', isPrivate: true, status: 'beta' },
  { name: 'moltbot-infra', desc: 'Infrastructure: Pi gateway, Dell node, tunnels', lang: 'Shell', isPrivate: true, status: 'active' },
  { name: 'facedrill-poc', desc: 'Face/name flashcard learning app', lang: 'TypeScript', isPrivate: true, status: 'poc' },
  { name: 'deadlinr-poc', desc: 'Unified expiry & deadline tracker', lang: 'TypeScript', isPrivate: true, status: 'poc' },
  { name: 'macros-only-poc', desc: 'Calorie-free macro tracker for ED recovery', lang: 'TypeScript', isPrivate: true, status: 'poc' },
  { name: 'todo-graveyard-poc', desc: 'Scans codebase for zombie TODOs', lang: 'TypeScript', isPrivate: true, status: 'poc' },
  { name: 'democracy-dashboard', desc: 'Political satire + accountability journalism', lang: 'TypeScript', isPrivate: true, status: 'poc' },
  { name: 'rep-accountability-dashboard', desc: 'Rep voting tracker (original)', lang: 'TypeScript', isPrivate: true, status: 'archived' },
  { name: 'dashboard', desc: 'Old dashboard prototype', lang: 'TypeScript', isPrivate: true, status: 'archived' },
  { name: 'spofford-hub', desc: 'Landing page hub', lang: 'TypeScript', isPrivate: true, status: 'archived' },
  { name: 'automations', desc: 'Personal automation scripts', lang: 'TypeScript', isPrivate: true, status: 'active' },
  { name: 'homelab', desc: 'Homelab configuration', lang: 'Shell', isPrivate: true, status: 'active' },
  { name: 'nexus', desc: 'Project nexus', lang: 'TypeScript', isPrivate: true, status: 'poc' },
  { name: '.claude', desc: 'Shared Claude agent configs', lang: 'Markdown', isPrivate: true, status: 'active' },
  { name: 'n8n-linkedin-job-matcher', desc: 'LinkedIn job matching automation', lang: 'TypeScript', isPrivate: true, status: 'poc' },
];

function RepoCard({ repo }: { repo: Repo }) {
  const status = statusConfig[repo.status];
  
  return (
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm sm:text-base text-blue-600 truncate">{repo.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color} flex items-center gap-1`}>
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{repo.desc}</p>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-shrink-0">{repo.lang}</span>
      </div>
      <div className="mt-3 sm:mt-4 flex gap-3 flex-wrap">
        <a 
          href={`https://github.com/jeremyspofford/${repo.name}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
        >
          GitHub ↗
        </a>
        {repo.liveUrl && (
          <a 
            href={repo.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-green-600 hover:text-green-700 hover:underline font-medium"
          >
            Live Site ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function ReposPage() {
  const [showPrivate, setShowPrivate] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Repositories</h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
        {publicRepos.length + privateRepos.length} total repositories
      </p>

      {/* Status Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([key, config]) => (
          <span key={key} className={`text-xs px-2 py-1 rounded-full ${config.color} flex items-center gap-1`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </span>
        ))}
      </div>

      {/* Public Repos */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Public Repositories ({publicRepos.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {publicRepos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
      </div>

      {/* Private Repos - Collapsible */}
      <div className="mt-8 sm:mt-10">
        <button
          onClick={() => setShowPrivate(!showPrivate)}
          className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
        >
          <span className={`transform transition-transform ${showPrivate ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span>Private Repositories ({privateRepos.length})</span>
          <span className="text-sm font-normal text-gray-500">
            {showPrivate ? 'click to collapse' : 'click to expand'}
          </span>
        </button>
        
        {showPrivate && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {privateRepos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
