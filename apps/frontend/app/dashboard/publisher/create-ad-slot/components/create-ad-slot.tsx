'use client';

import { createAdSlot } from '@/lib/actions';
import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useFormContext } from '@/lib/form-context';
import { getUserRole } from '@/lib/auth-helpers';
import { authClient } from '@/auth-client';
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
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Creating...' : 'Create Ad Slot'}
    </button>
  );
}

export function CreateAdSlot() {
  const [state, formAction] = useActionState(createAdSlot, {});
  const { setAdSlotFormSuccess } = useFormContext();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = data.user as User;

          // Fetch role info from backend using getUserRole
          getUserRole(sessionUser.id)
            .then((data) => setRoleInfo(data))
            .catch(() => setRoleInfo(null));
        } else {
          redirect('/login');
        }
      })
      .catch(() => redirect('/login'));
  }, []);

  useEffect(() => {
    if (state?.error && state.formData?.get('type')) {
      const typeValue = state.formData.get('type') as string;

      if (selectRef.current) {
        selectRef.current.value = typeValue;
      }
    }
    if (state?.success) {
      setAdSlotFormSuccess(true);
      redirect('/dashboard/publisher');
    }
  }, [state, setAdSlotFormSuccess]);

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

  return (
    <div className="space-y-6">
      <button onClick={handleBack} className="text-[var(--color-primary)] hover:underline">
        ← Back to Ad Slots
      </button>
      <div className="flex flex-col rounded-lg bg-(--color-background) border border-[var(--color-border)] p-6 w-full ">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Create Ad Slot</h1>
        </div>
        <form action={formAction}>
          <div className="mb-2 flex flex-col items-start justify-between space-y-4">
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="name">
                Ad Slot Name*
              </label>
              <input
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                type="text"
                name="name"
                defaultValue={(state.formData?.get('name') as string) || ''}
                onChange={(e) => setIsFormDirty(e.target.value !== '')}
                placeholder="Enter an ad slot name"
                required
              />
            </div>
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                name="description"
                defaultValue={(state.formData?.get('description') as string) || ''}
                onChange={(e) => setIsFormDirty(e.target.value !== '')}
                placeholder="Enter an ad slot description"
              />
            </div>
            <div className="grow  w-full">
              <label className="block text-md font-semibold text-white mb-1" htmlFor="type">
                Type
              </label>
              <select
                ref={selectRef}
                name="type"
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                onChange={() => setIsFormDirty(true)}
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
              <label className="block text-md font-semibold text-white mb-1" htmlFor="basePrice">
                Base Price*
              </label>
              <CurrencyInput
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                name="basePrice"
                defaultValue={(state.formData?.get('basePrice') as unknown as number) || undefined}
                onValueChange={(value) => setIsFormDirty(value !== '')}
                prefix="$"
                placeholder="Enter a base price amount"
                allowNegativeValue={false}
                required
              />
              <input type="hidden" name="publisherId" value={roleInfo?.publisherId || ''} />
            </div>

            <SubmitButton />

            {state?.error && <p className="text-red-600 mt-2">{state.error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
