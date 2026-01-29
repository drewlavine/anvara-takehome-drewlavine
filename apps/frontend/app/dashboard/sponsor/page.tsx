import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import Link from 'next/dist/client/link';

export default async function SponsorDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Verify user has 'sponsor' role
  const roleData = await getUserRole(session.user.id);
  if (roleData.role !== 'sponsor') {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-left gap-4">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <Link
          href="/dashboard/sponsor/create-campaign"
          className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:bg-[var(--color-primary-hover)]"
        >
          Create Campaign
        </Link>
      </div>

      <CampaignList />
    </div>
  );
}
