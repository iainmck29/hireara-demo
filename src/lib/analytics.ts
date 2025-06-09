import { Task, User } from '@/types';
import { getAnalytics, getTasks, getUsers } from './data';

export async function getSmartInsights() {
  const [analytics, tasks, users] = await Promise.all([
    getAnalytics(),
    getTasks(),
    getUsers(),
  ]);

  // This is the foundation for Smart Task Insights feature
  // The actual AI-powered insights would be implemented here
  return {
    taskTrends: analytics.trends,
    productivityScore: calculateProductivityScore(tasks),
    recommendations: generateBasicRecommendations(tasks, users),
    riskFactors: identifyRiskFactors(tasks),
    teamPerformance: analyzeTeamPerformance(tasks, users),
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

function generateBasicRecommendations(tasks: Task[], _users: User[]): string[] {
  const recommendations: string[] = [];
  
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  });
  
  if (overdueTasks.length > 0) {
    recommendations.push(`You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider prioritizing these items.`);
  }
  
  const highPriorityTasks = tasks.filter(task => 
    task.priority === 'high' && task.status !== 'completed'
  );
  
  if (highPriorityTasks.length > 3) {
    recommendations.push('You have many high-priority tasks. Consider reassigning some to balance the workload.');
  }
  
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  if (inProgressTasks.length > 5) {
    recommendations.push('Many tasks are in progress. Focus on completing existing tasks before starting new ones.');
  }
  
  return recommendations;
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