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
  trends: TrendData[];
}

export interface TrendData {
  date: string;
  completed: number;
  created: number;
  inProgress?: number;
  overdue?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface TeamMetrics {
  userId: string;
  userName: string;
  tasksCompleted: number;
  tasksInProgress: number;
  averageCompletionTime: number;
  productivityScore: number;
  department: string;
  completionRate: number;
}

export interface Recommendation {
  id: string;
  type: 'priority' | 'productivity' | 'workflow' | 'deadline';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  suggestedAction?: string;
  relatedTasks?: string[];
  createdAt: string;
}

export interface ProductivityInsight {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  comparison: string;
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  users?: string[];
  categories?: string[];
  priorities?: ('low' | 'medium' | 'high')[];
  statuses?: ('todo' | 'in-progress' | 'completed')[];
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  sections: string[];
}

export interface DashboardStats {
  totalTasks: number;
  completedToday: number;
  inProgress: number;
  overdue: number;
  teamMembers: number;
  completionRate: number;
}