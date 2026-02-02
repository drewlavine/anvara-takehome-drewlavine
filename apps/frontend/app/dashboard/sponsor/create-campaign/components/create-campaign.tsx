'use client';

import { createCampaign } from '@/lib/actions';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useFormContext } from '@/lib/form-context';
import { useAuth } from '@/lib/auth-context';
import CurrencyInput from 'react-currency-input-field';

interface SubmitButtonProps {}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Creating...' : 'Create Campaign'}
    </button>
  );
}

export function CreateCampaign() {
  const [state, formAction] = useActionState(createCampaign, {});
  const { setCampaignFormSuccess } = useFormContext();
  const { user, sponsorId, loading } = useAuth();
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Redirect if not logged in or not a sponsor
  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (state?.success) {
      setCampaignFormSuccess(true);
      redirect('/dashboard/sponsor');
    }
  }, [state, setCampaignFormSuccess]);

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

  return (
    <div className="space-y-6">
      <button onClick={handleBack} className="text-[var(--color-primary)] hover:underline">
        ← Back to Campaigns
      </button>

      <div className="flex flex-col rounded-lg bg-(--color-background) border border-[var(--color-border)] p-6 w-full ">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Create Campaign</h1>
        </div>
        <form action={formAction}>
          <div className="mb-2 flex flex-col items-start justify-between space-y-4">
            <div className="grow w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="name">
                Campaign Name*
              </label>
              <input
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                type="text"
                name="name"
                defaultValue={(state.formData?.get('name') as string) || ''}
                onChange={(e) => setIsFormDirty(e.target.value !== '')}
                placeholder="Enter a campaign name"
                required
              />
            </div>
            <div className="grow w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="description">
                Description
              </label>
              <input
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                type="text"
                name="description"
                placeholder="Enter a campaign description"
                defaultValue={(state.formData?.get('description') as string) || ''}
                onChange={(e) => setIsFormDirty(e.target.value !== '')}
              />
            </div>
            <div className="grow w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="budget">
                Budget*
              </label>

              <CurrencyInput
                className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)] placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                name="budget"
                defaultValue={(state.formData?.get('budget') as unknown as number) || undefined}
                onValueChange={(value: string | undefined) => setIsFormDirty(value !== '')}
                prefix="$"
                placeholder="Enter a budget amount"
                required
              />

              <input type="hidden" name="sponsorId" value={sponsorId || ''} />
            </div>
            <div className="flex grow w-full gap-4 justify-between">
              <div className="grow w-full">
                <label className="block text-sm/6 font-medium text-white" htmlFor="startDate">
                  Start Date*
                </label>
                <input
                  className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                  type="date"
                  name="startDate"
                  defaultValue={(state.formData?.get('startDate') as string) || ''}
                  onChange={(e) => setIsFormDirty(e.target.value !== '')}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="grow w-full">
                <label className="block text-sm/6 font-medium text-white" htmlFor="endDate">
                  End Date*
                </label>
                <input
                  className="rounded-lg bg-(--color-foreground) border border-[var(--color-border)]  placeholder:text-gray-400 text-gray-900 text-sm border-slate-200 px-3 py-2 w-full"
                  type="date"
                  name="endDate"
                  defaultValue={(state.formData?.get('endDate') as string) || ''}
                  onChange={(e) => setIsFormDirty(e.target.value !== '')}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <input type="hidden" name="sponsorId" value={sponsorId || ''} />
            </div>

            <SubmitButton />

            {state?.error && <p className="text-red-600 mt-2">{state.error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
