export default function ReposPage() {
  const repos = [
    {
      name: 'aria-dashboard-next',
      description: 'Next.js dashboard for task management and monitoring',
      status: 'active',
      language: 'TypeScript',
      stars: 0,
      lastCommit: '2 hours ago',
      deployment: 'dashboard.arialabs.ai',
    },
    {
      name: 'nova-dashboard',
      description: 'Static dashboard for Aria Labs',
      status: 'active',
      language: 'HTML/CSS',
      stars: 0,
      lastCommit: '2 days ago',
      deployment: 'nova.arialabs.ai',
    },
    {
      name: 'portfolio',
      description: 'Jeremy\'s personal portfolio website',
      status: 'active',
      language: 'React',
      stars: 0,
      lastCommit: '1 week ago',
      deployment: 'jeremy.arialabs.ai',
    },
    {
      name: 'accountability-dashboard',
      description: 'Personal accountability tracking',
      status: 'active',
      language: 'TypeScript',
      stars: 0,
      lastCommit: '3 days ago',
      deployment: 'accountability.arialabs.ai',
    },
    {
      name: 'suppr',
      description: 'Reddit suppression tool',
      status: 'active',
      language: 'React',
      stars: 0,
      lastCommit: '1 week ago',
      deployment: 'suppr.arialabs.ai',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Repositories</h1>
        <p className="mt-2 text-gray-600">Manage your GitHub repositories and deployments</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search repositories..."
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>All Languages</option>
            <option>TypeScript</option>
            <option>React</option>
            <option>HTML/CSS</option>
          </select>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          + New Repository
        </button>
      </div>

      <div className="space-y-4">
        {repos.map((repo) => (
          <div key={repo.name} className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900">{repo.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      repo.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {repo.status}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{repo.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    {repo.language}
                  </span>
                  <span>⭐ {repo.stars}</span>
                  <span>🕒 {repo.lastCommit}</span>
                  {repo.deployment && (
                    <span className="flex items-center gap-1">
                      🚀
                      <a
                        href={`https://${repo.deployment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {repo.deployment}
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50">
                  View
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50">
                  Deploy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
