'use client';

import { useEffect, useState } from 'react';
import { fetchTasks, type Task } from '@/lib/api';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

function TaskCard({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg bg-white p-3 sm:p-4 shadow transition-all hover:shadow-md cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm sm:text-base font-medium text-gray-900">{task.title}</h3>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      
      {!expanded && task.description && (
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2">{task.description}</p>
      )}
      
      {expanded && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {task.description && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
              <p className="mt-1 text-sm text-gray-700">{task.description}</p>
            </div>
          )}
          
          {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Acceptance Criteria</p>
              <ul className="mt-1 space-y-1">
                {task.acceptance_criteria.map((criteria, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
              <p className="mt-1 text-sm text-gray-700 capitalize">{task.status.replace('-', ' ')}</p>
            </div>
            {task.priority && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Priority</p>
                <p className="mt-1 text-sm text-gray-700 capitalize">{task.priority}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {task.assignee && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Assignee</p>
                <p className="mt-1 text-sm text-gray-700">{task.assignee}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
              <p className="mt-1 text-sm text-gray-700">
                {new Date(task.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!expanded && task.priority && (
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
  );
}

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
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Click any task to view details and acceptance criteria</p>
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
                  <TaskCard key={task.id} task={task} />
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
