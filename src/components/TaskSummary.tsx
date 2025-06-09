import Link from 'next/link';
import { Task, User } from '@/types';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface TaskSummaryProps {
  tasks: Task[];
  users: User[];
}

export function TaskSummary({ tasks, users }: TaskSummaryProps) {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Unknown User';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Tasks
          </h3>
          <Link
            href="/tasks"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                  {task.title}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Assigned to {getUserName(task.assigneeId)} • Updated {formatDate(task.updatedAt)}
                </p>
              </div>
              
              <Link
                href={`/tasks/${task.id}`}
                className="ml-4 flex-shrink-0 text-blue-600 hover:text-blue-500"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>
        
        {recentTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}