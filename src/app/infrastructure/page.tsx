export default function InfrastructurePage() {
  const systems = [
    { name: 'Raspberry Pi 4', status: 'online', uptime: '99.9%', cpu: '23%', memory: '45%' },
    { name: 'Dell XPS 8950', status: 'online', uptime: '99.7%', cpu: '12%', memory: '32%' },
    { name: 'Cloudflare Pages', status: 'online', uptime: '100%', cpu: 'N/A', memory: 'N/A' },
  ];

  const agents = [
    { name: 'Nova (Product Owner)', status: 'active', model: 'Claude Opus 4.5', tasks: 12 },
    { name: 'Reddit Scout', status: 'active', model: 'Claude Sonnet 4.5', tasks: 8 },
    { name: 'Code Agent', status: 'idle', model: 'Claude Sonnet 4.5', tasks: 0 },
  ];

  const models = [
    { name: 'Claude Opus 4.5', provider: 'Anthropic', status: 'available', usage: '2.3k tokens/day' },
    { name: 'Claude Sonnet 4.5', provider: 'Anthropic', status: 'available', usage: '5.1k tokens/day' },
    { name: 'GPT-4o', provider: 'OpenAI', status: 'available', usage: '1.2k tokens/day' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Infrastructure</h1>
        <p className="mt-2 text-gray-600">System status, agents, and AI models</p>
      </div>

      <div className="space-y-8">
        {/* System Status */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">System Status</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {systems.map((system) => (
              <div key={system.name} className="rounded-lg bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{system.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      system.status === 'online'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {system.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium text-gray-900">{system.uptime}</span>
                  </div>
                  {system.cpu !== 'N/A' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CPU</span>
                        <span className="font-medium text-gray-900">{system.cpu}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Memory</span>
                        <span className="font-medium text-gray-900">{system.memory}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">AI Agents</h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Active Tasks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {agents.map((agent) => (
                  <tr key={agent.name}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {agent.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          agent.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{agent.model}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{agent.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Models */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">AI Models</h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Usage (24h)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {models.map((model) => (
                  <tr key={model.name}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {model.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{model.provider}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {model.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{model.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
