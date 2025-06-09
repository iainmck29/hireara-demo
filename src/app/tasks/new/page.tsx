import { TaskForm } from '@/components/TaskForm';
import { getUsers } from '@/lib/data';

export default async function NewTaskPage() {
  const users = await getUsers();

  return <TaskForm users={users} />;
}