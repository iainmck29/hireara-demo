'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TimerState, TimeEntry, TimeTrackingSession } from '@/types';
import { 
  createTimerState, 
  updateTimerState, 
  createTimeEntry, 
  calculateElapsed 
} from '@/lib/timeTracking';
import { 
  saveTimerState, 
  getTimerState, 
  addTimeEntry, 
  getTimeEntries,
  storageManager 
} from '@/lib/storage';

interface TimeTrackingState {
  timerState: TimerState;
  timeEntries: TimeEntry[];
  activeSessions: TimeTrackingSession[];
  isLoading: boolean;
  error: string | null;
  currentUserId: string;
}

type TimeTrackingAction =
  | { type: 'INITIALIZE'; payload: { timerState: TimerState; timeEntries: TimeEntry[] } }
  | { type: 'START_TIMER'; payload: { taskId: string } }
  | { type: 'STOP_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'UPDATE_TIMER'; payload: { elapsed: number } }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'UPDATE_TIME_ENTRY'; payload: { id: string; entry: Partial<TimeEntry> } }
  | { type: 'REMOVE_TIME_ENTRY'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: TimeTrackingState = {
  timerState: createTimerState(),
  timeEntries: [],
  activeSessions: [],
  isLoading: true,
  error: null,
  currentUserId: 'user-1' // Default user ID - in real app this would come from auth
};

function timeTrackingReducer(
  state: TimeTrackingState,
  action: TimeTrackingAction
): TimeTrackingState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        timerState: action.payload.timerState,
        timeEntries: action.payload.timeEntries,
        isLoading: false,
        error: null
      };

    case 'START_TIMER':
      if (state.timerState.isRunning) {
        // Stop current timer first and save as time entry
        const currentTimer = state.timerState;
        if (currentTimer.taskId && currentTimer.startTime) {
          const elapsed = calculateElapsed(currentTimer.startTime, undefined, currentTimer.pausedTime);
          if (elapsed > 0) {
            const timeEntry = createTimeEntry(
              currentTimer.taskId,
              state.currentUserId,
              currentTimer.startTime,
              new Date().toISOString(),
              undefined,
              undefined,
              false
            );
            addTimeEntry(timeEntry);
          }
        }
      }

      const newTimerState = updateTimerState(state.timerState, 'start', action.payload.taskId);
      saveTimerState(newTimerState);
      
      return {
        ...state,
        timerState: newTimerState,
        error: null
      };

    case 'STOP_TIMER':
      // Save current session as time entry if there's elapsed time
      if (state.timerState.isRunning && state.timerState.taskId && state.timerState.startTime) {
        const elapsed = calculateElapsed(
          state.timerState.startTime, 
          undefined, 
          state.timerState.pausedTime
        );
        
        if (elapsed > 0) {
          const timeEntry = createTimeEntry(
            state.timerState.taskId,
            state.currentUserId,
            state.timerState.startTime,
            new Date().toISOString(),
            undefined,
            undefined,
            false
          );
          addTimeEntry(timeEntry);
        }
      }

      const stoppedState = updateTimerState(state.timerState, 'stop');
      saveTimerState(stoppedState);
      
      return {
        ...state,
        timerState: stoppedState,
        error: null
      };

    case 'PAUSE_TIMER':
      const pausedState = updateTimerState(state.timerState, 'pause');
      saveTimerState(pausedState);
      
      return {
        ...state,
        timerState: pausedState,
        error: null
      };

    case 'RESUME_TIMER':
      const resumedState = updateTimerState(state.timerState, 'resume');
      saveTimerState(resumedState);
      
      return {
        ...state,
        timerState: resumedState,
        error: null
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timerState: {
          ...state.timerState,
          totalElapsed: action.payload.elapsed,
          lastUpdated: new Date().toISOString()
        }
      };

    case 'ADD_TIME_ENTRY':
      addTimeEntry(action.payload);
      return {
        ...state,
        timeEntries: [action.payload, ...state.timeEntries],
        error: null
      };

    case 'UPDATE_TIME_ENTRY':
      const updatedEntries = state.timeEntries.map(entry =>
        entry.id === action.payload.id
          ? { ...entry, ...action.payload.entry, updatedAt: new Date().toISOString() }
          : entry
      );
      
      return {
        ...state,
        timeEntries: updatedEntries,
        error: null
      };

    case 'REMOVE_TIME_ENTRY':
      storageManager.removeTimeEntry(action.payload.id);
      return {
        ...state,
        timeEntries: state.timeEntries.filter(entry => entry.id !== action.payload.id),
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

interface TimeTrackingContextType {
  state: TimeTrackingState;
  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  addManualEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void;
  removeEntry: (id: string) => void;
  getCurrentElapsed: () => number;
  getEntriesForTask: (taskId: string) => TimeEntry[];
  getEntriesForDateRange: (start: Date, end: Date) => TimeEntry[];
  clearError: () => void;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined);

interface TimeTrackingProviderProps {
  children: ReactNode;
  userId?: string;
}

export function TimeTrackingProvider({ children, userId = 'user-1' }: TimeTrackingProviderProps) {
  const [state, dispatch] = useReducer(timeTrackingReducer, {
    ...initialState,
    currentUserId: userId
  });

  // Initialize data from storage on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const timerState = getTimerState() || createTimerState();
        const timeEntries = getTimeEntries();
        
        dispatch({
          type: 'INITIALIZE',
          payload: { timerState, timeEntries }
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to initialize time tracking'
        });
      }
    };

    initializeData();
  }, []);

  // Update timer every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.timerState.isRunning && state.timerState.startTime) {
      interval = setInterval(() => {
        const elapsed = calculateElapsed(
          state.timerState.startTime!,
          undefined,
          state.timerState.pausedTime
        );
        dispatch({ type: 'UPDATE_TIMER', payload: { elapsed } });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.timerState.isRunning, state.timerState.startTime]);

  // Save timer state to storage when it changes
  useEffect(() => {
    if (!state.isLoading) {
      saveTimerState(state.timerState);
    }
  }, [state.timerState, state.isLoading]);

  // Context methods
  const startTimer = (taskId: string) => {
    dispatch({ type: 'START_TIMER', payload: { taskId } });
  };

  const stopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const resumeTimer = () => {
    dispatch({ type: 'RESUME_TIMER' });
  };

  const addManualEntry = (entryData: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const entry = createTimeEntry(
      entryData.taskId,
      entryData.userId,
      entryData.startTime,
      entryData.endTime,
      entryData.description,
      entryData.category,
      true
    );
    dispatch({ type: 'ADD_TIME_ENTRY', payload: entry });
  };

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    storageManager.updateTimeEntry(id, updates);
    dispatch({ type: 'UPDATE_TIME_ENTRY', payload: { id, entry: updates } });
  };

  const removeEntry = (id: string) => {
    dispatch({ type: 'REMOVE_TIME_ENTRY', payload: { id } });
  };

  const getCurrentElapsed = (): number => {
    if (!state.timerState.isRunning || !state.timerState.startTime) {
      return state.timerState.totalElapsed;
    }
    
    return calculateElapsed(
      state.timerState.startTime,
      undefined,
      state.timerState.pausedTime
    );
  };

  const getEntriesForTask = (taskId: string): TimeEntry[] => {
    return state.timeEntries.filter(entry => entry.taskId === taskId);
  };

  const getEntriesForDateRange = (start: Date, end: Date): TimeEntry[] => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    return state.timeEntries.filter(entry => {
      const entryTime = new Date(entry.startTime).getTime();
      return entryTime >= startTime && entryTime <= endTime;
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: TimeTrackingContextType = {
    state,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    addManualEntry,
    updateEntry,
    removeEntry,
    getCurrentElapsed,
    getEntriesForTask,
    getEntriesForDateRange,
    clearError
  };

  return (
    <TimeTrackingContext.Provider value={contextValue}>
      {children}
    </TimeTrackingContext.Provider>
  );
}

export function useTimeTracking(): TimeTrackingContextType {
  const context = useContext(TimeTrackingContext);
  if (context === undefined) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  }
  return context;
}

// Custom hooks for common operations
export function useTimer(taskId?: string) {
  const { state, startTimer, stopTimer, pauseTimer, resumeTimer, getCurrentElapsed } = useTimeTracking();
  
  const isActiveForTask = state.timerState.taskId === taskId;
  const isRunning = state.timerState.isRunning && isActiveForTask;
  const elapsed = isActiveForTask ? getCurrentElapsed() : 0;
  
  return {
    isRunning,
    elapsed,
    isActiveForTask,
    start: () => taskId && startTimer(taskId),
    stop: stopTimer,
    pause: pauseTimer,
    resume: resumeTimer
  };
}

export function useTaskTimeEntries(taskId: string) {
  const { state, getEntriesForTask } = useTimeTracking();
  
  const entries = getEntriesForTask(taskId);
  const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const entryCount = entries.length;
  
  return {
    entries,
    totalTime,
    entryCount,
    isEmpty: entries.length === 0
  };
}