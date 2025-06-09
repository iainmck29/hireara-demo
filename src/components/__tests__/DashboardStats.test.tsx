import { render, screen } from '@testing-library/react';
import { DashboardStats } from '../DashboardStats';
import { DashboardStats as DashboardStatsType } from '@/types';

const mockStats: DashboardStatsType = {
  totalTasks: 10,
  completedToday: 3,
  inProgress: 4,
  overdue: 1,
  teamMembers: 5,
  completionRate: 75,
};

describe('DashboardStats', () => {
  it('renders all stat cards with correct values', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays zero values correctly', () => {
    const zeroStats: DashboardStatsType = {
      totalTasks: 0,
      completedToday: 0,
      inProgress: 0,
      overdue: 0,
      teamMembers: 0,
      completionRate: 0,
    };
    
    render(<DashboardStats stats={zeroStats} />);
    
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(5); // All zero values except completion rate
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});