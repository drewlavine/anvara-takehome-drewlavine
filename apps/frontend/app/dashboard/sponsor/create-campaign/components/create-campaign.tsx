'use client';

import { createCampaign } from '@/lib/actions';
import { useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useFormContext } from '@/lib/form-context';
import { authClient } from '@/auth-client';


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
      className="w-10 rounded-lg bg-[var(--color-primary)] px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
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
  const [user, setUser] = useState<User | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
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
                .finally(() => setRoleLoading(false));
            } else {
              setRoleLoading(false);
            }
          })
          .catch(() => setRoleLoading(false));
  }, [])



  useEffect(() => {
    if (state?.success) {
      setCampaignFormSuccess(true);
      redirect('/dashboard/sponsor');
    }
  }, [state, setCampaignFormSuccess]);

  const handleBack = () => {

  };

  return (
    <div className="space-y-6">
      <button onClick={handleBack} className="text-[var(--color-primary)] hover:underline">
        ← Back to Campaigns
      </button>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] p-6 w-full max-w-1/2">
        <form action={formAction}>
          <div className="mb-4 flex flex-col items-start justify-between space-y-4">
            <div className="grow max-w-md w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="name">
                Campaign Name*
              </label>
              <input
                className="rounded-lg border border-[var(--color-border)] placeholder:text-slate-400 text-slate-700 text-sm border-slate-200 px-3 py-1 w-full"
                type="text"
                name="name"
                defaultValue={state.formData?.get("name") as string|| ''}
                required
              />
            </div>
            <div className="grow max-w-md w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="description">
                Description
              </label>
              <input
                className="rounded-lg border border-[var(--color-border)] placeholder:text-slate-400 text-slate-700 text-sm border-slate-200 px-3 py-3 w-full"
                type="text"
                name="description"
                defaultValue={state.formData?.get("description") as string|| ''}
              />
            </div>
            <div className="grow max-w-md w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="basePrice">
                Budget*
              </label>
              <input
                className="rounded-lg border border-[var(--color-border)] placeholder:text-slate-400 text-slate-700 text-sm border-slate-200 px-3 py-3 w-full"
                type="number"
                inputMode="decimal"
                name="basePrice"
                defaultValue={(state.formData?.get("basePrice") as unknown) as number || undefined}
                required
              />
              <input type="hidden" name="publisherId" value={roleInfo?.publisherId || ''} />
            </div>
            <div className="flex grow max-w-md w-full gap-4 justify-between">
              <div className="grow w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="basePrice">
                Start Date*
              </label>
              <input
                className="rounded-lg border border-[var(--color-border)] placeholder:text-slate-400 text-slate-700 text-sm border-slate-200 px-3 py-3 w-full"
                type="date"
                name="startDate"
                required
              />

              </div>
              <div className="grow w-full">
              <label className="block text-sm/6 font-medium text-white" htmlFor="basePrice">
                End Date*
              </label>
              <input
                className="rounded-lg border border-[var(--color-border)] placeholder:text-slate-400 text-slate-700 text-sm border-slate-200 px-3 py-3 w-full"
                type="date"
                name="endDate"
                required
              />

              </div>
              <input type="hidden" name="publisherId" value={roleInfo?.publisherId || ''} />
            </div>

            <SubmitButton  />

            {state?.error && <p className="text-red-600 mt-2">{state.error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
