'use client';

import { useEffect, useState } from 'react';
import { fetchTasks, type Task } from '@/lib/api';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-base sm:text-lg text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-base sm:text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage your tasks with a Kanban board</p>
        </div>
        <button className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm sm:text-base text-white transition-colors hover:bg-blue-700">
          + New Task
        </button>
      </div>

      {/* Mobile column tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:hidden">
        {columns.map((column) => {
          const count = getTasksByStatus(column.id).length;
          return (
            <button
              key={column.id}
              onClick={() => setActiveColumn(activeColumn === column.id ? null : column.id)}
              className={`
                flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${activeColumn === column.id ? 'bg-gray-900 text-white' : column.color + ' text-gray-700'}
              `}
            >
              {column.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Desktop: 3-column grid, Mobile: show selected or all stacked */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isVisible = !activeColumn || activeColumn === column.id;
          
          return (
            <div
              key={column.id}
              className={`flex flex-col ${!isVisible ? 'hidden md:flex' : ''}`}
            >
              <div className={`rounded-t-lg p-3 sm:p-4 ${column.color}`}>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  {column.title}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">({columnTasks.length})</span>
                </h2>
              </div>
              <div className="flex-1 space-y-2 sm:space-y-3 rounded-b-lg bg-gray-50 p-3 sm:p-4 min-h-[120px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg bg-white p-3 sm:p-4 shadow transition-shadow hover:shadow-md"
                  >
                    <h3 className="text-sm sm:text-base font-medium text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2">{task.description}</p>
                    )}
                    {task.priority && (
                      <span
                        className={`mt-2 inline-block rounded px-2 py-0.5 sm:py-1 text-xs font-medium ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div className="py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-400">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
