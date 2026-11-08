import { getAccessToken } from './googleAuth';

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
  selfLink?: string;
}

export interface GoogleTaskItem {
  id: string;
  title: string;
  updated?: string;
  selfLink?: string;
  parent?: string;
  position?: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  deleted?: boolean;
  hidden?: boolean;
}

/**
 * List all task lists for the authenticated user
 */
export async function listTaskLists(): Promise<GoogleTaskList[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Tasks.');
  }

  const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch task lists (status ${res.status}).`);
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Create a new task list
 */
export async function createTaskList(title: string): Promise<GoogleTaskList> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Tasks.');
  }

  const res = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create task list (status ${res.status}).`);
  }

  return res.json();
}

/**
 * List tasks in a task list
 */
export async function listTasks(taskListId: string, showCompleted: boolean = true): Promise<GoogleTaskItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Tasks.');
  }

  const queryParams = new URLSearchParams({
    showCompleted: String(showCompleted),
    showHidden: 'true',
  });

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch tasks (status ${res.status}).`);
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Create a new task (Requires user confirmation)
 */
export async function createGoogleTask(
  taskListId: string,
  task: { title: string; notes?: string; due?: string }
): Promise<GoogleTaskItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Tasks.');
  }

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: task.title,
      notes: task.notes || '',
      due: task.due || undefined,
      status: 'needsAction',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create task (status ${res.status}).`);
  }

  return res.json();
}

/**
 * Update a task's completion status (Requires user confirmation)
 */
export async function updateGoogleTaskStatus(
  taskListId: string,
  taskId: string,
  status: 'needsAction' | 'completed'
): Promise<GoogleTaskItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Tasks.');
  }

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      completed: status === 'completed' ? new Date().toISOString() : null,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update task status (status ${res.status}).`);
  }

  return res.json();
}

/**
 * Delete a task (Requires user confirmation)
 */
export async function deleteGoogleTask(taskListId: string, taskId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google Tasks.');
  }

  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete task (status ${res.status}).`);
  }
}
