export interface Task {
  id: string;
  title: string;
  description?: string;
  acceptance_criteria?: string[];
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
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
