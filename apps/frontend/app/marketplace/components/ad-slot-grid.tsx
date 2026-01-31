'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMarketplaceAdSlots } from '@/lib/actions';
import { AdSlot } from '@/lib/types';
import Image from 'next/image';
import placeholder from '../../../assets/placeholder.png';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarketplaceAdSlots()
      .then(setAdSlots)
      .catch(() => setError('Failed to load ad slots'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-[--color-muted]">Loading marketplace...</div>;
  }

  if (error) {
    return <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (adSlots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-border)] p-12 text-center text-[var(--color-muted)]">
        No ad slots available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <Link
          key={slot.id}
          href={`/marketplace/${slot.id}`}
          className="block rounded-lg border border-[var(--color-border)] transition-shadow hover:shadow-md bg-(--color-foreground)"
        >
          <div className="relative">
            <Image
              src={placeholder}
              width={400}
              height={200}
              className="mb-2 h-48 w-full rounded object-cover"
              alt="Ad Slot Image"
            />

            <span className="absolute left-2 bottom-2 bg-white/90 text-[var(--color-primary)] font-semibold px-2 py-1 rounded shadow">
              ${Number(slot.basePrice).toLocaleString()}/mo
            </span>
          </div>
          <div className="pt-2 pb-2 pl-4 pr-4 ">
            <div className="mb-2 flex items-start justify-between">
              <h2 className="font-semibold ">{slot.name}</h2>
              <span
                className={`rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
              >
                {slot.type}
              </span>
            </div>

            {slot.publisher && (
              <p className="mb-2 text-sm text-[var(--color-muted)]">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-3 text-sm text-[var(--color-muted)] line-clamp-2">
                {slot.description}
              </p>
            )}

            <div className="flex items-center">
              <span
                className={`text-sm ${slot.isAvailable ? 'text-green-600' : 'text-[var(--color-muted)]'}`}
              >
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
