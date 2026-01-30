'use client';

import Link from 'next/link';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    description?: string;
    budget: number;
    spent: number;
    status: string;
    startDate: string;
    endDate: string;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{campaign.name}</h3>
          <Link href={`/dashboard/sponsor/${campaign.id}/edit`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
        >
          {campaign.status}
        </span>
      </div>

      {campaign.description && (
        <p className="mb-3 text-sm text-[var(--color-muted)] line-clamp-2">
          {campaign.description}
        </p>
      )}

      <div className="mb-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">Budget</span>
          <span>
            ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
          </span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-[var(--color-primary)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-[var(--color-muted)]">
        {new Date(campaign.startDate).toLocaleDateString('en-US', { timeZone: 'UTC' })} -{' '}
        {new Date(campaign.endDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}
      </div>
    </div>
  );
}
