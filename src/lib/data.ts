import { Task, User, Analytics, DashboardStats } from '@/types';
import tasksData from '../../data/tasks.json';
import usersData from '../../data/users.json';
import analyticsData from '../../data/analytics.json';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

const dataCache = new DataCache();

export async function getTasks(useCache: boolean = true): Promise<Task[]> {
  const cacheKey = 'tasks';
  
  if (useCache) {
    const cached = dataCache.get<Task[]>(cacheKey);
    if (cached) return cached;
  }
  
  // Simulate async data fetching with small delay for realism
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const tasks = tasksData as Task[];
  dataCache.set(cacheKey, tasks);
  return tasks;
}

export async function getUsers(useCache: boolean = true): Promise<User[]> {
  const cacheKey = 'users';
  
  if (useCache) {
    const cached = dataCache.get<User[]>(cacheKey);
    if (cached) return cached;
  }
  
  await new Promise(resolve => setTimeout(resolve, 30));
  
  const users = usersData as User[];
  dataCache.set(cacheKey, users);
  return users;
}

export async function getAnalytics(useCache: boolean = true): Promise<Analytics> {
  const cacheKey = 'analytics';
  
  if (useCache) {
    const cached = dataCache.get<Analytics>(cacheKey);
    if (cached) return cached;
  }
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const analytics = analyticsData as Analytics;
  dataCache.set(cacheKey, analytics);
  return analytics;
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

// Cache management utilities
export function invalidateCache(key?: string): void {
  if (key) {
    dataCache.invalidate(key);
  } else {
    dataCache.clear();
  }
}

export function getCacheStats() {
  return dataCache.getStats();
}

// Performance monitoring
export async function preloadData(): Promise<void> {
  // Preload all essential data for better performance
  await Promise.all([
    getTasks(false), // Force fresh load
    getUsers(false),
    getAnalytics(false),
  ]);
}

// Batch data fetching for analytics
export async function getBatchAnalyticsData(): Promise<{
  tasks: Task[];
  users: User[];
  analytics: Analytics;
}> {
  const [tasks, users, analytics] = await Promise.all([
    getTasks(),
    getUsers(),
    getAnalytics(),
  ]);
  
  return { tasks, users, analytics };
}

// Optimized filtering with memoization
const filterCache = new Map<string, any>();

export async function getFilteredTasks(
  filters: {
    status?: Task['status'];
    priority?: Task['priority'];
    assigneeId?: string;
    category?: string;
    overdue?: boolean;
  }
): Promise<Task[]> {
  const filterKey = JSON.stringify(filters);
  const cacheKey = `filtered-tasks-${filterKey}`;
  
  const cached = filterCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < 60000) { // 1 minute cache
    return cached.data;
  }
  
  const tasks = await getTasks();
  let filtered = tasks;
  
  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status);
  }
  
  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }
  
  if (filters.assigneeId) {
    filtered = filtered.filter(task => task.assigneeId === filters.assigneeId);
  }
  
  if (filters.category) {
    filtered = filtered.filter(task => task.category === filters.category);
  }
  
  if (filters.overdue) {
    const now = new Date();
    filtered = filtered.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      return new Date(task.dueDate) < now;
    });
  }
  
  filterCache.set(cacheKey, {
    data: filtered,
    timestamp: Date.now(),
  });
  
  return filtered;
}

// Real-time data simulation (for demo purposes)
export function subscribeToDataUpdates(callback: () => void): () => void {
  // Simulate real-time updates every 30 seconds
  const interval = setInterval(() => {
    // Invalidate cache to force fresh data
    invalidateCache();
    callback();
  }, 30000);
  
  return () => clearInterval(interval);
}