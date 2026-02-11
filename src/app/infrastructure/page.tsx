export default function InfrastructurePage() {
  const devices = [
    { name: 'Pi Gateway', status: 'Online', role: 'OpenClaw orchestration', icon: '🥧', ip: '100.89.154.45' },
    { name: 'Dell XPS 8950', status: 'Available', role: 'GPU compute (Ollama)', icon: '💻', ip: '100.89.190.125' },
  ];

  const services = [
    { name: 'OpenClaw Gateway', status: 'Running', description: 'AI assistant orchestration' },
    { name: 'Telegram Bot', status: 'Connected', description: 'Primary communication channel' },
    { name: 'Cron Scheduler', status: 'Active', description: 'Automated tasks and heartbeats' },
    { name: 'Ollama (Dell)', status: 'Standby', description: 'Local LLM inference (llama3.1:8b)' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Infrastructure</h1>
      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">System status and services</p>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Devices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {devices.map((d) => (
            <div key={d.name} className="rounded-lg bg-white p-3 sm:p-4 shadow flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl flex-shrink-0">{d.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">{d.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{d.role}</p>
                <p className="text-xs text-gray-400 font-mono">{d.ip}</p>
              </div>
              <span className={`ml-auto px-2 py-1 rounded text-xs flex-shrink-0 ${
                d.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {services.map((s) => (
            <div key={s.name} className="rounded-lg bg-white p-3 sm:p-4 shadow">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm sm:text-base">{s.name}</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  s.status === 'Running' || s.status === 'Connected' || s.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>{s.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 rounded-lg bg-blue-50 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Sub-agents</h2>
        <p className="text-sm text-blue-800">
          Nova spawns sub-agents dynamically for parallel work using OpenClaw's <code className="bg-blue-100 px-1 rounded">sessions_spawn</code>. 
          These are ephemeral — created on-demand for specific tasks and cleaned up after completion.
        </p>
      </div>
    </div>
  );
}
