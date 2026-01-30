'use client';

import { useEffect, useState } from 'react';
//import { getCampaigns } from '@/lib/api';
import { getCampaigns } from '@/lib/actions';
import { authClient } from '@/auth-client';
import { CampaignCard } from './campaign-card';
import { Campaign, Session } from '@/lib/types';
import { useFormContext } from '@/lib/form-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

// FIXME: This component fetches data client-side - should use Server Components
// See Challenge 2 in CHALLENGES.md for proper implementation
export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const { campaignFormSuccess, setCampaignFormSuccess } = useFormContext();
  const { campaignDeleteSuccess, setCampaignDeleteSuccess } = useFormContext();

  async function reloadCampaigns(session: Session | null) {
    if (!session?.user?.id) return;

    try {
      const roleRes = await fetch(`${API_URL}/api/auth/role/${session.user.id}`);
      const roleData = await roleRes.json();

      if (roleData.publisherId) {
        const data = await getCampaigns(roleData.sponsorId);
        setCampaigns(data);
      }
    } catch {
      // Keep existing data if reload fails
    }
  }

  useEffect(() => {
    async function loadCampaigns() {
      if (!session?.user?.id) return;

      try {
        // Get the user's sponsorId from the backend
        const roleRes = await fetch(`${API_URL}/api/auth/role/${session.user.id}`);
        const roleData = await roleRes.json();

        if (roleData.sponsorId) {
          const data = await getCampaigns(roleData.sponsorId);
          setCampaigns(data);
        } else {
          setCampaigns([]);
        }
      } catch {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [session?.user?.id]);

  // Reload ad slots when new ad slot is created
  useEffect(() => {
    if (campaignFormSuccess) {
      reloadCampaigns(session);
      setTimeout(() => {
        setCampaignFormSuccess(false);
      }, 5000);
    }
  }, [campaignFormSuccess, session, setCampaignFormSuccess]);

  // Reload ad slots when ad slot is deleted
  useEffect(() => {
    if (campaignDeleteSuccess) {
      reloadCampaigns(session);
      setTimeout(() => {
        setCampaignDeleteSuccess(false);
      }, 5000);
    }
  }, [campaignDeleteSuccess, session, setCampaignDeleteSuccess]);

  if (loading) {
    return <div className="py-8 text-center text-[var(--color-muted)]">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-[var(--color-muted)]">
        No campaigns yet. Create your first campaign to get started.
      </div>
    );
  }

  // TODO: Add sorting options (by date, budget, status)
  // TODO: Add pagination if campaigns list gets large
  return (
    <>
      {(campaignFormSuccess || campaignDeleteSuccess) && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 ">
          <span>Campaign {campaignFormSuccess ? 'created' : 'deleted'} successfully</span>
          {campaignFormSuccess ? (
            <button
              onClick={() => setCampaignFormSuccess(false)}
              className="ml-4 text-green-600 hover:text-green-800"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => setCampaignDeleteSuccess(false)}
              className="ml-4 text-green-600 hover:text-green-800"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          )}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </>
  );
}
