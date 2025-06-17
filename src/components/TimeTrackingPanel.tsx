'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  BarChart3, 
  Plus,
  Timer,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { TimeEntryForm, TimeEntryList } from './TimeEntry';
import { formatDuration, generateTimeReport } from '@/lib/timeTracking';
import { TimeEntry } from '@/types';

interface TimeTrackingPanelProps {
  className?: string;
  defaultExpanded?: boolean;
  showActiveTimer?: boolean;
  showRecentEntries?: boolean;
  showQuickStats?: boolean;
  showAddEntry?: boolean;
}

export function TimeTrackingPanel({ 
  className = '',
  defaultExpanded = false,
  showActiveTimer = true,
  showRecentEntries = true,
  showQuickStats = true,
  showAddEntry = true
}: TimeTrackingPanelProps) {
  const { state } = useTimeTracking();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'today' | 'stats'>('recent');

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntries = state.timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      return entryDate >= today && entryDate < tomorrow;
    });

    const totalTime = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const entryCount = todayEntries.length;
    const averageSession = entryCount > 0 ? totalTime / entryCount : 0;

    return { totalTime, entryCount, averageSession, entries: todayEntries };
  }, [state.timeEntries]);

  // Calculate recent entries (last 5)
  const recentEntries = useMemo(() => {
    return state.timeEntries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [state.timeEntries]);

  const handleAddEntrySuccess = () => {
    setShowAddForm(false);
  };

  const ActiveTimerSection = () => {
    if (!showActiveTimer || !state.timerState.isRunning) return null;

    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Timer className="h-5 w-5 text-green-600" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Timer Running</h3>
              <p className="text-sm text-gray-600">
                Task: {state.timerState.taskId || 'Unknown Task'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-green-700">
              {formatDuration(state.timerState.totalElapsed, 'clock', true)}
            </div>
            <div className="text-xs text-gray-500">
              Started {new Date(state.timerState.startTime || '').toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickStatsSection = () => {
    if (!showQuickStats) return null;

    return (
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {formatDuration(todayStats.totalTime, 'short')}
          </div>
          <div className="text-xs text-gray-500">Today</div>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-600">
            {todayStats.entryCount}
          </div>
          <div className="text-xs text-gray-500">Entries</div>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-600">
            {formatDuration(todayStats.averageSession, 'short')}
          </div>
          <div className="text-xs text-gray-500">Avg Session</div>
        </div>
      </div>
    );
  };

  const TabSection = () => {
    const tabs = [
      { id: 'recent' as const, label: 'Recent', icon: Clock },
      { id: 'today' as const, label: 'Today', icon: Calendar },
      { id: 'stats' as const, label: 'Stats', icon: BarChart3 }
    ];

    return (
      <div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'recent' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Entries</h4>
              <TimeEntryList entries={recentEntries} limit={5} />
            </div>
          )}

          {activeTab === 'today' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Today's Activity</h4>
              <TimeEntryList entries={todayStats.entries} />
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Time Today</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDuration(todayStats.totalTime, 'long')}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Sessions Today</span>
                    <PieChart className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayStats.entryCount}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Session</span>
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDuration(todayStats.averageSession, 'short')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Panel Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Time Tracking</h2>
          {state.timerState.isRunning && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showAddEntry && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddForm(!showAddForm);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              title="Add time entry"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Panel Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="mt-4">
            <ActiveTimerSection />
            
            {showAddForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <TimeEntryForm
                  taskId="" // Will need to be selected in the form
                  onSuccess={handleAddEntrySuccess}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}
            
            <QuickStatsSection />
            
            {(showRecentEntries || showQuickStats) && <TabSection />}
          </div>
        </div>
      )}
    </div>
  );
}

interface CompactTimeTrackingPanelProps {
  className?: string;
}

export function CompactTimeTrackingPanel({ className = '' }: CompactTimeTrackingPanelProps) {
  const { state } = useTimeTracking();

  // Calculate today's total time
  const todayTotal = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return state.timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= today && entryDate < tomorrow;
      })
      .reduce((sum, entry) => sum + entry.duration, 0);
  }, [state.timeEntries]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Timer className="h-5 w-5 text-blue-600" />
            {state.timerState.isRunning && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Time Tracking</h3>
            <p className="text-sm text-gray-600">
              Today: {formatDuration(todayTotal, 'short')}
            </p>
          </div>
        </div>
        
        {state.timerState.isRunning && (
          <div className="text-right">
            <div className="font-mono font-bold text-green-600">
              {formatDuration(state.timerState.totalElapsed, 'clock', false)}
            </div>
            <div className="text-xs text-gray-500">Running</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TimeTrackingSummaryProps {
  entries: TimeEntry[];
  className?: string;
}

export function TimeTrackingSummary({ entries, className = '' }: TimeTrackingSummaryProps) {
  const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const entryCount = entries.length;
  const averageSession = entryCount > 0 ? totalTime / entryCount : 0;

  // Group by category
  const categoryTotals = entries.reduce((acc, entry) => {
    const category = entry.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + entry.duration;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="font-medium text-gray-900 mb-3">Time Summary</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {formatDuration(totalTime, 'short')}
          </div>
          <div className="text-sm text-gray-500">Total Time</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {entryCount}
          </div>
          <div className="text-sm text-gray-500">Sessions</div>
        </div>
      </div>

      {averageSession > 0 && (
        <div className="mb-4">
          <div className="text-lg font-semibold text-orange-600">
            {formatDuration(averageSession, 'short')}
          </div>
          <div className="text-sm text-gray-500">Average Session</div>
        </div>
      )}

      {topCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Categories</h4>
          <div className="space-y-2">
            {topCategories.map(([category, time]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDuration(time, 'short')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}