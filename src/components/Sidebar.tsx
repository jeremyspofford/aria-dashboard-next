'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/', icon: '📊' },
  { name: 'Tasks', href: '/tasks', icon: '✅' },
  { name: 'Metrics', href: '/metrics', icon: '📈' },
  { name: 'Infrastructure', href: '/infrastructure', icon: '🖥️' },
  { name: 'Repositories', href: '/repos', icon: '📦' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-gray-900 p-3 text-white md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg"
        aria-label="Toggle menu"
      >
        <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 text-white transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-center gap-2 border-b border-gray-800 px-4">
          <img src="/icon-192.png" alt="Aria Labs" className="w-8 h-8 flex-shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold truncate">Aria Dashboard</h1>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[44px]
                  transition-colors hover:bg-gray-800 active:bg-gray-700
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
    </>
  );
}
