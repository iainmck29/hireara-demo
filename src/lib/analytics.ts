import { 
  Task, 
  User, 
  Analytics,
  TrendData,
  ChartData,
  TeamMetrics,
  Recommendation,
  ProductivityInsight,
  AnalyticsFilters 
} from '@/types';
import { getAnalytics, getTasks, getUsers } from './data';

export async function getSmartInsights() {
  const [analytics, tasks, users] = await Promise.all([
    getAnalytics(),
    getTasks(),
    getUsers(),
  ]);

  return {
    taskTrends: analytics.trends,
    productivityScore: calculateProductivityScore(tasks),
    recommendations: generateAIRecommendations(tasks, users, analytics),
    riskFactors: identifyRiskFactors(tasks),
    teamPerformance: analyzeTeamPerformance(tasks, users),
    insights: generateProductivityInsights(tasks, analytics),
    teamMetrics: calculateTeamMetrics(tasks, users),
  };
}

export async function calculateTaskTrends(filters?: AnalyticsFilters): Promise<TrendData[]> {
  const analytics = await getAnalytics();
  let trends = analytics.trends;

  if (filters?.dateRange) {
    trends = trends.filter(trend => {
      const trendDate = new Date(trend.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      return trendDate >= startDate && trendDate <= endDate;
    });
  }

  return trends;
}

export function processTaskTrendsForChart(trends: TrendData[]): ChartData {
  return {
    labels: trends.map(trend => {
      const date = new Date(trend.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Completed',
        data: trends.map(trend => trend.completed),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Created',
        data: trends.map(trend => trend.created),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'In Progress',
        data: trends.map(trend => trend.inProgress || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ]
  };
}

export function generateTeamPerformanceChart(teamMetrics: TeamMetrics[]): ChartData {
  return {
    labels: teamMetrics.map(member => member.userName),
    datasets: [
      {
        label: 'Completed Tasks',
        data: teamMetrics.map(member => member.tasksCompleted),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'In Progress',
        data: teamMetrics.map(member => member.tasksInProgress),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
      {
        label: 'Productivity Score',
        data: teamMetrics.map(member => member.productivityScore),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      },
    ]
  };
}

function calculateProductivityScore(tasks: Task[]): number {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  
  if (totalTasks === 0) return 0;
  
  const completionRate = (completedTasks / totalTasks) * 100;
  
  // Factor in overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  }).length;
  
  const overduepenalty = (overdueTasks / totalTasks) * 20;
  
  return Math.max(0, Math.min(100, completionRate - overduepenalty));
}

function generateAIRecommendations(tasks: Task[], users: User[], analytics: Analytics): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Deadline-based recommendations
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  });
  
  if (overdueTasks.length > 0) {
    const highPriorityOverdue = overdueTasks.filter(task => task.priority === 'high');
    if (highPriorityOverdue.length > 0) {
      recommendations.push({
        id: `deadline-${Date.now()}`,
        type: 'deadline',
        title: 'Critical Deadline Alert',
        description: `${highPriorityOverdue.length} high-priority task${highPriorityOverdue.length > 1 ? 's are' : ' is'} overdue`,
        impact: 'high',
        confidence: 95,
        actionable: true,
        suggestedAction: 'Prioritize overdue high-priority tasks immediately or extend deadlines',
        relatedTasks: highPriorityOverdue.map(task => task.id),
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Workload balance recommendations
  const userTaskCounts = tasks.reduce((acc, task) => {
    if (task.status !== 'completed') {
      acc[task.assigneeId] = (acc[task.assigneeId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const taskCounts = Object.values(userTaskCounts);
  const maxTasks = Math.max(...taskCounts);
  const minTasks = Math.min(...taskCounts);
  
  if (maxTasks - minTasks > 3) {
    recommendations.push({
      id: `workload-${Date.now()}`,
      type: 'productivity',
      title: 'Team Workload Imbalance',
      description: 'Uneven task distribution may impact team productivity',
      impact: 'medium',
      confidence: 82,
      actionable: true,
      suggestedAction: 'Redistribute tasks to balance workload across team members',
      createdAt: new Date().toISOString(),
    });
  }

  // Productivity pattern recommendations
  const completionRate = (analytics.overview.completedTasks / analytics.overview.totalTasks) * 100;
  if (completionRate < 30) {
    recommendations.push({
      id: `productivity-${Date.now()}`,
      type: 'productivity',
      title: 'Low Task Completion Rate',
      description: `Current completion rate is ${completionRate.toFixed(1)}%, below optimal threshold`,
      impact: 'high',
      confidence: 88,
      actionable: true,
      suggestedAction: 'Focus on completing existing tasks before taking on new ones',
      createdAt: new Date().toISOString(),
    });
  }

  // Workflow optimization recommendations
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  if (inProgressTasks.length > Math.ceil(tasks.length * 0.6)) {
    recommendations.push({
      id: `workflow-${Date.now()}`,
      type: 'workflow',
      title: 'Too Many Tasks in Progress',
      description: 'High number of concurrent tasks may reduce focus and efficiency',
      impact: 'medium',
      confidence: 75,
      actionable: true,
      suggestedAction: 'Implement work-in-progress limits to improve focus',
      createdAt: new Date().toISOString(),
    });
  }

  return recommendations;
}

function generateProductivityInsights(tasks: Task[], analytics: Analytics): ProductivityInsight[] {
  const insights: ProductivityInsight[] = [];
  
  // Task completion rate insight
  const completionRate = (analytics.overview.completedTasks / analytics.overview.totalTasks) * 100;
  const previousWeekCompletion = 35; // Mock previous period data
  const completionChange = completionRate - previousWeekCompletion;
  
  insights.push({
    metric: 'Task Completion Rate',
    value: Math.round(completionRate),
    change: Math.round(completionChange * 10) / 10,
    trend: completionChange > 0 ? 'up' : completionChange < 0 ? 'down' : 'stable',
    period: 'This Week',
    comparison: 'vs Last Week',
  });

  // Average resolution time insight
  const avgResolutionTime = analytics.productivityMetrics.averageCompletionTime;
  const previousAvgTime = 6.8; // Mock previous period data
  const timeChange = avgResolutionTime - previousAvgTime;
  
  insights.push({
    metric: 'Average Resolution Time',
    value: avgResolutionTime,
    change: Math.round(timeChange * 10) / 10,
    trend: timeChange > 0 ? 'up' : timeChange < 0 ? 'down' : 'stable',
    period: 'Last 30 Days',
    comparison: 'vs Previous Period',
  });

  // Team productivity score
  const productivityScore = calculateProductivityScore(tasks);
  
  insights.push({
    metric: 'Team Productivity Score',
    value: Math.round(productivityScore),
    change: 0,
    trend: 'stable',
    period: 'Current Month',
    comparison: 'vs Last Month',
  });

  return insights;
}

export function calculateTeamMetrics(tasks: Task[], users: User[]): TeamMetrics[] {
  return users.map(user => {
    const userTasks = tasks.filter(task => task.assigneeId === user.id);
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    const inProgressTasks = userTasks.filter(task => task.status === 'in-progress');
    
    // Calculate average completion time (mock calculation)
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          if (task.createdAt && task.updatedAt) {
            const created = new Date(task.createdAt);
            const updated = new Date(task.updatedAt);
            return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          }
          return sum;
        }, 0) / completedTasks.length 
      : 0;

    const completionRate = userTasks.length > 0 
      ? (completedTasks.length / userTasks.length) * 100 
      : 0;

    // Calculate productivity score based on completion rate and task difficulty
    const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high').length;
    const productivityScore = Math.min(100, 
      (completionRate * 0.7) + 
      (highPriorityCompleted * 10) + 
      (avgCompletionTime < 7 ? 20 : 0)
    );

    return {
      userId: user.id,
      userName: user.name,
      tasksCompleted: completedTasks.length,
      tasksInProgress: inProgressTasks.length,
      averageCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      productivityScore: Math.round(productivityScore),
      department: user.department,
      completionRate: Math.round(completionRate * 10) / 10,
    };
  });
}

function identifyRiskFactors(tasks: Task[]): Array<{type: string; message: string; severity: 'low' | 'medium' | 'high'}> {
  const risks: Array<{type: string; message: string; severity: 'low' | 'medium' | 'high'}> = [];
  
  // Check for overdue high-priority tasks
  const overdueHighPriority = tasks.filter(task => 
    task.priority === 'high' && 
    task.status !== 'completed' &&
    task.dueDate &&
    new Date(task.dueDate) < new Date()
  );
  
  if (overdueHighPriority.length > 0) {
    risks.push({
      type: 'Overdue Critical Tasks',
      message: `${overdueHighPriority.length} high-priority task${overdueHighPriority.length > 1 ? 's are' : ' is'} overdue`,
      severity: 'high'
    });
  }
  
  // Check for task distribution
  const userTaskCounts = tasks.reduce((acc, task) => {
    acc[task.assigneeId] = (acc[task.assigneeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const maxTasks = Math.max(...Object.values(userTaskCounts));
  const minTasks = Math.min(...Object.values(userTaskCounts));
  
  if (maxTasks - minTasks > 5) {
    risks.push({
      type: 'Workload Imbalance',
      message: 'Uneven task distribution across team members',
      severity: 'medium'
    });
  }
  
  return risks;
}

function analyzeTeamPerformance(tasks: Task[], users: User[]): Array<{userId: string; name: string; metrics: {completed: number; inProgress: number; overdue: number}}> {
  return users.map(user => {
    const userTasks = tasks.filter(task => task.assigneeId === user.id);
    const completed = userTasks.filter(task => task.status === 'completed').length;
    const inProgress = userTasks.filter(task => task.status === 'in-progress').length;
    const overdue = userTasks.filter(task => 
      task.status !== 'completed' &&
      task.dueDate &&
      new Date(task.dueDate) < new Date()
    ).length;
    
    return {
      userId: user.id,
      name: user.name,
      metrics: { completed, inProgress, overdue }
    };
  });
}