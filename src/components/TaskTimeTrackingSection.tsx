'use client';

import React, { useState } from 'react';
import { Clock, Plus, BarChart3, Download } from 'lucide-react';
import { TimeTracker } from './TimeTracker';
import { TimeEntryForm, TimeEntryList } from './TimeEntry';
import { TimeTrackingSummary } from './TimeTrackingPanel';
import { useTaskTimeEntries } from '@/contexts/TimeTrackingContext';
import { formatDuration } from '@/lib/timeTracking';
import { TimeEntry } from '@/types';

interface TaskTimeTrackingSectionProps {
  taskId: string;
  taskTitle: string;
}

export function TaskTimeTrackingSection({ taskId, taskTitle }: TaskTimeTrackingSectionProps) {
  const { entries, totalTime, entryCount } = useTaskTimeEntries(taskId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'timer' | 'entries' | 'summary'>('timer');

  const handleAddEntrySuccess = () => {
    setShowAddForm(false);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const handleEditSuccess = () => {
    setEditingEntry(null);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setShowAddForm(false);
  };

  const exportTimeEntries = () => {
    const data = {
      taskId,
      taskTitle,
      entries,
      totalTime,
      entryCount,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-entries-${taskTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: Clock },
    { id: 'entries' as const, label: `Entries (${entryCount})`, icon: Plus },
    { id: 'summary' as const, label: 'Summary', icon: BarChart3 }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Time Tracking</h2>
            {totalTime > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {formatDuration(totalTime, 'short')} total
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={exportTimeEntries}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Export time entries"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-3 w-3" />
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <TimeEntryForm
            taskId={taskId}
            initialEntry={editingEntry}
            isEditing={!!editingEntry}
            onSuccess={editingEntry ? handleEditSuccess : handleAddEntrySuccess}
            onCancel={editingEntry ? handleCancelEdit : () => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="px-6 flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors
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
      <div className="p-6">
        {activeTab === 'timer' && (
          <div className="space-y-6">
            <div className="max-w-md mx-auto">
              <TimeTracker taskId={taskId} variant="full" />
            </div>
            
            {entries.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Entries</h3>
                <TimeEntryList 
                  entries={entries.slice(0, 3)} 
                  onEdit={handleEditEntry}
                  limit={3}
                />
                {entries.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setActiveTab('entries')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View all {entries.length} entries →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'entries' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">All Time Entries</h3>
              {entries.length > 0 && (
                <span className="text-sm text-gray-500">
                  {entries.length} entries • {formatDuration(totalTime, 'long')} total
                </span>
              )}
            </div>
            
            <TimeEntryList 
              entries={entries} 
              onEdit={handleEditEntry}
            />
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Time Summary</h3>
            
            {entries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TimeTrackingSummary entries={entries} />
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Total Time:</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDuration(totalTime, 'long')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Sessions:</dt>
                        <dd className="text-sm font-medium text-gray-900">{entryCount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Average Session:</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {entryCount > 0 ? formatDuration(totalTime / entryCount, 'short') : '0m'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Longest Session:</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {entries.length > 0 
                            ? formatDuration(Math.max(...entries.map(e => e.duration)), 'short')
                            : '0m'
                          }
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Recent Activity */}
                  {entries.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                        {entries.slice(0, 5).map((entry, index) => (
                          <div key={entry.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {new Date(entry.startTime).toLocaleDateString()}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatDuration(entry.duration, 'short')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No time entries yet</p>
                <p className="text-sm">Start the timer or add a manual entry to begin tracking time on this task</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}