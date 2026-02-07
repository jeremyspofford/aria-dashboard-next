export default function InfrastructurePage() {
  const devices = [
    { name: 'Pi Gateway', status: 'Online', role: 'Orchestration', icon: '🥧' },
    { name: 'Dell XPS 8950', status: 'Local Network', role: 'Local LLM', icon: '💻' },
  ];

  const agents = [
    { name: 'Nova (Main)', model: 'Claude Opus', role: 'Primary assistant' },
    { name: 'Product Owner', model: 'Claude Opus', role: 'Priorities & specs' },
    { name: 'Architect', model: 'Claude Opus', role: 'System design' },
    { name: 'Security', model: 'Claude Opus', role: 'Audits & review' },
    { name: 'Frontend', model: 'Claude Sonnet', role: 'UI development' },
    { name: 'Backend', model: 'Claude Sonnet', role: 'API development' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Infrastructure</h1>
      <p className="mt-2 text-gray-600">System status, agents, and model configuration</p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((d) => (
            <div key={d.name} className="rounded-lg bg-white p-4 shadow flex items-center gap-4">
              <span className="text-3xl">{d.icon}</span>
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-gray-500">{d.role}</p>
              </div>
              <span className="ml-auto px-2 py-1 rounded text-xs bg-green-100 text-green-700">{d.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => (
            <div key={a.name} className="rounded-lg bg-white p-4 shadow">
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-blue-600">{a.model}</p>
              <p className="text-xs text-gray-500 mt-1">{a.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
