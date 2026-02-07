export default function MetricsPage() {
  const metrics = [
    { label: 'Messages', value: '10K', subtext: '1M+ prompts' },
    { label: 'Tokens', value: '752.8M', subtext: '1.5M output' },
    { label: 'Cost (YTD)', value: '$698.80', subtext: '8 days' },
    { label: 'Success Rate', value: '100%', subtext: '0 errors' },
    { label: 'Avg Latency', value: '7.2s', subtext: 'P95: 11%' },
    { label: 'Sessions', value: '349', subtext: 'active' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Metrics</h1>
      <p className="mt-2 text-gray-600">System performance and usage statistics</p>
      
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-white p-4 shadow text-center">
            <p className="text-xs font-medium text-gray-500 uppercase">{m.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400">{m.subtext}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Cost by Day</h2>
        <div className="mt-4 h-64 flex items-end justify-around gap-2">
          {[20, 45, 80, 120, 95, 110, 75].map((h, i) => (
            <div key={i} className="w-12 bg-blue-500 rounded-t" style={{height: `${h}px`}} />
          ))}
        </div>
      </div>
    </div>
  );
}
