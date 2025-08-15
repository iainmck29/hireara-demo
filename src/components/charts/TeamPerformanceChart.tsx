'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TeamMetrics } from '@/types';
import { generateTeamPerformanceChart } from '@/lib/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TeamPerformanceChartProps {
  teamMetrics: TeamMetrics[];
  height?: number;
  showComparison?: boolean;
}

type MetricType = 'tasks' | 'productivity' | 'completion';

export default function TeamPerformanceChart({ 
  teamMetrics, 
  height = 400, 
  showComparison = true 
}: TeamPerformanceChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('tasks');
  const [sortBy, setSortBy] = useState<'name' | 'productivity' | 'completion'>('name');

  const sortedMetrics = useMemo(() => {
    const sorted = [...teamMetrics];
    
    switch (sortBy) {
      case 'productivity':
        return sorted.sort((a, b) => b.productivityScore - a.productivityScore);
      case 'completion':
        return sorted.sort((a, b) => b.completionRate - a.completionRate);
      default:
        return sorted.sort((a, b) => a.userName.localeCompare(b.userName));
    }
  }, [teamMetrics, sortBy]);

  const chartData = useMemo(() => {
    const labels = sortedMetrics.map(member => member.userName);
    
    if (selectedMetric === 'tasks') {
      return {
        labels,
        datasets: [
          {
            label: 'Completed Tasks',
            data: sortedMetrics.map(member => member.tasksCompleted),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
          {
            label: 'In Progress',
            data: sortedMetrics.map(member => member.tasksInProgress),
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 1,
          },
        ]
      };
    } else if (selectedMetric === 'productivity') {
      return {
        labels,
        datasets: [
          {
            label: 'Productivity Score',
            data: sortedMetrics.map(member => member.productivityScore),
            backgroundColor: sortedMetrics.map(member => {
              if (member.productivityScore >= 80) return 'rgba(34, 197, 94, 0.8)';
              if (member.productivityScore >= 60) return 'rgba(245, 158, 11, 0.8)';
              return 'rgba(239, 68, 68, 0.8)';
            }),
            borderColor: sortedMetrics.map(member => {
              if (member.productivityScore >= 80) return 'rgb(34, 197, 94)';
              if (member.productivityScore >= 60) return 'rgb(245, 158, 11)';
              return 'rgb(239, 68, 68)';
            }),
            borderWidth: 1,
          },
        ]
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: 'Completion Rate (%)',
            data: sortedMetrics.map(member => member.completionRate),
            backgroundColor: sortedMetrics.map(member => {
              if (member.completionRate >= 70) return 'rgba(34, 197, 94, 0.8)';
              if (member.completionRate >= 40) return 'rgba(245, 158, 11, 0.8)';
              return 'rgba(239, 68, 68, 0.8)';
            }),
            borderColor: sortedMetrics.map(member => {
              if (member.completionRate >= 70) return 'rgb(34, 197, 94)';
              if (member.completionRate >= 40) return 'rgb(245, 158, 11)';
              return 'rgb(239, 68, 68)';
            }),
            borderWidth: 1,
          },
        ]
      };
    }
  }, [sortedMetrics, selectedMetric]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Team Performance Metrics',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            const memberIndex = context[0].dataIndex;
            const member = sortedMetrics[memberIndex];
            return `${member.userName} (${member.department})`;
          },
          label: (context: any) => {
            const memberIndex = context.dataIndex;
            const member = sortedMetrics[memberIndex];
            const value = context.parsed.y;
            const label = context.dataset.label;
            
            if (selectedMetric === 'productivity') {
              return [
                `${label}: ${value}`,
                `Avg. Completion Time: ${member.averageCompletionTime} days`,
                `Completion Rate: ${member.completionRate}%`,
              ];
            } else if (selectedMetric === 'completion') {
              return [
                `${label}: ${value}%`,
                `Completed: ${member.tasksCompleted} tasks`,
                `In Progress: ${member.tasksInProgress} tasks`,
              ];
            } else {
              return `${label}: ${value}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Team Members',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: selectedMetric === 'tasks' ? 'Number of Tasks' : 
                selectedMetric === 'productivity' ? 'Productivity Score' : 'Completion Rate (%)',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
          ...(selectedMetric === 'productivity' || selectedMetric === 'completion' 
            ? { max: 100 } 
            : {}),
        },
      },
    },
  };

  const metricOptions = [
    { value: 'tasks' as MetricType, label: 'Task Counts' },
    { value: 'productivity' as MetricType, label: 'Productivity Score' },
    { value: 'completion' as MetricType, label: 'Completion Rate' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'productivity', label: 'Productivity Score' },
    { value: 'completion', label: 'Completion Rate' },
  ];

  const getPerformanceInsight = () => {
    const avgProductivity = teamMetrics.reduce((sum, member) => sum + member.productivityScore, 0) / teamMetrics.length;
    const topPerformer = teamMetrics.reduce((top, member) => 
      member.productivityScore > top.productivityScore ? member : top
    );
    const needsAttention = teamMetrics.filter(member => member.productivityScore < 60);

    return {
      avgProductivity: Math.round(avgProductivity),
      topPerformer,
      needsAttention: needsAttention.length,
    };
  };

  const insight = getPerformanceInsight();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metricOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showComparison && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Performance Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Team Average:</span>
                <span className="ml-2 font-medium text-gray-900">{insight.avgProductivity} pts</span>
              </div>
              <div>
                <span className="text-gray-600">Top Performer:</span>
                <span className="ml-2 font-medium text-green-600">{insight.topPerformer.userName}</span>
              </div>
              <div>
                <span className="text-gray-600">Needs Attention:</span>
                <span className="ml-2 font-medium text-red-600">{insight.needsAttention} member{insight.needsAttention !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}