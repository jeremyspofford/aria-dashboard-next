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
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-gray-600">Manage your tasks with a Kanban board</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          + New Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`rounded-t-lg p-4 ${column.color}`}>
                <h2 className="font-semibold text-gray-900">
                  {column.title}
                  <span className="ml-2 text-sm text-gray-600">({columnTasks.length})</span>
                </h2>
              </div>
              <div className="flex-1 space-y-3 rounded-b-lg bg-gray-50 p-4">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
                  >
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                    )}
                    {task.priority && (
                      <span
                        className={`mt-2 inline-block rounded px-2 py-1 text-xs font-medium ${
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
                  <div className="py-8 text-center text-sm text-gray-400">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
