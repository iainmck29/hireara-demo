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

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number; // Duration in milliseconds
  description?: string;
  category?: string;
  isManual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimerState {
  taskId: string | null;
  isRunning: boolean;
  startTime: string | null;
  pausedTime: number; // Accumulated paused time in milliseconds
  totalElapsed: number; // Total elapsed time in milliseconds
  lastUpdated: string;
}

export interface TimeTrackingSession {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  isPaused: boolean;
  pausedDuration: number;
  isActive: boolean;
}

export interface TimeReport {
  userId: string;
  period: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month';
  };
  entries: TimeEntry[];
  totalTime: number; // Total time in milliseconds
  taskBreakdown: {
    taskId: string;
    taskTitle: string;
    totalTime: number;
    entryCount: number;
  }[];
  dailyBreakdown: {
    date: string;
    totalTime: number;
    entryCount: number;
  }[];
  averageSessionTime: number;
  productivityScore: number; // 0-100 score based on various metrics
  mostProductiveHour: number; // Hour of day (0-23)
  categoryBreakdown: {
    category: string;
    totalTime: number;
    percentage: number;
  }[];
}

export interface TimeTrackingPreferences {
  autoStart: boolean;
  reminderInterval: number; // Minutes
  defaultCategory: string;
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  pauseOnInactivity: boolean;
  inactivityThreshold: number; // Minutes
}