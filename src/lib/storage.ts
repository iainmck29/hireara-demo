import { TimeEntry, TimerState, TimeTrackingSession } from '@/types';

const STORAGE_KEYS = {
  TIMER_STATE: 'taskflow_timer_state',
  TIME_ENTRIES: 'taskflow_time_entries',
  ACTIVE_SESSIONS: 'taskflow_active_sessions',
  PREFERENCES: 'taskflow_time_preferences'
} as const;

const BACKUP_KEYS = {
  TIMER_STATE: 'taskflow_timer_state_backup',
  TIME_ENTRIES: 'taskflow_time_entries_backup',
  ACTIVE_SESSIONS: 'taskflow_active_sessions_backup'
} as const;

class StorageManager {
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private isSessionStorageAvailable(): boolean {
    try {
      const test = '__session_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private compress(data: string): string {
    // Simple compression for large datasets
    return btoa(encodeURIComponent(data));
  }

  private decompress(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data; // Return original if decompression fails
    }
  }

  private setItem(key: string, value: any, useBackup: boolean = true): boolean {
    try {
      const serialized = JSON.stringify(value);
      const compressed = this.compress(serialized);
      
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(key, compressed);
        
        // Create backup in sessionStorage
        if (useBackup && this.isSessionStorageAvailable()) {
          const backupKey = this.getBackupKey(key);
          if (backupKey) {
            sessionStorage.setItem(backupKey, compressed);
          }
        }
        
        return true;
      } else if (this.isSessionStorageAvailable()) {
        sessionStorage.setItem(key, compressed);
        return true;
      }
    } catch (error) {
      console.warn(`Failed to save to storage: ${key}`, error);
      this.handleStorageError(key, error);
    }
    
    return false;
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      // Try localStorage first
      if (this.isLocalStorageAvailable()) {
        const item = localStorage.getItem(key);
        if (item) {
          const decompressed = this.decompress(item);
          return JSON.parse(decompressed);
        }
      }
      
      // Fallback to sessionStorage
      if (this.isSessionStorageAvailable()) {
        const item = sessionStorage.getItem(key);
        if (item) {
          const decompressed = this.decompress(item);
          return JSON.parse(decompressed);
        }
      }
      
      // Try backup if main storage failed
      return this.getBackupItem(key, defaultValue);
    } catch (error) {
      console.warn(`Failed to read from storage: ${key}`, error);
      return this.getBackupItem(key, defaultValue);
    }
  }

  private getBackupKey(key: string): string | null {
    switch (key) {
      case STORAGE_KEYS.TIMER_STATE:
        return BACKUP_KEYS.TIMER_STATE;
      case STORAGE_KEYS.TIME_ENTRIES:
        return BACKUP_KEYS.TIME_ENTRIES;
      case STORAGE_KEYS.ACTIVE_SESSIONS:
        return BACKUP_KEYS.ACTIVE_SESSIONS;
      default:
        return null;
    }
  }

  private getBackupItem<T>(key: string, defaultValue: T): T {
    try {
      const backupKey = this.getBackupKey(key);
      if (backupKey && this.isSessionStorageAvailable()) {
        const item = sessionStorage.getItem(backupKey);
        if (item) {
          const decompressed = this.decompress(item);
          return JSON.parse(decompressed);
        }
      }
    } catch (error) {
      console.warn(`Failed to read backup: ${key}`, error);
    }
    
    return defaultValue;
  }

  private removeItem(key: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      }
      
      if (this.isSessionStorageAvailable()) {
        sessionStorage.removeItem(key);
        const backupKey = this.getBackupKey(key);
        if (backupKey) {
          sessionStorage.removeItem(backupKey);
        }
      }
    } catch (error) {
      console.warn(`Failed to remove from storage: ${key}`, error);
    }
  }

  private handleStorageError(key: string, error: any): void {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, attempting cleanup');
      this.cleanupOldEntries();
    }
  }

  private cleanupOldEntries(): void {
    try {
      const entries = this.getTimeEntries();
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      const recentEntries = entries.filter(entry => 
        new Date(entry.createdAt).getTime() > thirtyDaysAgo
      );
      
      if (recentEntries.length !== entries.length) {
        this.saveTimeEntries(recentEntries);
        console.log(`Cleaned up ${entries.length - recentEntries.length} old entries`);
      }
    } catch (error) {
      console.warn('Failed to cleanup old entries', error);
    }
  }

  // Public API methods
  getTimerState(): TimerState | null {
    const defaultState: TimerState = {
      taskId: null,
      isRunning: false,
      startTime: null,
      pausedTime: 0,
      totalElapsed: 0,
      lastUpdated: new Date().toISOString()
    };
    
    return this.getItem(STORAGE_KEYS.TIMER_STATE, defaultState);
  }

  saveTimerState(state: TimerState): boolean {
    return this.setItem(STORAGE_KEYS.TIMER_STATE, state);
  }

  clearTimerState(): void {
    this.removeItem(STORAGE_KEYS.TIMER_STATE);
  }

  getTimeEntries(): TimeEntry[] {
    return this.getItem(STORAGE_KEYS.TIME_ENTRIES, []);
  }

  saveTimeEntries(entries: TimeEntry[]): boolean {
    return this.setItem(STORAGE_KEYS.TIME_ENTRIES, entries);
  }

  addTimeEntry(entry: TimeEntry): boolean {
    const entries = this.getTimeEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    // Sort by creation date, most recent first
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return this.saveTimeEntries(entries);
  }

  removeTimeEntry(entryId: string): boolean {
    const entries = this.getTimeEntries();
    const filteredEntries = entries.filter(entry => entry.id !== entryId);
    return this.saveTimeEntries(filteredEntries);
  }

  updateTimeEntry(entryId: string, updates: Partial<TimeEntry>): boolean {
    const entries = this.getTimeEntries();
    const entryIndex = entries.findIndex(entry => entry.id === entryId);
    
    if (entryIndex >= 0) {
      entries[entryIndex] = {
        ...entries[entryIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.saveTimeEntries(entries);
    }
    
    return false;
  }

  getTimeEntriesForTask(taskId: string): TimeEntry[] {
    return this.getTimeEntries().filter(entry => entry.taskId === taskId);
  }

  getTimeEntriesForDateRange(startDate: Date, endDate: Date): TimeEntry[] {
    const entries = this.getTimeEntries();
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.startTime).getTime();
      return entryDate >= start && entryDate <= end;
    });
  }

  getActiveSessions(): TimeTrackingSession[] {
    return this.getItem(STORAGE_KEYS.ACTIVE_SESSIONS, []);
  }

  saveActiveSessions(sessions: TimeTrackingSession[]): boolean {
    return this.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);
  }

  addActiveSession(session: TimeTrackingSession): boolean {
    const sessions = this.getActiveSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    return this.saveActiveSessions(sessions);
  }

  removeActiveSession(sessionId: string): boolean {
    const sessions = this.getActiveSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    return this.saveActiveSessions(filteredSessions);
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
    
    Object.values(BACKUP_KEYS).forEach(key => {
      if (this.isSessionStorageAvailable()) {
        sessionStorage.removeItem(key);
      }
    });
  }

  getStorageUsage(): { localStorage: number; sessionStorage: number } {
    let localStorageSize = 0;
    let sessionStorageSize = 0;
    
    try {
      if (this.isLocalStorageAvailable()) {
        const localStorageContent = JSON.stringify(localStorage);
        localStorageSize = new Blob([localStorageContent]).size;
      }
      
      if (this.isSessionStorageAvailable()) {
        const sessionStorageContent = JSON.stringify(sessionStorage);
        sessionStorageSize = new Blob([sessionStorageContent]).size;
      }
    } catch (error) {
      console.warn('Failed to calculate storage usage', error);
    }
    
    return {
      localStorage: localStorageSize,
      sessionStorage: sessionStorageSize
    };
  }

  exportData(): string {
    const data = {
      timerState: this.getTimerState(),
      timeEntries: this.getTimeEntries(),
      activeSessions: this.getActiveSessions(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.timerState) {
        this.saveTimerState(data.timerState);
      }
      
      if (Array.isArray(data.timeEntries)) {
        this.saveTimeEntries(data.timeEntries);
      }
      
      if (Array.isArray(data.activeSessions)) {
        this.saveActiveSessions(data.activeSessions);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();

// Convenience functions for common operations
export const saveTimerState = (state: TimerState) => storageManager.saveTimerState(state);
export const getTimerState = () => storageManager.getTimerState();
export const clearTimerState = () => storageManager.clearTimerState();

export const addTimeEntry = (entry: TimeEntry) => storageManager.addTimeEntry(entry);
export const getTimeEntries = () => storageManager.getTimeEntries();
export const removeTimeEntry = (id: string) => storageManager.removeTimeEntry(id);
export const updateTimeEntry = (id: string, updates: Partial<TimeEntry>) => 
  storageManager.updateTimeEntry(id, updates);

export const getTimeEntriesForTask = (taskId: string) => 
  storageManager.getTimeEntriesForTask(taskId);
export const getTimeEntriesForDateRange = (start: Date, end: Date) => 
  storageManager.getTimeEntriesForDateRange(start, end);