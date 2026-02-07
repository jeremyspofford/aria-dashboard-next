'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Overview', href: '/', icon: '📊' },
  { name: 'Tasks', href: '/tasks', icon: '✅' },
  { name: 'Metrics', href: '/metrics', icon: '📈' },
  { name: 'Infrastructure', href: '/infrastructure', icon: '🖥️' },
  { name: 'Repositories', href: '/repos', icon: '📦' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Aria Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                transition-colors hover:bg-gray-800
                ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-400">
          Aria Labs © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
