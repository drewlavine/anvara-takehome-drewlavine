import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import Link from 'next/dist/client/link';

export default async function PublisherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'publisher' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'publisher') {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-left gap-4">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        <Link
          href="/dashboard/publisher/create-ad-slot"
          className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:bg-[var(--color-primary-hover)]"
        >
          Create Ad Slot
        </Link>
      </div>

      <AdSlotList />
    </div>
  );
}
