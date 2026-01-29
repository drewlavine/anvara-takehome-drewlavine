'use client';

import { useEffect, useState } from 'react';
import { getAdSlots } from '@/lib/actions';
import { authClient } from '@/auth-client';
import { AdSlotCard } from './ad-slot-card';
import { AdSlot } from '@/lib/types';
import { useFormContext } from '@/lib/form-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export function AdSlotList() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const { adSlotFormSuccess, setAdSlotFormSuccess } = useFormContext();

  useEffect(() => {
    async function loadAdSlots() {
      if (!session?.user?.id) return;

      try {
        // Get the user's publisherId from the backend
        const roleRes = await fetch(`${API_URL}/api/auth/role/${session.user.id}`);
        const roleData = await roleRes.json();

        if (roleData.publisherId) {
          const data = await getAdSlots(roleData.publisherId);
          setAdSlots(data);
        } else {
          setAdSlots([]);
        }
      } catch {
        setError('Failed to load ad slots');
      } finally {
        setLoading(false);
      }
    }

    loadAdSlots();
  }, [session?.user?.id]);

  if (loading) {
    return <div className="py-8 text-center text-[var(--color-muted)]">Loading ad slots...</div>;
  }

  if (error) {
    return <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (adSlots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-[var(--color-muted)]">
        No ad slots yet. Create your first ad slot to start earning.
      </div>
    );
  }

  return (
    <>
      {adSlotFormSuccess && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 ">
          <span>Ad slot created successfully</span>
          <button
            onClick={() => setAdSlotFormSuccess(false)}
            className="ml-4 text-green-600 hover:text-green-800"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adSlots.map((slot) => (
          <AdSlotCard key={slot.id} adSlot={slot} />
        ))}
      </div>
    </>
  );
}
