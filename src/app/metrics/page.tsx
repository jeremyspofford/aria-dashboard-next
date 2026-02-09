'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  generatedAt: string;
  sessions: { total: number; active: number };
  messages: { total: number; user: number; assistant: number; errors: number };
  tokens: { input: number; output: number; total: number };
  cost: {
    total: number;
    last7Days: Array<{ date: string; label: string; cost: number; messages: number }>;
  };
  latency: { avgMs: number; p50Ms: number; p95Ms: number };
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/metrics.json')
      .then(res => res.json())
      .then(setMetrics)
      .catch(e => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">Metrics</h1>
        <p className="mt-4 text-red-600">Error loading metrics: {error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900">Metrics</h1>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  const cards = [
    { label: 'Messages', value: formatNumber(metrics.messages.total), subtext: `${metrics.messages.user} user / ${metrics.messages.assistant} assistant` },
    { label: 'Tokens', value: formatNumber(metrics.tokens.total), subtext: `${formatNumber(metrics.tokens.output)} output` },
    { label: 'Cost (7d)', value: `$${metrics.cost.total.toFixed(2)}`, subtext: 'USD' },
    { label: 'Success Rate', value: metrics.messages.total > 0 ? `${(100 - (metrics.messages.errors / metrics.messages.total * 100)).toFixed(1)}%` : '100%', subtext: `${metrics.messages.errors} errors` },
    { label: 'Avg Latency', value: metrics.latency.avgMs > 0 ? `${(metrics.latency.avgMs / 1000).toFixed(1)}s` : 'N/A', subtext: metrics.latency.p95Ms > 0 ? `P95: ${(metrics.latency.p95Ms / 1000).toFixed(1)}s` : '' },
    { label: 'Sessions', value: metrics.sessions.total.toString(), subtext: `${metrics.sessions.active} active` },
  ];

  const maxCost = Math.max(...metrics.cost.last7Days.map(d => d.cost), 1);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Metrics</h1>
      <p className="mt-2 text-gray-600">
        System performance and usage statistics
        <span className="ml-2 text-xs text-gray-400">
          Updated: {new Date(metrics.generatedAt).toLocaleString()}
        </span>
      </p>
      
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((m) => (
          <div key={m.label} className="rounded-lg bg-white p-4 shadow text-center">
            <p className="text-xs font-medium text-gray-500 uppercase">{m.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400">{m.subtext}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Cost by Day (Last 7 Days)</h2>
        <div className="mt-4 h-64 flex items-end justify-around gap-2">
          {metrics.cost.last7Days.map((day) => (
            <div key={day.date} className="flex flex-col items-center flex-1">
              <span className="text-xs text-gray-500 mb-1">${day.cost.toFixed(2)}</span>
              <div 
                className="w-full max-w-12 bg-blue-500 rounded-t transition-all" 
                style={{ height: `${Math.max((day.cost / maxCost) * 200, day.cost > 0 ? 4 : 0)}px` }} 
              />
              <span className="text-xs text-gray-400 mt-2 text-center">{day.label.split(', ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Messages by Day</h2>
        <div className="mt-4 h-48 flex items-end justify-around gap-2">
          {metrics.cost.last7Days.map((day) => {
            const maxMsg = Math.max(...metrics.cost.last7Days.map(d => d.messages), 1);
            return (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-500 mb-1">{day.messages}</span>
                <div 
                  className="w-full max-w-12 bg-green-500 rounded-t transition-all" 
                  style={{ height: `${Math.max((day.messages / maxMsg) * 150, day.messages > 0 ? 4 : 0)}px` }} 
                />
                <span className="text-xs text-gray-400 mt-2 text-center">{day.label.split(', ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
