export default function ReposPage() {
  const repos = [
    { name: 'aria-labs-dashboard', desc: 'Monitoring dashboard', lang: 'TypeScript' },
    { name: 'accountability-dashboard', desc: 'Track politician votes', lang: 'TypeScript' },
    { name: 'suppr', desc: 'Social dining app', lang: 'TypeScript' },
    { name: 'portfolio', desc: 'Personal portfolio', lang: 'TypeScript' },
    { name: 'dotfiles', desc: 'Machine configs', lang: 'Shell' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Repositories</h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">GitHub repositories and projects</p>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {repos.map((r) => (
          <div key={r.name} className="rounded-lg bg-white p-3 sm:p-4 shadow hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-blue-600 truncate">{r.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{r.desc}</p>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-shrink-0">{r.lang}</span>
            </div>
            <div className="mt-3 sm:mt-4 flex gap-2">
              <a 
                href={`https://github.com/jeremyspofford/${r.name}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
