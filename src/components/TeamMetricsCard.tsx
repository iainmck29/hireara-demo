'use client';

import { TeamMetrics } from '@/types';
import { TrendingUp, TrendingDown, Minus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamMetricsCardProps {
  teamMetrics: TeamMetrics[];
  showDetails?: boolean;
}

export default function TeamMetricsCard({ teamMetrics, showDetails = true }: TeamMetricsCardProps) {
  const getProductivityTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' };
    if (score >= 60) return { icon: Minus, color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' };
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-green-700', bg: 'bg-green-100' };
    if (score >= 70) return { label: 'Good', color: 'text-blue-700', bg: 'bg-blue-100' };
    if (score >= 55) return { label: 'Average', color: 'text-yellow-700', bg: 'bg-yellow-100' };
    return { label: 'Needs Improvement', color: 'text-red-700', bg: 'bg-red-100' };
  };

  const sortedByPerformance = [...teamMetrics].sort((a, b) => b.productivityScore - a.productivityScore);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Team Performance Overview</h3>
        <div className="text-sm text-gray-500">
          {teamMetrics.length} team member{teamMetrics.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {sortedByPerformance.map((member, index) => {
          const trend = getProductivityTrend(member.productivityScore);
          const level = getPerformanceLevel(member.productivityScore);
          const TrendIcon = trend.icon;

          return (
            <div key={member.userId} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{member.userName}</h4>
                      <p className="text-sm text-gray-500">{member.department}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${level.color} ${level.bg}`}>
                    {level.label}
                  </div>
                  <div className={`p-1 rounded-full ${trend.bg}`}>
                    <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">Completed</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{member.tasksCompleted}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">In Progress</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{member.tasksInProgress}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Avg. Time</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {member.averageCompletionTime}
                    <span className="text-xs text-gray-500 ml-1">days</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-gray-500">Score</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {member.productivityScore}
                    <span className="text-xs text-gray-500 ml-1">pts</span>
                  </div>
                </div>
              </div>

              {showDetails && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            member.completionRate >= 70 
                              ? 'bg-green-500' 
                              : member.completionRate >= 40 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, member.completionRate)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {member.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500 mb-1">Team Average</div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(teamMetrics.reduce((sum, m) => sum + m.productivityScore, 0) / teamMetrics.length)} pts
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Completed</div>
            <div className="text-lg font-semibold text-green-600">
              {teamMetrics.reduce((sum, m) => sum + m.tasksCompleted, 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">In Progress</div>
            <div className="text-lg font-semibold text-yellow-600">
              {teamMetrics.reduce((sum, m) => sum + m.tasksInProgress, 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Avg. Completion</div>
            <div className="text-lg font-semibold text-blue-600">
              {Math.round(teamMetrics.reduce((sum, m) => sum + m.completionRate, 0) / teamMetrics.length)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}