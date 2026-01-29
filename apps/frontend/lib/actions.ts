'use server';

import { headers } from 'next/headers';
import { Campaign } from '../types';
import { AdSlot } from './types';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

type ActionState = {
  success?: boolean;
  error?: string;
  formData?: FormData;
};

async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headersList = await headers();
  const cookie = headersList.get('cookie');

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { Cookie: cookie }),
      ...options?.headers,
    },
    ...options,
  });

  console.log('API Response Status:', res);

  if (!res.ok) throw new Error('API request failed');

  // Handle empty responses (204 No Content, etc.)
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json') || res.status === 204) {
    return undefined as T;
  }

  return res.json();
}


export async function createCampaign(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    console.log('prevState', prevState);
    const name = formData.get('name') as string;
    const description = formData.get('description');
    const budget = formData.get('budget');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');

    const campaign = await api<Campaign>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({ name, description, budget, startDate, endDate }),
    });

    if (!campaign) {
      return {
        success: false,
        formData: formData,
        error: 'Failed to create campaign',
      };
    }

    revalidatePath('/dashboard/sponsor');

    return {success: true};

  } catch (error) {
    console.log('Error creating campaign:', error);
    return {
      success: false,
      formData: formData,
      error: error instanceof Error ? error.message : 'Failed to create campaign',
    };
  }
}



export async function getCampaign(id: string): Promise<Campaign> {
  return api<Campaign>(`/api/campaigns/${id}`);
}

export async function getCampaigns(sponsorId?: string): Promise<Campaign[]> {
  return api<Campaign[]>(sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns');
}

export async function deleteCampaign(id: string): Promise<void> {
  return api<void>(`/api/campaigns/${id}`, {
    method: 'DELETE',
  });
}

export async function createAdSlot(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    console.log('prevState', prevState);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const basePrice = parseFloat(formData.get('basePrice') as string);
    const type = formData.get('type') as string;
    const publisherId = formData.get('publisherId') as string;

    const adSlot = await api<AdSlot>('/api/ad-slots', {
      method: 'POST',
      body: JSON.stringify({ name, description, basePrice, type, publisherId }),
    });

    if (!adSlot) {
      return {
        success: false,
        formData: formData,
        error: 'Failed to create campaign',
      };
    }

    revalidatePath('/dashboard/publisher');

    return {success: true};

  } catch (error) {
    console.log('Error creating campaign:', error);
    return {
      success: false,
      formData: formData,
      error: error instanceof Error ? error.message : 'Failed to create campaign',
    };
  }
}

export async function getAdSlot(id: string): Promise<AdSlot> {
  return api<AdSlot>(`/api/ad-slots/${id}`);
}

export async function getAdSlots(publisherId?: string): Promise<AdSlot[]> {
  return api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
}

export async function deleteAdSlot(id: string): Promise<ActionState> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Ad Slot ID is required',
      };
    }

    await api<void>(`/api/ad-slots/${id}`, {
      method: 'DELETE',
    });

    revalidatePath('/dashboard/publisher');

    return { success: true };
  } catch (error) {
    console.log('are we in the error state', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
