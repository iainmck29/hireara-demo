import { CheckCircle, Clock, AlertTriangle, Users, TrendingUp, List } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '@/types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      name: 'Total Tasks',
      value: stats.totalTasks,
      icon: List,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      name: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100',
    },
    {
      name: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      name: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        );
      })}
    </div>
  );
}