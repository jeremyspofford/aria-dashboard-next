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
  const response = await fetch('/data/tasks.json');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await response.json();
  return data.tasks || [];
}
