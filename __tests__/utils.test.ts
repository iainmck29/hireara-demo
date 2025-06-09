import { formatDate, formatDateTime, getRelativeTime, getPriorityColor, getStatusColor } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date string correctly', () => {
    const date = '2024-12-09T14:30:00Z';
    const formatted = formatDate(date);
    expect(formatted).toBe('Dec 9, 2024');
  });
});

describe('formatDateTime', () => {
  it('formats datetime string correctly', () => {
    const date = '2024-12-09T14:30:00Z';
    const formatted = formatDateTime(date);
    expect(formatted).toMatch(/Dec 9, 2024.*/);
  });
});

describe('getRelativeTime', () => {
  it('returns "just now" for recent times', () => {
    const now = new Date();
    const recent = new Date(now.getTime() - 30000); // 30 seconds ago
    expect(getRelativeTime(recent.toISOString())).toBe('just now');
  });

  it('returns minutes for times within an hour', () => {
    const now = new Date();
    const minutesAgo = new Date(now.getTime() - 300000); // 5 minutes ago
    expect(getRelativeTime(minutesAgo.toISOString())).toBe('5 minutes ago');
  });

  it('returns hours for times within a day', () => {
    const now = new Date();
    const hoursAgo = new Date(now.getTime() - 7200000); // 2 hours ago
    expect(getRelativeTime(hoursAgo.toISOString())).toBe('2 hours ago');
  });
});

describe('getPriorityColor', () => {
  it('returns correct colors for priorities', () => {
    expect(getPriorityColor('high')).toBe('text-red-600 bg-red-100');
    expect(getPriorityColor('medium')).toBe('text-yellow-600 bg-yellow-100');
    expect(getPriorityColor('low')).toBe('text-green-600 bg-green-100');
  });
});

describe('getStatusColor', () => {
  it('returns correct colors for statuses', () => {
    expect(getStatusColor('completed')).toBe('text-green-600 bg-green-100');
    expect(getStatusColor('in-progress')).toBe('text-blue-600 bg-blue-100');
    expect(getStatusColor('todo')).toBe('text-gray-600 bg-gray-100');
  });
});