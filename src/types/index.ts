export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  department: string;
  createdAt: string;
  lastActive: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    timezone: string;
  };
}

export interface Analytics {
  overview: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
  };
  tasksByStatus: {
    todo: number;
    'in-progress': number;
    completed: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
  };
  productivityMetrics: {
    tasksCompletedThisWeek: number;
    averageCompletionTime: number;
    mostProductiveDay: string;
  };
  userActivity: {
    activeUsers: number;
    newUsersThisMonth: number;
    totalUsers: number;
  };
  trends: {
    date: string;
    completed: number;
    created: number;
  }[];
}

export interface DashboardStats {
  totalTasks: number;
  completedToday: number;
  inProgress: number;
  overdue: number;
  teamMembers: number;
  completionRate: number;
}