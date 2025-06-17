import { TimeEntry, TimerState, TimeReport, TimeTrackingSession } from '@/types';

export function formatDuration(
  milliseconds: number,
  format: 'short' | 'long' | 'clock' = 'clock',
  showSeconds: boolean = true
): string {
  if (milliseconds < 0) return '00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  switch (format) {
    case 'short':
      if (hours > 0) return `${hours}h ${minutes}m`;
      if (minutes > 0) return `${minutes}m`;
      return showSeconds ? `${seconds}s` : '0m';
    
    case 'long':
      const parts = [];
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      if (showSeconds && seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
      return parts.length > 0 ? parts.join(', ') : '0 seconds';
    
    case 'clock':
    default:
      const h = hours.toString().padStart(2, '0');
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');
      return showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  }
}

export function calculateElapsed(startTime: string, endTime?: string, pausedTime: number = 0): number {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  
  if (isNaN(start) || isNaN(end)) return 0;
  if (end < start) return 0;
  
  const elapsed = end - start - pausedTime;
  return Math.max(0, elapsed);
}

export function validateTimeEntry(entry: Partial<TimeEntry>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!entry.taskId?.trim()) {
    errors.push('Task ID is required');
  }
  
  if (!entry.startTime) {
    errors.push('Start time is required');
  }
  
  if (!entry.endTime) {
    errors.push('End time is required');
  }
  
  if (entry.startTime && entry.endTime) {
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    
    if (isNaN(start.getTime())) {
      errors.push('Invalid start time format');
    }
    
    if (isNaN(end.getTime())) {
      errors.push('Invalid end time format');
    }
    
    if (start.getTime() >= end.getTime()) {
      errors.push('End time must be after start time');
    }
    
    if (start.getTime() > Date.now()) {
      errors.push('Start time cannot be in the future');
    }
    
    if (end.getTime() > Date.now()) {
      errors.push('End time cannot be in the future');
    }
    
    const duration = end.getTime() - start.getTime();
    if (duration > 24 * 60 * 60 * 1000) {
      errors.push('Time entry cannot exceed 24 hours');
    }
  }
  
  if (entry.description && entry.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function generateTimeReport(
  entries: TimeEntry[],
  userId: string,
  startDate: Date,
  endDate: Date,
  type: 'day' | 'week' | 'month' = 'week'
): TimeReport {
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    return entry.userId === userId && 
           entryDate >= startDate && 
           entryDate <= endDate;
  });
  
  const totalTime = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0);
  
  // Task breakdown
  const taskMap = new Map<string, { totalTime: number; entryCount: number; title: string }>();
  filteredEntries.forEach(entry => {
    const existing = taskMap.get(entry.taskId) || { totalTime: 0, entryCount: 0, title: entry.taskId };
    taskMap.set(entry.taskId, {
      totalTime: existing.totalTime + entry.duration,
      entryCount: existing.entryCount + 1,
      title: existing.title
    });
  });
  
  const taskBreakdown = Array.from(taskMap.entries()).map(([taskId, data]) => ({
    taskId,
    taskTitle: data.title,
    totalTime: data.totalTime,
    entryCount: data.entryCount
  }));
  
  // Daily breakdown
  const dailyMap = new Map<string, { totalTime: number; entryCount: number }>();
  filteredEntries.forEach(entry => {
    const date = new Date(entry.startTime).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { totalTime: 0, entryCount: 0 };
    dailyMap.set(date, {
      totalTime: existing.totalTime + entry.duration,
      entryCount: existing.entryCount + 1
    });
  });
  
  const dailyBreakdown = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    totalTime: data.totalTime,
    entryCount: data.entryCount
  }));
  
  // Category breakdown
  const categoryMap = new Map<string, number>();
  filteredEntries.forEach(entry => {
    const category = entry.category || 'Uncategorized';
    categoryMap.set(category, (categoryMap.get(category) || 0) + entry.duration);
  });
  
  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, time]) => ({
    category,
    totalTime: time,
    percentage: totalTime > 0 ? (time / totalTime) * 100 : 0
  }));
  
  // Calculate metrics
  const averageSessionTime = filteredEntries.length > 0 ? totalTime / filteredEntries.length : 0;
  const productivityScore = calculateProductivityScore(filteredEntries, dailyBreakdown);
  const mostProductiveHour = getMostProductiveHour(filteredEntries);
  
  return {
    userId,
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      type
    },
    entries: filteredEntries,
    totalTime,
    taskBreakdown,
    dailyBreakdown,
    averageSessionTime,
    productivityScore,
    mostProductiveHour,
    categoryBreakdown
  };
}

function calculateProductivityScore(entries: TimeEntry[], dailyBreakdown: any[]): number {
  if (entries.length === 0) return 0;
  
  // Base score on consistency and session length
  const consistencyScore = Math.min(dailyBreakdown.length * 20, 60); // Max 60 for 3+ days
  const avgSessionTime = entries.reduce((sum, e) => sum + e.duration, 0) / entries.length;
  const sessionScore = Math.min((avgSessionTime / (30 * 60 * 1000)) * 40, 40); // Max 40 for 30+ min sessions
  
  return Math.round(consistencyScore + sessionScore);
}

function getMostProductiveHour(entries: TimeEntry[]): number {
  const hourMap = new Map<number, number>();
  
  entries.forEach(entry => {
    const hour = new Date(entry.startTime).getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + entry.duration);
  });
  
  let maxTime = 0;
  let mostProductiveHour = 9; // Default to 9 AM
  
  hourMap.forEach((time, hour) => {
    if (time > maxTime) {
      maxTime = time;
      mostProductiveHour = hour;
    }
  });
  
  return mostProductiveHour;
}

export function createTimeEntry(
  taskId: string,
  userId: string,
  startTime: string,
  endTime: string,
  description?: string,
  category?: string,
  isManual: boolean = false
): TimeEntry {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const duration = end - start;
  
  return {
    id: generateId(),
    taskId,
    userId,
    startTime,
    endTime,
    duration,
    description,
    category,
    isManual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function createTimerState(): TimerState {
  return {
    taskId: null,
    isRunning: false,
    startTime: null,
    pausedTime: 0,
    totalElapsed: 0,
    lastUpdated: new Date().toISOString()
  };
}

export function updateTimerState(
  state: TimerState,
  action: 'start' | 'stop' | 'pause' | 'resume',
  taskId?: string
): TimerState {
  const now = new Date().toISOString();
  
  switch (action) {
    case 'start':
      return {
        ...state,
        taskId: taskId || state.taskId,
        isRunning: true,
        startTime: now,
        pausedTime: 0,
        totalElapsed: 0,
        lastUpdated: now
      };
    
    case 'stop':
      return {
        ...state,
        isRunning: false,
        taskId: null,
        startTime: null,
        pausedTime: 0,
        totalElapsed: 0,
        lastUpdated: now
      };
    
    case 'pause':
      if (!state.isRunning || !state.startTime) return state;
      
      const elapsed = calculateElapsed(state.startTime, now, state.pausedTime);
      return {
        ...state,
        isRunning: false,
        totalElapsed: elapsed,
        lastUpdated: now
      };
    
    case 'resume':
      if (state.isRunning || !state.taskId) return state;
      
      return {
        ...state,
        isRunning: true,
        startTime: now,
        pausedTime: 0,
        lastUpdated: now
      };
    
    default:
      return state;
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidTimeFormat(timeString: string): boolean {
  const date = new Date(timeString);
  return !isNaN(date.getTime()) && date.getTime() > 0;
}

export function roundToNearestMinute(date: Date): Date {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  return rounded;
}

export function getTimeCategories(): string[] {
  return [
    'Development',
    'Testing',
    'Documentation',
    'Meeting',
    'Review',
    'Planning',
    'Research',
    'Bug Fix',
    'Other'
  ];
}