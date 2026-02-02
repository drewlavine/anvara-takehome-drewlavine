'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMarketplaceAdSlots } from '@/lib/actions';
import { AdSlot } from '@/lib/types';
import Image from 'next/image';
import { getImage } from '@/lib/utils';
import { SocialInfo } from './social-info';
import { TypeIcon, typeColors } from '../marketplaceUtils';

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        <div
          key={slot.id}
          role="link"
          tabIndex={0}
          onClick={() => router.push(`/marketplace/${slot.id}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.push(`/marketplace/${slot.id}`);
          }}
          className="group block rounded-lg border border-[var(--color-border)] shadow-sm bg-(--color-foreground) cursor-pointer hover:shadow-xl hover:shadow-gray-500 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="relative">
            <Image
              src={getImage(slot.type)}
              width={400}
              height={200}
              className="mb-2 h-48 w-full rounded object-cover"
              alt="Ad Slot Image"
            />

            <span
              className={`absolute top-2 left-2 inline-flex items-center gap-0.5 rounded px-2 py-1 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
            >
              <TypeIcon type={slot.type} />
              {slot.type}
            </span>
          </div>
          <div className="pt-2 pb-2 pl-4 pr-4 ">
            <div className="flex items-start justify-between">
              {slot.publisher && (
                <h3 className="text-xl font-bold text-slate-800">{slot.publisher.name}</h3>
              )}
              <span className="font-semibold text-[var(--color-primary)]">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </div>
            <h3 className="text-slate-500 text-sm">{slot.name}</h3>

            <SocialInfo type={slot.type} />

            {slot.description && (
              <p className="mb-3 text-sm text-slate-900 line-clamp-2">{slot.description}</p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                15 offers
              </span>
              <Link
                href={`/marketplace/${slot.id}`}
                className="bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 group-hover:bg-indigo-600 transition-colors"
              >
                View opportunity
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
