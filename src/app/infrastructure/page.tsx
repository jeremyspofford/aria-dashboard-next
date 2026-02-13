'use client';

import { useEffect, useState } from 'react';

interface Device {
  name: string;
  status: 'online' | 'offline' | 'unknown';
  role: string;
  ip: string;
  services: string[];
}

interface InfrastructureData {
  lastUpdated: string;
  devices: Device[];
}

export default function InfrastructurePage() {
  const [data, setData] = useState<InfrastructureData | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('');

  useEffect(() => {
    fetch('/data/infrastructure.json')
      .then(res => res.json())
      .then((infraData: InfrastructureData) => {
        setData(infraData);
        updateLastUpdatedText(infraData.lastUpdated);
      })
      .catch(err => console.error('Failed to load infrastructure data:', err));
  }, []);

  useEffect(() => {
    if (!data) return;
    
    const interval = setInterval(() => {
      updateLastUpdatedText(data.lastUpdated);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data]);

  const updateLastUpdatedText = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) {
      setLastUpdatedText('just now');
    } else if (diffMinutes < 60) {
      setLastUpdatedText(`${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`);
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      setLastUpdatedText(`${diffHours} hour${diffHours === 1 ? '' : 's'} ago`);
    }
  };

  const getDeviceIcon = (name: string) => {
    if (name.includes('Dell')) return '💻';
    if (name.includes('Pi')) return '🥧';
    if (name.includes('iPhone')) return '📱';
    return '🖥️';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700';
      case 'offline': return 'bg-gray-100 text-gray-600';
      case 'unknown': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Infrastructure</h1>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Infrastructure</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">System status and services</p>
        </div>
        {lastUpdatedText && (
          <p className="text-xs sm:text-sm text-gray-500">
            Last updated: <span className="font-medium">{lastUpdatedText}</span>
          </p>
        )}
      </div>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Devices</h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {data.devices.map((d) => (
            <div key={d.name} className="rounded-lg bg-white p-4 sm:p-6 shadow">
              <div className="flex items-start gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0">{getDeviceIcon(d.name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-base sm:text-lg">{d.name}</p>
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(d.status)}`}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{d.role}</p>
                  <p className="text-xs text-gray-400 font-mono mb-3">{d.ip}</p>
                  
                  {d.services.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {d.services.map((service) => (
                          <span 
                            key={service} 
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
