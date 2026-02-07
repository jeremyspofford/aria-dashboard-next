const KANBAN_API = 'https://dashboard.arialabs.ai/api/kanban';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(KANBAN_API);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const response = await fetch(KANBAN_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const response = await fetch(`${KANBAN_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${KANBAN_API}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}
