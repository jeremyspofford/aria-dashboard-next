export default function ReposPage() {
  const repos = [
    { name: 'aria-labs-dashboard', desc: 'Monitoring dashboard', lang: 'TypeScript' },
    { name: 'accountability-dashboard', desc: 'Track politician votes', lang: 'TypeScript' },
    { name: 'suppr', desc: 'Social dining app', lang: 'TypeScript' },
    { name: 'portfolio', desc: 'Personal portfolio', lang: 'TypeScript' },
    { name: 'dotfiles', desc: 'Machine configs', lang: 'Shell' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Repositories</h1>
      <p className="mt-2 text-gray-600">GitHub repositories and projects</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((r) => (
          <div key={r.name} className="rounded-lg bg-white p-4 shadow hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-blue-600">{r.name}</p>
                <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.lang}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={`https://github.com/jeremyspofford/${r.name}`} target="_blank" className="text-xs text-gray-500 hover:text-gray-700">GitHub ↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
