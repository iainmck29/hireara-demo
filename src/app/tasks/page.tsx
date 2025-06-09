import { TaskList } from '@/components/TaskList';
import { getTasks, getUsers } from '@/lib/data';

export default async function TasksPage() {
  const [tasks, users] = await Promise.all([
    getTasks(),
    getUsers(),
  ]);

  return <TaskList tasks={tasks} users={users} />;
}