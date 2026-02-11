'use client';

import Link from 'next/link';

export default function Home() {
  const stats = [
    { label: 'Active Tasks', value: '12', change: '+2 from last week', icon: '✅', href: '/tasks' },
    { label: 'Repositories', value: '31', change: '13 public', icon: '📦', href: '/repos' },
    { label: 'Metrics', value: '99.9%', change: 'Success rate', icon: '📈', href: '/metrics' },
    { label: 'Infrastructure', value: '2', change: 'Devices online', icon: '🖥️', href: '/infrastructure' },
  ];

  const quickActions = [
    { icon: '✅', label: 'View Tasks', href: '/tasks' },
    { icon: '📦', label: 'Repositories', href: '/repos' },
    { icon: '📈', label: 'View Metrics', href: '/metrics' },
    { icon: '🖥️', label: 'Infrastructure', href: '/infrastructure' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Welcome to the Aria Labs control center</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg bg-white p-4 sm:p-6 shadow hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">{stat.value}</p>
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
            <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
              <span className="text-base sm:text-lg flex-shrink-0">🚀</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Deployed aria-dashboard-next</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
              <span className="text-base sm:text-lg flex-shrink-0">✅</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Completed task: API integration</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base sm:text-lg flex-shrink-0">📦</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Created new repository</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
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
