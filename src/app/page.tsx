export default function Home() {
  const stats = [
    { label: 'Active Tasks', value: '12', change: '+2 from last week', icon: '✅' },
    { label: 'Projects', value: '8', change: '+1 new', icon: '📦' },
    { label: 'Uptime', value: '99.9%', change: 'Last 30 days', icon: '✅' },
    { label: 'Deployments', value: '24', change: 'This month', icon: '🚀' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Welcome to the Aria Labs control center</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-4 sm:p-6 shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 truncate">{stat.change}</p>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl ml-2 flex-shrink-0">{stat.icon}</div>
            </div>
          </div>
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
            <button className="rounded-lg border border-gray-300 p-3 sm:p-4 text-left transition-colors hover:bg-gray-50">
              <div className="text-xl sm:text-2xl">➕</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-900">New Task</div>
            </button>
            <button className="rounded-lg border border-gray-300 p-3 sm:p-4 text-left transition-colors hover:bg-gray-50">
              <div className="text-xl sm:text-2xl">📦</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-900">New Repo</div>
            </button>
            <button className="rounded-lg border border-gray-300 p-3 sm:p-4 text-left transition-colors hover:bg-gray-50">
              <div className="text-xl sm:text-2xl">📈</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-900">View Metrics</div>
            </button>
            <button className="rounded-lg border border-gray-300 p-3 sm:p-4 text-left transition-colors hover:bg-gray-50">
              <div className="text-xl sm:text-2xl">🖥️</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-900">System Status</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
