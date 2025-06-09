'use client';

import { BarChart3, TrendingUp, Users, AlertTriangle, Brain, Sparkles } from 'lucide-react';

export function AnalyticsPlaceholder() {
  return (
    <div className="space-y-8">
      {/* Smart Task Insights Placeholder */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Smart Task Insights
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            AI-powered analytics and recommendations will appear here. This advanced feature 
            uses machine learning to analyze task patterns, predict bottlenecks, and provide 
            intelligent insights to optimize your team's productivity.
          </p>
          
          <div className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50">
            <Sparkles className="mr-2 h-4 w-4" />
            Feature Coming Soon - To be built with Claude Code
          </div>
        </div>
        
        {/* Preview of what will be included */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Productivity Trends</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI analysis of team velocity and task completion patterns
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Risk Detection</h3>
            </div>
            <p className="text-sm text-gray-600">
              Predictive alerts for potential delays and bottlenecks
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Team Optimization</h3>
            </div>
            <p className="text-sm text-gray-600">
              Recommendations for workload balancing and skill matching
            </p>
          </div>
        </div>
      </div>

      {/* Basic Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Task Status Distribution</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Chart visualization will be added here</p>
              <p className="text-sm text-gray-400 mt-1">Using Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        {/* Priority Distribution Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Priority Distribution</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Priority breakdown chart will be here</p>
              <p className="text-sm text-gray-400 mt-1">Pie or doughnut chart format</p>
            </div>
          </div>
        </div>

        {/* Team Performance Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Team metrics and performance data</p>
              <p className="text-sm text-gray-400 mt-1">Individual and team comparisons</p>
            </div>
          </div>
        </div>

        {/* Trends Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Productivity Trends</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Time-series trend analysis</p>
              <p className="text-sm text-gray-400 mt-1">Line charts showing progress over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">73%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8.5</div>
            <div className="text-sm text-gray-600">Avg Days to Complete</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Overdue Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
}