'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Save, X, AlertCircle, Plus } from 'lucide-react';
import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { validateTimeEntry, formatDuration, getTimeCategories, roundToNearestMinute } from '@/lib/timeTracking';
import { TimeEntry as TimeEntryType } from '@/types';

interface TimeEntryFormProps {
  taskId: string;
  initialEntry?: TimeEntryType | null;
  onSuccess?: (entry: TimeEntryType) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function TimeEntryForm({ 
  taskId, 
  initialEntry, 
  onSuccess, 
  onCancel, 
  isEditing = false 
}: TimeEntryFormProps) {
  const { addManualEntry, updateEntry, state } = useTimeTracking();
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    description: '',
    category: 'Development'
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duration, setDuration] = useState(0);

  // Initialize form data
  useEffect(() => {
    if (initialEntry) {
      setFormData({
        startTime: formatDateTimeLocal(new Date(initialEntry.startTime)),
        endTime: formatDateTimeLocal(new Date(initialEntry.endTime)),
        description: initialEntry.description || '',
        category: initialEntry.category || 'Development'
      });
    } else {
      // Set default start time to current time rounded to nearest minute
      const now = roundToNearestMinute(new Date());
      const endTime = new Date(now.getTime() + 30 * 60 * 1000); // Default 30 minutes
      
      setFormData({
        startTime: formatDateTimeLocal(now),
        endTime: formatDateTimeLocal(endTime),
        description: '',
        category: 'Development'
      });
    }
  }, [initialEntry]);

  // Calculate duration when times change
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime).getTime();
      const end = new Date(formData.endTime).getTime();
      const calculatedDuration = Math.max(0, end - start);
      setDuration(calculatedDuration);
    } else {
      setDuration(0);
    }
  }, [formData.startTime, formData.endTime]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Clear errors when user makes changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const entryData = {
        taskId,
        userId: state.currentUserId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        duration,
        description: formData.description.trim() || undefined,
        category: formData.category,
        isManual: true
      };

      const validation = validateTimeEntry(entryData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      if (isEditing && initialEntry) {
        updateEntry(initialEntry.id, {
          ...entryData,
          updatedAt: new Date().toISOString()
        });
      } else {
        addManualEntry(entryData);
      }

      onSuccess?.(entryData as TimeEntryType);
      
      // Reset form if not editing
      if (!isEditing) {
        const now = roundToNearestMinute(new Date());
        const endTime = new Date(now.getTime() + 30 * 60 * 1000);
        
        setFormData({
          startTime: formatDateTimeLocal(now),
          endTime: formatDateTimeLocal(endTime),
          description: '',
          category: formData.category // Keep the same category
        });
      }
    } catch (error) {
      setErrors(['Failed to save time entry. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDuration = (minutes: number) => {
    if (formData.startTime) {
      const start = new Date(formData.startTime);
      const end = new Date(start.getTime() + minutes * 60 * 1000);
      setFormData(prev => ({
        ...prev,
        endTime: formatDateTimeLocal(end)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Time Entry' : 'Add Time Entry'}
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Time Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Duration Display and Quick Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Duration
          </label>
          {duration > 0 && (
            <span className="text-sm text-gray-600">
              {formatDuration(duration, 'long')}
            </span>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-2xl font-mono font-bold text-center text-gray-900 mb-3">
            {formatDuration(duration, 'clock', true)}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {[15, 30, 60, 120, 240].map(minutes => (
              <button
                key={minutes}
                type="button"
                onClick={() => handleQuickDuration(minutes)}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {getTimeCategories().map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="What did you work on?"
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <div className="mt-1 text-sm text-gray-500 text-right">
          {formData.description.length}/500
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || duration === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Entry' : 'Add Entry'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

interface TimeEntryListProps {
  taskId?: string;
  entries?: TimeEntryType[];
  onEdit?: (entry: TimeEntryType) => void;
  onDelete?: (entryId: string) => void;
  showTaskInfo?: boolean;
  limit?: number;
}

export function TimeEntryList({ 
  taskId, 
  entries: propEntries, 
  onEdit, 
  onDelete,
  showTaskInfo = false,
  limit 
}: TimeEntryListProps) {
  const { state, removeEntry } = useTimeTracking();
  
  const entries = propEntries || (taskId ? state.timeEntries.filter(e => e.taskId === taskId) : state.timeEntries);
  const displayEntries = limit ? entries.slice(0, limit) : entries;
  
  const handleDelete = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      if (onDelete) {
        onDelete(entryId);
      } else {
        removeEntry(entryId);
      }
    }
  };

  if (displayEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No time entries yet</p>
        <p className="text-sm">Start a timer or add a manual entry to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayEntries.map((entry) => (
        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="font-mono font-medium">
                  {formatDuration(entry.duration, 'clock', false)}
                </span>
                <span className="text-sm text-gray-500">
                  ({formatDuration(entry.duration, 'long', false)})
                </span>
                {entry.isManual && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    Manual
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <Calendar className="inline h-3 w-3 mr-1" />
                {formatDateRange(entry.startTime, entry.endTime)}
              </div>
              
              {entry.description && (
                <p className="text-sm text-gray-700 mb-2">{entry.description}</p>
              )}
              
              {entry.category && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {entry.category}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                  title="Edit entry"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={() => handleDelete(entry.id)}
                className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                title="Delete entry"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {limit && entries.length > limit && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">
            Showing {limit} of {entries.length} entries
          </span>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateRange(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const startDate = start.toLocaleDateString();
  const startTimeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // If same day, show date once
  if (start.toDateString() === end.toDateString()) {
    return `${startDate} ${startTimeStr} - ${endTimeStr}`;
  } else {
    return `${startDate} ${startTimeStr} - ${end.toLocaleDateString()} ${endTimeStr}`;
  }
}