'use client';

import { useState, FormEvent } from 'react';
import { getCampaign, updateCampaign } from '@/lib/actions';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { authClient } from '@/auth-client';
import { dateToLocalISOString } from '@/lib/utils';
import CurrencyInput from 'react-currency-input-field';

interface User {
  id: string;
  name: string;
  email: string;
}

interface RoleInfo {
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
  name?: string;
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
      disabled={isPending}
      type="submit"
    >
      {isPending ? 'Updating...' : 'Update Campaign'}
    </button>
  );
}

export function EditCampaign({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Form field states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;

          // Fetch role info from backend
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${sessionUser.id}`
          )
            .then((res) => res.json())
            .then((data) => setRoleInfo(data))
            .catch(() => setRoleInfo(null));
        } else {
          redirect('/login');
        }
      })
      .catch(() => redirect('/login'));
  }, []);

  useEffect(() => {
    getCampaign(id)
      .then((data) => {
        console.log('campaignData', data);
        // Initialize form fields with campaign data
        setName(data.name || '');
        setDescription(data.description || '');
        setBudget(data.budget?.toString() || '');
        setStartDate(data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '');
        setEndDate(data.endDate ? dateToLocalISOString(data.endDate).split('T')[0] : '');
      })
      .catch((err) => console.error('Failed to load campaign:', err));
  }, []);

  const handleBack = () => {
    if (isFormDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) {
        return;
      }
    }

    redirect('/dashboard/sponsor');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('budget', budget);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('publisherId', roleInfo?.publisherId || '');

      const result = await updateCampaign({}, formData);

      if (result?.success) {
        setShowSuccessNotification(true);
        setUpdateError(null);
        setIsFormDirty(false);
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 5000);
      } else {
        setUpdateError(result?.error || 'Failed to update campaign');
      }
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update campaign');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {updateError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-700">{updateError}</p>
          </div>
          <button onClick={() => setUpdateError(null)} className="text-red-600 hover:text-red-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <button onClick={handleBack} className="text-[var(--color-primary)] hover:underline">
        ← Back to Campaigns
      </button>
      {showSuccessNotification && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 ">
          <span>Campaign updated successfully</span>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="text-green-600 hover:text-green-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex flex-col rounded-lg bg-(--color-background) border border-[var(--color-border)] p-6 w-full ">
        <div className="mb-4 flex justify-between">
          <h1 className="text-2xl font-bold">Edit Campaign</h1>
          <button
            className="rounded-lg bg-[var(--color-error)] px-3 py-2.5 font-semibold text-white hover:opacity-90"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex flex-col items-start justify-between space-y-4">
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="name">
                Campaign Name*
              </label>
              <input
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                type="text"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsFormDirty(true);
                }}
                placeholder="Enter a campaign name"
                required
              />
            </div>
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="description">
                Description
              </label>
              <input
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-3 w-full"
                type="text"
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsFormDirty(true);
                }}
                placeholder="Enter a campaign description"
              />
            </div>
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="basePrice">
                Budget*
              </label>
              <CurrencyInput
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                name="basePrice"
                value={budget}
                onValueChange={(value) => {
                  setBudget(value || '');
                  setIsFormDirty(true);
                }}
                prefix="$"
                placeholder="Enter a budget amount"
                required
              />
              <input type="hidden" name="sponsorId" value={roleInfo?.sponsorId || ''} />
            </div>
            <div className="flex grow  w-full gap-4 justify-between">
              <div className="grow w-full">
                <label className="block text-md font-semibold text-white mb-1" htmlFor="basePrice">
                  Start Date*
                </label>
                <input
                  className="rounded-lg bg-[var(--color-foreground)] border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setIsFormDirty(true);
                  }}
                  required
                />
              </div>
              <div className="grow w-full">
                <label className="block text-md font-semibold text-white mb-1" htmlFor="basePrice">
                  End Date*
                </label>
                <input
                  className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setIsFormDirty(true);
                  }}
                  required
                />
              </div>
              <input type="hidden" name="publisherId" value={roleInfo?.publisherId || ''} />
              <input type="hidden" name="id" value={id || ''} />
            </div>

            <div className="flex gap-4 mt-1">
              <SubmitButton isPending={isPending} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
