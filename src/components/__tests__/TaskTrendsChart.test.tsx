import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskTrendsChart from '../charts/TaskTrendsChart';
import { TrendData } from '@/types';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)}>
      Mock Line Chart
    </div>
  ),
}));

describe('TaskTrendsChart', () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  const mockTrends: TrendData[] = [
    {
      date: twoDaysAgo.toISOString().split('T')[0],
      completed: 2,
      created: 1,
      inProgress: 3,
      overdue: 0,
    },
    {
      date: yesterday.toISOString().split('T')[0],
      completed: 1,
      created: 2,
      inProgress: 2,
      overdue: 1,
    },
    {
      date: today.toISOString().split('T')[0],
      completed: 3,
      created: 1,
      inProgress: 1,
      overdue: 0,
    },
  ];

  it('renders correctly with trend data', () => {
    render(<TaskTrendsChart trends={mockTrends} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Mock Line Chart')).toBeInTheDocument();
  });

  it('shows filter controls when showFilters is true', () => {
    render(<TaskTrendsChart trends={mockTrends} showFilters={true} />);
    
    expect(screen.getByText('Time Range:')).toBeInTheDocument();
    expect(screen.getByText('Show:')).toBeInTheDocument();
    expect(screen.getByLabelText(/completed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/created/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/in progress/i)).toBeInTheDocument();
  });

  it('hides filter controls when showFilters is false', () => {
    render(<TaskTrendsChart trends={mockTrends} showFilters={false} />);
    
    expect(screen.queryByText('Time Range:')).not.toBeInTheDocument();
    expect(screen.queryByText('Show:')).not.toBeInTheDocument();
  });

  it('allows time range filtering', () => {
    render(<TaskTrendsChart trends={mockTrends} />);
    
    const timeRangeSelect = screen.getByDisplayValue('Last 14 days');
    fireEvent.change(timeRangeSelect, { target: { value: '7d' } });
    
    expect(timeRangeSelect).toHaveValue('7d');
  });

  it('allows metric toggling', () => {
    render(<TaskTrendsChart trends={mockTrends} />);
    
    const completedCheckbox = screen.getByLabelText(/completed/i);
    const createdCheckbox = screen.getByLabelText(/created/i);
    const inProgressCheckbox = screen.getByLabelText(/in progress/i);
    
    expect(completedCheckbox).toBeChecked();
    expect(createdCheckbox).toBeChecked();
    expect(inProgressCheckbox).not.toBeChecked();
    
    fireEvent.click(inProgressCheckbox);
    expect(inProgressCheckbox).toBeChecked();
    
    fireEvent.click(completedCheckbox);
    expect(completedCheckbox).not.toBeChecked();
  });

  it('displays data point count', () => {
    render(<TaskTrendsChart trends={mockTrends} />);
    
    expect(screen.getByText(/Showing \d+ data points/)).toBeInTheDocument();
  });

  it('filters data based on time range', () => {
    const longTrends: TrendData[] = [];
    const currentDate = new Date();
    
    // Generate 30 days of data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      longTrends.push({
        date: date.toISOString().split('T')[0],
        completed: Math.floor(Math.random() * 5),
        created: Math.floor(Math.random() * 3),
        inProgress: Math.floor(Math.random() * 4),
      });
    }
    
    render(<TaskTrendsChart trends={longTrends} />);
    
    // Should show 14 days by default
    expect(screen.getByText(/Showing \d+ data points over the last 14 days/)).toBeInTheDocument();
    
    // Change to 7 days
    const timeRangeSelect = screen.getByDisplayValue('Last 14 days');
    fireEvent.change(timeRangeSelect, { target: { value: '7d' } });
    
    expect(screen.getByText(/Showing \d+ data points over the last 7 days/)).toBeInTheDocument();
  });

  it('handles empty trends data', () => {
    render(<TaskTrendsChart trends={[]} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Showing 0 data points over the last 14 days')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(<TaskTrendsChart trends={mockTrends} height={600} />);
    
    const chartContainer = container.querySelector('[style*="height: 600px"]');
    expect(chartContainer).toBeInTheDocument();
  });

  it('passes correct data to Line chart component', () => {
    render(<TaskTrendsChart trends={mockTrends} />);
    
    const lineChart = screen.getByTestId('line-chart');
    const chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '{}');
    
    expect(chartData).toHaveProperty('labels');
    expect(chartData).toHaveProperty('datasets');
    expect(chartData.labels).toHaveLength(3);
    expect(chartData.datasets).toHaveLength(2); // Only completed and created by default
  });

  it('updates chart data when metrics are toggled', () => {
    render(<TaskTrendsChart trends={mockTrends} />);
    
    // Initially should have 2 datasets (completed and created)
    let lineChart = screen.getByTestId('line-chart');
    let chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '{}');
    expect(chartData.datasets).toHaveLength(2);
    
    // Enable in progress
    const inProgressCheckbox = screen.getByLabelText(/in progress/i);
    fireEvent.click(inProgressCheckbox);
    
    // Should now have 3 datasets
    lineChart = screen.getByTestId('line-chart');
    chartData = JSON.parse(lineChart.getAttribute('data-chart-data') || '{}');
    expect(chartData.datasets).toHaveLength(3);
  });
});