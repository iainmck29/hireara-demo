'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { formatDuration, generateTimeReport } from '@/lib/timeTracking';

type DateRange = 'today' | 'week' | 'month' | 'all';

export function TimeTrackingAnalytics() {
  const { state } = useTimeTracking();
  const [dateRange, setDateRange] = useState<DateRange>('week');

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'all':
      default:
        startDate = new Date(0);
        break;
    }
    
    const filteredEntries = state.timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      return entryDate >= startDate && entryDate <= endDate;
    });
    
    const report = generateTimeReport(
      filteredEntries,
      state.currentUserId,
      startDate,
      endDate,
      dateRange === 'today' ? 'day' : dateRange === 'week' ? 'week' : 'month'
    );
    
    return { entries: filteredEntries, report };
  }, [state.timeEntries, state.currentUserId, dateRange]);

  const { entries, report } = filteredData;

  // Calculate additional metrics
  const metrics = useMemo(() => {
    const totalSessions = entries.length;
    const averageSessionTime = totalSessions > 0 ? report.totalTime / totalSessions : 0;
    const longestSession = entries.length > 0 ? Math.max(...entries.map(e => e.duration)) : 0;
    const shortestSession = entries.length > 0 ? Math.min(...entries.map(e => e.duration)) : 0;
    
    // Productivity score calculation
    const consistencyBonus = Math.min(report.dailyBreakdown.length * 10, 40);
    const sessionQualityBonus = averageSessionTime > 30 * 60 * 1000 ? 30 : Math.floor(averageSessionTime / (30 * 60 * 1000) * 30);
    const volumeBonus = Math.min(totalSessions * 2, 30);
    const productivityScore = Math.min(consistencyBonus + sessionQualityBonus + volumeBonus, 100);
    
    return {
      totalSessions,
      averageSessionTime,
      longestSession,
      shortestSession,
      productivityScore
    };
  }, [entries, report]);

  const dateRangeOptions = [
    { value: 'today' as const, label: 'Today' },
    { value: 'week' as const, label: 'Last 7 days' },
    { value: 'month' as const, label: 'Last 30 days' },
    { value: 'all' as const, label: 'All time' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Time Tracking Analytics</h2>
              <p className="text-sm text-gray-600">Productivity insights and time allocation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatDuration(report.totalTime, 'short')}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatDuration(report.totalTime, 'long')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-green-600">{metrics.totalSessions}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Avg: {formatDuration(metrics.averageSessionTime, 'short')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity Score</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.productivityScore}%</p>
            </div>
            <Award className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Based on consistency & quality
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Productive</p>
              <p className="text-2xl font-bold text-orange-600">
                {report.mostProductiveHour}:00
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Peak performance hour
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Daily Breakdown</h3>
          </div>
          
          {report.dailyBreakdown.length > 0 ? (
            <div className="space-y-3">
              {report.dailyBreakdown.slice(-7).map((day, index) => {
                const maxTime = Math.max(...report.dailyBreakdown.map(d => d.totalTime));
                const percentage = maxTime > 0 ? (day.totalTime / maxTime) * 100 : 0;
                
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString([], { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm font-medium text-gray-900 text-right">
                      {formatDuration(day.totalTime, 'short')}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No data for selected period</p>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Time by Category</h3>
          </div>
          
          {report.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {report.categoryBreakdown.slice(0, 5).map((category, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                const color = colors[index % colors.length];
                
                return (
                  <div key={category.category} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {category.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${color}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600 text-right">
                      {formatDuration(category.totalTime, 'short')}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No categorized time entries</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Breakdown */}
      {report.taskBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Top Tasks by Time</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Session
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.taskBreakdown.slice(0, 10).map((task) => (
                  <tr key={task.taskId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {task.taskTitle}
                      </div>
                      <div className="text-sm text-gray-500">{task.taskId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(task.totalTime, 'short')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.entryCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(task.totalTime / task.entryCount, 'short')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Longest Session</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDuration(metrics.longestSession, 'short')}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Shortest Session</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDuration(metrics.shortestSession, 'short')}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Active Days</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.dailyBreakdown.length}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Average Daily Time</p>
            <p className="text-lg font-semibold text-gray-900">
              {report.dailyBreakdown.length > 0 
                ? formatDuration(report.totalTime / report.dailyBreakdown.length, 'short')
                : '0m'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}