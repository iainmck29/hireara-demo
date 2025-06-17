'use client';

import { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendData, ChartData } from '@/types';
import { processTaskTrendsForChart } from '@/lib/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TaskTrendsChartProps {
  trends: TrendData[];
  height?: number;
  showFilters?: boolean;
}

type TimeFilter = '7d' | '14d' | '30d' | 'all';

export default function TaskTrendsChart({ 
  trends, 
  height = 400, 
  showFilters = true 
}: TaskTrendsChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('14d');
  const [selectedMetrics, setSelectedMetrics] = useState({
    completed: true,
    created: true,
    inProgress: false,
  });

  const filteredTrends = useMemo(() => {
    if (timeFilter === 'all') return trends;
    
    const days = timeFilter === '7d' ? 7 : timeFilter === '14d' ? 14 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return trends.filter(trend => new Date(trend.date) >= cutoffDate);
  }, [trends, timeFilter]);

  const chartData = useMemo(() => {
    const baseData = processTaskTrendsForChart(filteredTrends);
    
    // Filter datasets based on selected metrics
    const filteredDatasets = baseData.datasets.filter(dataset => {
      if (dataset.label === 'Completed') return selectedMetrics.completed;
      if (dataset.label === 'Created') return selectedMetrics.created;
      if (dataset.label === 'In Progress') return selectedMetrics.inProgress;
      return false;
    });

    return {
      ...baseData,
      datasets: filteredDatasets,
    };
  }, [filteredTrends, selectedMetrics]);

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
        text: 'Task Completion Trends',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            const date = new Date(filteredTrends[context[0].dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric' 
            });
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const label = context.dataset.label;
            return `${label}: ${value} task${value !== 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 7,
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Tasks',
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
          stepSize: 1,
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        hitRadius: 6,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
  };

  const timeFilterOptions = [
    { value: '7d' as TimeFilter, label: 'Last 7 days' },
    { value: '14d' as TimeFilter, label: 'Last 14 days' },
    { value: '30d' as TimeFilter, label: 'Last 30 days' },
    { value: 'all' as TimeFilter, label: 'All time' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedMetrics.completed}
                onChange={(e) => setSelectedMetrics(prev => ({ ...prev, completed: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-green-600 font-medium">Completed</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedMetrics.created}
                onChange={(e) => setSelectedMetrics(prev => ({ ...prev, created: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-600 font-medium">Created</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedMetrics.inProgress}
                onChange={(e) => setSelectedMetrics(prev => ({ ...prev, inProgress: e.target.checked }))}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-amber-600 font-medium">In Progress</span>
            </label>
          </div>
        </div>
      )}
      
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Showing {filteredTrends.length} data points
          {timeFilter !== 'all' && ` over the ${timeFilterOptions.find(opt => opt.value === timeFilter)?.label.toLowerCase()}`}
        </p>
      </div>
    </div>
  );
}