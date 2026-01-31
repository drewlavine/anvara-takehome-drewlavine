'use client';

import { useState, FormEvent, useRef } from 'react';
import { getAdSlot, updateAdSlot, deleteAdSlot } from '@/lib/actions';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { authClient } from '@/auth-client';
import CurrencyInput from 'react-currency-input-field';
import { useFormContext } from '@/lib/form-context';

interface AdSlot {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  isAvailable: boolean;
  publisher?: {
    id: string;
    name: string;
    website?: string;
  };
}

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

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface Props {
  id: string;
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
      disabled={isPending}
      type="submit"
    >
      {isPending ? 'Updating...' : 'Update Ad Slot'}
    </button>
  );
}

export function EditAdSlot({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);
  const { setAdSlotDeleteSuccess } = useFormContext();
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form field states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [type, setType] = useState('Display');

  const router = useRouter();

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
    getAdSlot(id)
      .then((data) => {
        console.log('campaignData', data);
        // Initialize form fields with campaign data
        setName(data.name || '');
        setDescription(data.description || '');
        setBasePrice(data.basePrice?.toString() || '');
        setType(data.type || '');
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

    redirect('/dashboard/publisher');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('basePrice', basePrice);
      formData.append('type', type);
      formData.append('publisherId', roleInfo?.publisherId || '');

      const result = await updateAdSlot(formData);

      if (result?.success) {
        setShowSuccessNotification(true);
        setApiError(null);
        setIsFormDirty(false);
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 5000);
      } else {
        setApiError(result?.error || 'Failed to update ad slot');
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update ad slot');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this ad slot? This action cannot be undone.'
    );

    if (!confirmDelete) {
      return;
    }

    setIsPending(true);

    try {
      await deleteAdSlot(id);
      setAdSlotDeleteSuccess(true);
      router.push('/dashboard/publisher');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete ad slot');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={handleBack} className="text-[var(--color-primary)] hover:underline">
        ← Back to Ad Slots
      </button>
      {showSuccessNotification && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 ">
          <span>Ad Slot updated successfully</span>
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
      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
          <button onClick={() => setApiError(null)} className="text-red-600 hover:text-red-800">
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
          <h1 className="text-2xl font-bold">Edit Ad Slot</h1>
          <button
            className="rounded-lg bg-[var(--color-error)] px-3 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
            type="button"
            onClick={handleDelete}
            disabled={isPending}
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
                Ad Slot Name*
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
                placeholder="Enter an ad slot name"
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
                placeholder="Enter an ad slot description"
              />
            </div>

            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="type">
                Type
              </label>
              <select
                name="type"
                value={type}
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                onChange={(e) => {
                  setType(e.target.value);
                  setIsFormDirty(true);
                }}
              >
                <option key="DISPLAY" value="DISPLAY">
                  Display
                </option>
                <option key="VIDEO" value="VIDEO">
                  Video
                </option>
                <option key="NATIVE" value="NATIVE">
                  Native
                </option>
                <option key="NEWSLETTER" value="NEWSLETTER">
                  Newsletter
                </option>
                <option key="PODCAST" value="PODCAST">
                  Podcast
                </option>
              </select>
            </div>
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="budget">
                Budget*
              </label>
              <CurrencyInput
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                name="basePrice"
                value={basePrice}
                onValueChange={(value) => {
                  setBasePrice(value || '');
                  setIsFormDirty(true);
                }}
                prefix="$"
                placeholder="Enter a base price amount"
                required
              />
            </div>

            <input type="hidden" name="publisherId" value={roleInfo?.publisherId || ''} />
            <input type="hidden" name="id" value={id || ''} />
          </div>

          <div className="flex gap-4 mt-1">
            <SubmitButton isPending={isPending} />
          </div>
        </form>
      </div>
    </div>
  );
}
