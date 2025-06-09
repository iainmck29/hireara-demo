import { DashboardStats } from '@/components/DashboardStats';
import { TaskSummary } from '@/components/TaskSummary';
import { getDashboardStats, getTasks, getUsers } from '@/lib/data';

export default async function HomePage() {
  const [stats, tasks, users] = await Promise.all([
    getDashboardStats(),
    getTasks(),
    getUsers(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Task Summary */}
      <TaskSummary tasks={tasks} users={users} />
    </div>
  );
}