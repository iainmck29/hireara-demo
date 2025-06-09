import { UserProfile } from '@/components/UserProfile';
import { getUserById } from '@/lib/data';

export default async function ProfilePage() {
  // For demo purposes, using the first user (Alice Johnson)
  const user = await getUserById('user-1');
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
        <p className="mt-2 text-gray-600">The user profile could not be loaded.</p>
      </div>
    );
  }

  return <UserProfile user={user} />;
}