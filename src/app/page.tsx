'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Stats {
  repos: { total: number; public: number };
  tasks: { active: number };
  activity: { icon: string; text: string; time: string }[];
  fetchedAt: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Active Tasks', 
      value: stats?.tasks.active ?? '—', 
      change: 'From kanban board', 
      icon: '✅', 
      href: '/tasks' 
    },
    { 
      label: 'Repositories', 
      value: stats?.repos.total ?? '—', 
      change: stats ? `${stats.repos.public} public` : '—', 
      icon: '📦', 
      href: '/repos' 
    },
    { 
      label: 'Metrics', 
      value: '99.9%', 
      change: 'Success rate', 
      icon: '📈', 
      href: '/metrics' 
    },
    { 
      label: 'Infrastructure', 
      value: '2', 
      change: 'Devices online', 
      icon: '🖥️', 
      href: '/infrastructure' 
    },
  ];

  const quickActions = [
    { icon: '✅', label: 'View Tasks', href: '/tasks' },
    { icon: '📦', label: 'Repositories', href: '/repos' },
    { icon: '📈', label: 'View Metrics', href: '/metrics' },
    { icon: '🖥️', label: 'Infrastructure', href: '/infrastructure' },
  ];

  const defaultActivity = [
    { icon: '⏳', text: 'Loading recent activity...', time: '' },
  ];

  const activity = stats?.activity?.length ? stats.activity : (loading ? defaultActivity : [
    { icon: '📭', text: 'No recent activity', time: '' },
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          Welcome to the Aria Labs control center
          {stats?.fetchedAt && (
            <span className="text-xs text-gray-400 ml-2">
              • Updated {getTimeAgo(new Date(stats.fetchedAt))}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg bg-white p-4 sm:p-6 shadow hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                <p className={`mt-1 sm:mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 ${loading ? 'animate-pulse' : ''}`}>
                  {stat.value}
                </p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 truncate">{stat.change}</p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl ml-2 flex-shrink-0">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-3 sm:mt-4 space-y-3">
            {activity.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 ${i < activity.length - 1 ? 'border-b border-gray-100 pb-3' : ''}`}>
                <span className="text-base sm:text-lg flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.text}</p>
                  {item.time && <p className="text-xs text-gray-500">{item.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="rounded-lg border border-gray-300 p-3 sm:p-4 text-left transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
              >
                <div className="text-xl sm:text-2xl">{action.icon}</div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-900">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>
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
