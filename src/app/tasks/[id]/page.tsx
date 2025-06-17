import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTaskById, getUserById } from '@/lib/data';
import { formatDateTime, getPriorityColor, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { TaskTimeTrackingSection } from '@/components/TaskTimeTrackingSection';

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const task = await getTaskById(params.id);
  
  if (!task) {
    notFound();
  }

  const assignee = await getUserById(task.assigneeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Tasks
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <div className="mt-4 flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority} priority
              </span>
            </div>
          </div>
          
          <Link
            href={`/tasks/${task.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Task
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Time Tracking */}
          <TaskTimeTrackingSection taskId={task.id} taskTitle={task.title} />

          {/* Description */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Task Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <User className="mr-2 h-4 w-4" />
                  Assignee
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {assignee?.name || 'Unknown User'}
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Due Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {task.dueDate ? formatDateTime(task.dueDate) : 'No due date'}
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDateTime(task.createdAt)}
                </dd>
              </div>
              
              <div>
                <dt className="flex items-center text-sm font-medium text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDateTime(task.updatedAt)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{task.category}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}