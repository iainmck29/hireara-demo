import { Task, User, Analytics, DashboardStats } from '@/types';
import tasksData from '../../data/tasks.json';
import usersData from '../../data/users.json';
import analyticsData from '../../data/analytics.json';

export async function getTasks(): Promise<Task[]> {
  return tasksData as Task[];
}

export async function getUsers(): Promise<User[]> {
  return usersData as User[];
}

export async function getAnalytics(): Promise<Analytics> {
  return analyticsData as Analytics;
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const tasks = await getTasks();
  return tasks.find((task) => task.id === id);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((user) => user.id === id);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const tasks = await getTasks();
  const users = await getUsers();
  
  const today = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(
    (task) => 
      task.status === 'completed' && 
      task.updatedAt.split('T')[0] === today
  ).length;
  
  const overdue = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate < now && task.status !== 'completed';
  }).length;
  
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const completionRate = Math.round((completedTasks / tasks.length) * 100);
  
  return {
    totalTasks: tasks.length,
    completedToday,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    overdue,
    teamMembers: users.length,
    completionRate,
  };
}

export async function getTasksByStatus(status: Task['status']): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter((task) => task.status === status);
}

export async function getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter((task) => task.priority === priority);
}