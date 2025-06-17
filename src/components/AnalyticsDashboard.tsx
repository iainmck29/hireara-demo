'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Analytics, 
  TeamMetrics, 
  Recommendation, 
  ProductivityInsight, 
  TrendData,
  AnalyticsFilters 
} from '@/types';
import { getSmartInsights, calculateTaskTrends, calculateTeamMetrics } from '@/lib/analytics';
import { getAnalytics, getTasks, getUsers } from '@/lib/data';
import TaskTrendsChart from './charts/TaskTrendsChart';
import TeamPerformanceChart from './charts/TeamPerformanceChart';
import TeamMetricsCard from './TeamMetricsCard';
import RecommendationsPanel from './RecommendationsPanel';
import ExportControls from './ExportControls';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  BarChart3,
  FileText,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface AnalyticsDashboardProps {
  className?: string;
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'team' | 'recommendations' | 'export'>('overview');

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, smartInsights, trendData, tasks, users] = await Promise.all([
        getAnalytics(),
        getSmartInsights(),
        calculateTaskTrends(),
        getTasks(),
        getUsers(),
      ]);
      
      const teamMetricsData = calculateTeamMetrics(tasks, users);
      
      setAnalytics(analyticsData);
      setTeamMetrics(teamMetricsData);
      setRecommendations(smartInsights.recommendations);
      setInsights(smartInsights.insights);
      setTrends(trendData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const exportData = useMemo(() => {
    if (!analytics) return null;
    
    return {
      analytics,
      teamMetrics,
      recommendations,
      insights,
      trends,
    };
  }, [analytics, teamMetrics, recommendations, insights, trends]);

  const overviewStats = useMemo(() => {
    if (!analytics || !insights) return [];
    
    const completionRate = (analytics.overview.completedTasks / analytics.overview.totalTasks) * 100;
    const productivityTrend = insights.find(i => i.metric === 'Team Productivity Score');
    
    return [
      {
        title: 'Total Tasks',
        value: analytics.overview.totalTasks,
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        change: null,
      },
      {
        title: 'Completion Rate',
        value: `${Math.round(completionRate)}%`,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        change: insights.find(i => i.metric === 'Task Completion Rate')?.change || 0,
      },
      {
        title: 'Team Productivity',
        value: `${productivityTrend?.value || 0} pts`,
        icon: TrendingUp,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        change: productivityTrend?.change || 0,
      },
      {
        title: 'Overdue Tasks',
        value: analytics.overview.overdueTasks,
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        change: insights.find(i => i.metric === 'Overdue Tasks')?.change || 0,
      },
    ];
  }, [analytics, insights]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'team' as const, label: 'Team Performance', icon: Users },
    { id: 'recommendations' as const, label: 'AI Insights', icon: AlertTriangle },
    { id: 'export' as const, label: 'Export', icon: FileText },
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-8 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Analytics</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!analytics || !exportData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
        <div className="text-center text-gray-600">No analytics data available.</div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with tabs and refresh */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={loadAnalyticsData}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          {stat.change !== null && (
                            <div className={`flex items-center mt-2 text-sm ${
                              stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {stat.change > 0 ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                              ) : stat.change < 0 ? (
                                <TrendingDown className="w-4 h-4 mr-1" />
                              ) : null}
                              <span>{Math.abs(stat.change)} {stat.change !== 0 ? 'vs last period' : 'no change'}</span>
                            </div>
                          )}
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Key Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                  <div className="space-y-4">
                    {insights.slice(0, 3).map((insight, index) => {
                      const trendIcon = insight.trend === 'up' ? TrendingUp : insight.trend === 'down' ? TrendingDown : Clock;
                      const TrendIcon = trendIcon;
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <p className="font-medium text-gray-900">{insight.metric}</p>
                            <p className="text-sm text-gray-600">{insight.period} {insight.comparison}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">{insight.value}</span>
                            <TrendIcon className={`w-4 h-4 ${
                              insight.trend === 'up' ? 'text-green-500' : 
                              insight.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <TeamMetricsCard teamMetrics={teamMetrics.slice(0, 3)} showDetails={false} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <TaskTrendsChart trends={trends} height={500} />
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <TeamPerformanceChart teamMetrics={teamMetrics} height={400} />
              <TeamMetricsCard teamMetrics={teamMetrics} />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPanel 
              recommendations={recommendations} 
              onDismiss={(id) => {
                setRecommendations(prev => prev.filter(rec => rec.id !== id));
              }}
            />
          )}

          {activeTab === 'export' && (
            <ExportControls data={exportData} />
          )}
        </div>
      </div>
    </div>
  );
}