'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMarketplaceAdSlot } from '@/lib/actions';
import { authClient } from '@/auth-client';
import { AdSlotDetailMainCard } from './ad-slot-detail-main-card';
import { AdSlot, User, RoleInfo } from '@/lib/types';
import { AdSlotDetailBookingCard } from './ad-slot-detail-booking-card';

interface Props {
  id: string;
}

export function AdSlotDetail({ id }: Props) {
  const [adSlot, setAdSlot] = useState<AdSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);

  useEffect(() => {
    // Fetch ad slot using public marketplace endpoint (no auth required)
    getMarketplaceAdSlot(id)
      .then(setAdSlot)
      .catch(() => setError('Failed to load ad slot details'))
      .finally(() => setLoading(false));

    // Check user session and fetch role
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;
          setUser(sessionUser);

          // Fetch role info from backend
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${sessionUser.id}`
          )
            .then((res) => res.json())
            .then((data) => setRoleInfo(data))
            .catch(() => setRoleInfo(null))
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-[var(--color-muted)]">Loading...</div>;
  }

  if (error || !adSlot) {
    return (
      <div className="space-y-4">
        <Link href="/marketplace" className="text-[var(--color-primary)] hover:underline">
          ← Back to Marketplace
        </Link>
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
          {error || 'Ad slot not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="text-[var(--color-primary)] hover:underline">
        ← Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-6">
          <AdSlotDetailMainCard adSlot={adSlot} />
        </div>
        <div className="lg:col-span-1">
          <AdSlotDetailBookingCard
            adSlotId={adSlot.id}
            sponsorId={roleInfo?.sponsorId || ''}
            monthlyCost={adSlot.basePrice}
            name={user?.name || ''}
          />
        </div>
      </div>
    </div>
  );
}
