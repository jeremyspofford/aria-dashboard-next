'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  acceptance_criteria: string[];
  status: string;
  priority: string;
  project: string | null;
  assignee: string | null;
  created_at: string;
  updated_at: string;
  url: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'in-progress': { label: 'In Progress', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'blocked': { label: 'Blocked', color: 'text-red-700', bg: 'bg-red-100' },
  'todo': { label: 'To Do', color: 'text-blue-700', bg: 'bg-blue-100' },
  'done': { label: 'Done', color: 'text-green-700', bg: 'bg-green-100' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  'high': { label: '🔴 High', color: 'text-red-600' },
  'medium': { label: '🟡 Medium', color: 'text-yellow-600' },
  'low': { label: '🟢 Low', color: 'text-green-600' },
};

const projectColors: Record<string, string> = {
  'suppr': 'bg-purple-100 text-purple-700',
  'accountability': 'bg-teal-100 text-teal-700',
  'mercury': 'bg-blue-100 text-blue-700',
  'dashboard': 'bg-indigo-100 text-indigo-700',
  'nova': 'bg-pink-100 text-pink-700',
  'jobhunter': 'bg-cyan-100 text-cyan-700',
  'tododebt': 'bg-slate-100 text-slate-700',
};

function TaskCard({ task }: { task: Task }) {
  const status = statusConfig[task.status] || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const projectClass = task.project ? projectColors[task.project] || 'bg-gray-100 text-gray-700' : '';

  return (
    <a
      href={task.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-gray-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{task.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 items-center text-xs">
        {task.project && (
          <span className={`px-2 py-0.5 rounded-full ${projectClass}`}>
            {task.project}
          </span>
        )}
        <span className={priority.color}>{priority.label}</span>
        {task.assignee && (
          <span className="text-gray-500">@{task.assignee}</span>
        )}
      </div>

      {task.acceptance_criteria.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Acceptance Criteria:</p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            {task.acceptance_criteria.slice(0, 3).map((c, i) => (
              <li key={i} className="truncate">• {c}</li>
            ))}
            {task.acceptance_criteria.length > 3 && (
              <li className="text-gray-400">+{task.acceptance_criteria.length - 3} more</li>
            )}
          </ul>
        </div>
      )}
    </a>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchTasks() {
      try {
        // Fetch directly from GitHub public API (repo is now public)
        const [openRes, closedRes] = await Promise.all([
          fetch('https://api.github.com/repos/jeremyspofford/tasks/issues?state=open&per_page=100', {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
          }),
          fetch('https://api.github.com/repos/jeremyspofford/tasks/issues?state=closed&per_page=20&sort=updated', {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
          }),
        ]);

        if (!openRes.ok || !closedRes.ok) {
          throw new Error('Failed to fetch from GitHub');
        }

        const [openIssues, closedIssues] = await Promise.all([
          openRes.json(),
          closedRes.json(),
        ]);

        const allIssues = [...openIssues, ...closedIssues];

        const parsed = allIssues.map((issue: any) => {
          const labels = issue.labels || [];
          const getLabel = (prefix: string) => {
            const label = labels.find((l: any) => l.name?.startsWith(prefix));
            return label ? label.name.replace(prefix, '') : null;
          };

          const status = issue.state === 'closed' ? 'done' : (getLabel('status:') || 'todo');
          const priority = getLabel('priority:') || 'medium';
          const project = getLabel('project:');

          // Parse acceptance criteria from body
          const criteria: string[] = [];
          if (issue.body) {
            for (const line of issue.body.split('\n')) {
              const match = line.match(/^-\s*\[[ x]\]\s*(.+)$/);
              if (match) criteria.push(match[1]);
            }
          }

          return {
            id: issue.number.toString(),
            title: issue.title,
            description: issue.body?.split('\n\n')[0] || '',
            acceptance_criteria: criteria,
            status,
            priority,
            project,
            assignee: issue.assignee?.login || null,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            url: issue.html_url,
          };
        });

        // Sort: in-progress first, then blocked, then todo, then done
        const statusOrder: Record<string, number> = {
          'in-progress': 0, 'blocked': 1, 'todo': 2, 'done': 3,
        };
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

        parsed.sort((a: Task, b: Task) => {
          const statusDiff = (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
          if (statusDiff !== 0) return statusDiff;
          return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
        });

        setTasks(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const projects = [...new Set(tasks.map(t => t.project).filter(Boolean))];
  
  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (projectFilter !== 'all' && task.project !== projectFilter) return false;
    return true;
  });

  const counts = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tasks</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading from GitHub Issues...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tasks</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {counts.total} total • {counts.inProgress} in progress • {counts.blocked} blocked • {counts.todo} todo
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="all">All statuses</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="todo">To Do</option>
            <option value="done">Done</option>
          </select>
          
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-sm border rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="all">All projects</option>
            {projects.map(p => (
              <option key={p} value={p!}>{p}</option>
            ))}
          </select>

          <a
            href="https://github.com/jeremyspofford/tasks/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Task
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tasks match your filters
        </div>
      )}

      <p className="mt-8 text-center text-xs text-gray-400">
        Tasks powered by <a href="https://github.com/jeremyspofford/tasks" className="underline hover:text-gray-600">GitHub Issues</a>
      </p>
    </div>
  );
}
