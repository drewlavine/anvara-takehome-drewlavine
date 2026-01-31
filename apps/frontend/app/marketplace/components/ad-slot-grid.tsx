'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMarketplaceAdSlots } from '@/lib/actions';
import { AdSlot } from '@/lib/types';
import Image from 'next/image';
import { getImage } from '@/lib/utils';
import { SocialInfo } from './social-info';
const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

function TypeIcon({ type }: { type: string }) {
  const base = 'w-3 h-3';
  switch (type) {
    case 'DISPLAY':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={base}
          aria-hidden
        >
          <rect x="1.5" y="3" width="14" height="8" rx="1" />
          <path d="M9 11v8" />
          <path d="M5 19h8" />
        </svg>
      );
    case 'VIDEO':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      );
    case 'NEWSLETTER':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      );
    case 'PODCAST':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
      );
    default:
      return null;
  }
}

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
