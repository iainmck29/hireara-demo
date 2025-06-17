import {
  processTaskTrendsForChart,
  generateTeamPerformanceChart,
  getSmartInsights,
} from '../analytics';
import { getTasks, getUsers, getAnalytics } from '../data';
import { TrendData, TeamMetrics } from '@/types';

// Mock the data functions
jest.mock('../data');
const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>;
const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockedGetAnalytics = getAnalytics as jest.MockedFunction<typeof getAnalytics>;

describe('Analytics Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processTaskTrendsForChart', () => {
    it('should convert trend data to chart format correctly', () => {
      const mockTrends: TrendData[] = [
        {
          date: '2024-12-01',
          completed: 2,
          created: 1,
          inProgress: 3,
          overdue: 0,
        },
        {
          date: '2024-12-02',
          completed: 1,
          created: 2,
          inProgress: 2,
          overdue: 1,
        },
      ];

      const result = processTaskTrendsForChart(mockTrends);

      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('datasets');
      expect(result.labels).toHaveLength(2);
      expect(result.datasets).toHaveLength(3); // Completed, Created, In Progress
      
      // Check data values
      expect(result.datasets[0].data).toEqual([2, 1]); // Completed
      expect(result.datasets[1].data).toEqual([1, 2]); // Created
      expect(result.datasets[2].data).toEqual([3, 2]); // In Progress
    });

    it('should handle missing inProgress data gracefully', () => {
      const mockTrends: TrendData[] = [
        {
          date: '2024-12-01',
          completed: 2,
          created: 1,
        },
      ];

      const result = processTaskTrendsForChart(mockTrends);

      expect(result.datasets[2].data).toEqual([0]); // Should default to 0
    });

    it('should format dates correctly for labels', () => {
      const mockTrends: TrendData[] = [
        {
          date: '2024-12-01',
          completed: 1,
          created: 0,
        },
      ];

      const result = processTaskTrendsForChart(mockTrends);

      expect(result.labels[0]).toBe('Dec 1');
    });
  });

  describe('generateTeamPerformanceChart', () => {
    it('should generate correct chart data for team metrics', () => {
      const mockTeamMetrics: TeamMetrics[] = [
        {
          userId: 'user-1',
          userName: 'Alice',
          tasksCompleted: 5,
          tasksInProgress: 2,
          averageCompletionTime: 3.5,
          productivityScore: 85,
          department: 'Engineering',
          completionRate: 71.4,
        },
        {
          userId: 'user-2',
          userName: 'Bob',
          tasksCompleted: 3,
          tasksInProgress: 1,
          averageCompletionTime: 5.2,
          productivityScore: 72,
          department: 'Design',
          completionRate: 75.0,
        },
      ];

      const result = generateTeamPerformanceChart(mockTeamMetrics);

      expect(result.labels).toEqual(['Alice', 'Bob']);
      expect(result.datasets).toHaveLength(3);
      expect(result.datasets[0].data).toEqual([5, 3]); // Completed tasks
      expect(result.datasets[1].data).toEqual([2, 1]); // In progress
      expect(result.datasets[2].data).toEqual([85, 72]); // Productivity scores
    });
  });

  describe('getSmartInsights', () => {
    beforeEach(() => {
      mockedGetTasks.mockResolvedValue([
        {
          id: 'task-1',
          title: 'Test Task 1',
          description: 'Description',
          status: 'completed',
          priority: 'high',
          assigneeId: 'user-1',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-05T15:00:00Z',
          dueDate: '2024-12-10T17:00:00Z',
          tags: ['test'],
          category: 'Development',
        },
        {
          id: 'task-2',
          title: 'Test Task 2',
          description: 'Description',
          status: 'in-progress',
          priority: 'medium',
          assigneeId: 'user-2',
          createdAt: '2024-12-02T10:00:00Z',
          updatedAt: '2024-12-08T15:00:00Z',
          dueDate: '2024-12-01T17:00:00Z', // Overdue
          tags: ['test'],
          category: 'Design',
        },
      ]);

      mockedGetUsers.mockResolvedValue([
        {
          id: 'user-1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'member',
          department: 'Engineering',
          createdAt: '2024-01-01T00:00:00Z',
          lastActive: '2024-12-09T12:00:00Z',
          preferences: {
            theme: 'light',
            notifications: true,
            timezone: 'UTC',
          },
        },
        {
          id: 'user-2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'member',
          department: 'Design',
          createdAt: '2024-01-01T00:00:00Z',
          lastActive: '2024-12-09T11:00:00Z',
          preferences: {
            theme: 'dark',
            notifications: false,
            timezone: 'UTC',
          },
        },
      ]);

      mockedGetAnalytics.mockResolvedValue({
        overview: {
          totalTasks: 2,
          completedTasks: 1,
          inProgressTasks: 1,
          overdueTasks: 1,
        },
        tasksByStatus: {
          todo: 0,
          'in-progress': 1,
          completed: 1,
        },
        tasksByPriority: {
          low: 0,
          medium: 1,
          high: 1,
        },
        productivityMetrics: {
          tasksCompletedThisWeek: 1,
          averageCompletionTime: 4.0,
          mostProductiveDay: 'Monday',
        },
        userActivity: {
          activeUsers: 2,
          newUsersThisMonth: 0,
          totalUsers: 2,
        },
        trends: [
          {
            date: '2024-12-01',
            completed: 0,
            created: 1,
            inProgress: 1,
          },
          {
            date: '2024-12-02',
            completed: 1,
            created: 1,
            inProgress: 1,
          },
        ],
      });
    });

    it('should return comprehensive insights', async () => {
      const result = await getSmartInsights();

      expect(result).toHaveProperty('taskTrends');
      expect(result).toHaveProperty('productivityScore');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('riskFactors');
      expect(result).toHaveProperty('teamPerformance');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('teamMetrics');
    });

    it('should calculate productivity score correctly', async () => {
      const result = await getSmartInsights();

      expect(typeof result.productivityScore).toBe('number');
      expect(result.productivityScore).toBeGreaterThanOrEqual(0);
      expect(result.productivityScore).toBeLessThanOrEqual(100);
    });

    it('should generate AI recommendations', async () => {
      const result = await getSmartInsights();

      expect(Array.isArray(result.recommendations)).toBe(true);
      result.recommendations.forEach(rec => {
        expect(rec).toHaveProperty('id');
        expect(rec).toHaveProperty('type');
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('impact');
        expect(rec).toHaveProperty('confidence');
        expect(['deadline', 'productivity', 'workflow', 'priority']).toContain(rec.type);
        expect(['high', 'medium', 'low']).toContain(rec.impact);
      });
    });

    it('should calculate team metrics', async () => {
      const result = await getSmartInsights();

      expect(Array.isArray(result.teamMetrics)).toBe(true);
      expect(result.teamMetrics).toHaveLength(2);
      
      result.teamMetrics.forEach(metric => {
        expect(metric).toHaveProperty('userId');
        expect(metric).toHaveProperty('userName');
        expect(metric).toHaveProperty('tasksCompleted');
        expect(metric).toHaveProperty('tasksInProgress');
        expect(metric).toHaveProperty('productivityScore');
        expect(metric).toHaveProperty('completionRate');
      });
    });

    it('should identify risk factors', async () => {
      const result = await getSmartInsights();

      expect(Array.isArray(result.riskFactors)).toBe(true);
      result.riskFactors.forEach(risk => {
        expect(risk).toHaveProperty('type');
        expect(risk).toHaveProperty('message');
        expect(risk).toHaveProperty('severity');
        expect(['low', 'medium', 'high']).toContain(risk.severity);
      });
    });

    it('should generate productivity insights', async () => {
      const result = await getSmartInsights();

      expect(Array.isArray(result.insights)).toBe(true);
      result.insights.forEach(insight => {
        expect(insight).toHaveProperty('metric');
        expect(insight).toHaveProperty('value');
        expect(insight).toHaveProperty('change');
        expect(insight).toHaveProperty('trend');
        expect(['up', 'down', 'stable']).toContain(insight.trend);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle data loading errors gracefully', async () => {
      mockedGetTasks.mockRejectedValue(new Error('Data loading failed'));
      mockedGetUsers.mockRejectedValue(new Error('Data loading failed'));
      mockedGetAnalytics.mockRejectedValue(new Error('Data loading failed'));

      await expect(getSmartInsights()).rejects.toThrow('Data loading failed');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data sets', async () => {
      mockedGetTasks.mockResolvedValue([]);
      mockedGetUsers.mockResolvedValue([]);
      mockedGetAnalytics.mockResolvedValue({
        overview: {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          overdueTasks: 0,
        },
        tasksByStatus: { todo: 0, 'in-progress': 0, completed: 0 },
        tasksByPriority: { low: 0, medium: 0, high: 0 },
        productivityMetrics: {
          tasksCompletedThisWeek: 0,
          averageCompletionTime: 0,
          mostProductiveDay: 'Monday',
        },
        userActivity: { activeUsers: 0, newUsersThisMonth: 0, totalUsers: 0 },
        trends: [],
      });

      const result = await getSmartInsights();

      expect(result.productivityScore).toBe(0);
      expect(result.teamMetrics).toHaveLength(0);
      expect(result.taskTrends).toHaveLength(0);
    });

    it('should handle chart generation with empty data', () => {
      const result = processTaskTrendsForChart([]);
      
      expect(result.labels).toHaveLength(0);
      expect(result.datasets[0].data).toHaveLength(0);
    });

    it('should handle team performance chart with empty metrics', () => {
      const result = generateTeamPerformanceChart([]);
      
      expect(result.labels).toHaveLength(0);
      expect(result.datasets[0].data).toHaveLength(0);
    });
  });
});