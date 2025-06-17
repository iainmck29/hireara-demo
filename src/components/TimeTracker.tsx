'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Timer } from 'lucide-react';
import { useTimer } from '@/contexts/TimeTrackingContext';
import { formatDuration } from '@/lib/timeTracking';

interface TimeTrackerProps {
  taskId: string;
  variant?: 'compact' | 'full';
  showElapsed?: boolean;
  className?: string;
}

export function TimeTracker({ 
  taskId, 
  variant = 'compact', 
  showElapsed = true, 
  className = '' 
}: TimeTrackerProps) {
  const { isRunning, elapsed, isActiveForTask, start, stop, pause, resume } = useTimer(taskId);
  const [displayTime, setDisplayTime] = useState(elapsed);

  // Update display time when elapsed changes
  useEffect(() => {
    setDisplayTime(elapsed);
  }, [elapsed]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle spacebar when the timer is focused and not in an input
      if (
        event.code === 'Space' && 
        isActiveForTask &&
        event.target &&
        !(event.target as HTMLElement).matches('input, textarea, [contenteditable]')
      ) {
        event.preventDefault();
        handlePlayPause();
      }
    };

    if (isActiveForTask) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isActiveForTask, isRunning]);

  const handlePlayPause = () => {
    if (isRunning) {
      pause();
    } else if (isActiveForTask && !isRunning) {
      resume();
    } else {
      start();
    }
  };

  const handleStop = () => {
    stop();
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showElapsed && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-3 w-3" />
            <span className="font-mono">
              {formatDuration(displayTime, 'clock', false)}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={handlePlayPause}
            className={`
              p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
              ${isRunning 
                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100 focus:ring-orange-500' 
                : 'text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-500'
              }
            `}
            title={isRunning ? 'Pause timer (Space)' : 'Start timer (Space)'}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </button>
          
          {isActiveForTask && (
            <button
              onClick={handleStop}
              className="p-1 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
              title="Stop timer"
              aria-label="Stop timer"
            >
              <Square className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-gray-900">Timer</span>
        </div>
        
        {isActiveForTask && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isRunning 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {isRunning ? 'Running' : 'Paused'}
          </div>
        )}
      </div>

      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold text-gray-900 mb-1">
          {formatDuration(displayTime, 'clock', true)}
        </div>
        <div className="text-sm text-gray-500">
          {displayTime > 0 ? formatDuration(displayTime, 'long', false) : 'Ready to start'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePlayPause}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isRunning
              ? 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500'
              : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            }
          `}
          title={`${isRunning ? 'Pause' : 'Start'} timer (Space)`}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start
            </>
          )}
        </button>

        {isActiveForTask && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            title="Stop timer"
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      {isActiveForTask && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">
            Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600">Space</kbd> to {isRunning ? 'pause' : 'start'}
          </span>
        </div>
      )}
    </div>
  );
}

interface TimerBadgeProps {
  taskId: string;
  className?: string;
}

export function TimerBadge({ taskId, className = '' }: TimerBadgeProps) {
  const { isRunning, elapsed, isActiveForTask } = useTimer(taskId);

  if (!isActiveForTask && elapsed === 0) {
    return null;
  }

  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
      ${isRunning 
        ? 'bg-green-100 text-green-800 animate-pulse' 
        : 'bg-gray-100 text-gray-600'
      }
      ${className}
    `}>
      <Clock className="h-3 w-3" />
      <span className="font-mono">
        {formatDuration(elapsed, 'clock', false)}
      </span>
      {isRunning && <div className="w-1 h-1 bg-green-600 rounded-full animate-ping" />}
    </div>
  );
}

interface QuickTimerProps {
  taskId: string;
  taskTitle: string;
  onStarted?: () => void;
  onStopped?: () => void;
}

export function QuickTimer({ taskId, taskTitle, onStarted, onStopped }: QuickTimerProps) {
  const { isRunning, elapsed, isActiveForTask, start, stop } = useTimer(taskId);

  const handleToggle = () => {
    if (isActiveForTask && isRunning) {
      stop();
      onStopped?.();
    } else {
      start();
      onStarted?.();
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 truncate">{taskTitle}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-600 font-mono">
            {formatDuration(elapsed, 'clock', false)}
          </span>
          {isActiveForTask && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isRunning ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {isRunning ? 'Active' : 'Paused'}
            </span>
          )}
        </div>
      </div>
      
      <button
        onClick={handleToggle}
        className={`
          p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
          ${(isActiveForTask && isRunning)
            ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
            : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
          }
        `}
        title={isActiveForTask && isRunning ? 'Stop timer' : 'Start timer'}
      >
        {(isActiveForTask && isRunning) ? (
          <Square className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}