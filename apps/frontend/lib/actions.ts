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
    const unformattedBudget = formData.get('budget') as string;
    const budget = parseFloat(unformattedBudget.replace('$', ''));
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const sponsorId = formData.get('sponsorId');

    const campaign = await api<Campaign>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({ name, description, budget, startDate, endDate, sponsorId }),
    });

    if (!campaign) {
      return {
        success: false,
        formData: formData,
        error: 'Failed to create campaign',
      };
    }

    revalidatePath('/dashboard/sponsor');

    return { success: true };
  } catch (error) {
    console.log('Error creating campaign:', error);
    return {
      success: false,
      formData: formData,
      error: error instanceof Error ? error.message : 'Failed to create campaign',
    };
  }
}

export async function updateCampaign(formData: FormData): Promise<ActionState> {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description');
    const budget = formData.get('budget');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const publisherId = formData.get('publisherId');

    console.log('budget', budget);

    const campaign = await api<Campaign>(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, name, description, budget, startDate, endDate, publisherId }),
    });

    if (!campaign) {
      return {
        success: false,
        formData: formData,
        error: 'Failed to update campaign',
      };
    }

    revalidatePath('/dashboard/sponsor');

    return { success: true };
  } catch (error) {
    console.log('Error updating campaign:', error);
    return {
      success: false,
      formData: formData,
      error: error instanceof Error ? error.message : 'Failed to update campaign',
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
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const unformattedBasePrice = formData.get('basePrice') as string;
    const basePrice = parseFloat(unformattedBasePrice.replace('$', ''));
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
        error: 'Failed to create ad slot',
      };
    }

    revalidatePath('/dashboard/publisher');

    return { success: true };
  } catch (error) {
    console.log('Error creating Ad Slot:', error);
    return {
      success: false,
      formData: formData,
      error: error instanceof Error ? error.message : 'Failed to create ad slot',
    };
  }
}

export async function updateAdSlot(formData: FormData): Promise<ActionState> {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const basePrice = formData.get('basePrice') as unknown as number;
    const publisherId = formData.get('publisherId') as string;

    const adSlot = await api<AdSlot>(`/api/ad-slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name,
        description,
        basePrice,
        publisherId,
      }),
    });

    if (!adSlot) {
      return {
        success: false,
        formData: formData,
        error: 'Failed to update ad slot',
      };
    }

    revalidatePath('/dashboard/publisher');

    return { success: true };
  } catch (error) {
    console.log('Error updating ad slot:', error);
    return {
      success: false,
      formData: formData,
      error: error instanceof Error ? error.message : 'Failed to update ad slot',
    };
  }
}

export async function getAdSlot(id: string): Promise<AdSlot> {
  return api<AdSlot>(`/api/ad-slots/${id}`);
}

// Fetch ad slots for publisher dashboard (requires auth)
export async function getAdSlots(publisherId?: string): Promise<AdSlot[]> {
  return api<AdSlot[]>(publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots');
}

// Fetch ad slots for marketplace (public, no auth required)
export async function getMarketplaceAdSlots(): Promise<AdSlot[]> {
  return api<AdSlot[]>('/api/ad-slots/marketplace');
}

// Fetch single ad slot for marketplace (public, no auth required)
export async function getMarketplaceAdSlot(id: string): Promise<AdSlot> {
  return api<AdSlot>(`/api/ad-slots/marketplace/${id}`);
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

export async function bookAdSlot(
  adSlotId: string,
  sponsorId: string,
  message?: string
): Promise<ActionState> {
  try {
    if (!adSlotId || !sponsorId) {
      return {
        success: false,
        error: 'Ad Slot ID and Sponsor ID are required',
      };
    }

    await api<void>(`/api/ad-slots/${adSlotId}/book`, {
      method: 'POST',
      body: JSON.stringify({ sponsorId, message: message || undefined }),
    });

    revalidatePath('/marketplace');

    return { success: true };
  } catch (error) {
    console.log('Error booking ad slot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to book placement',
    };
  }
}

export async function unbookAdSlot(adSlotId: string): Promise<ActionState> {
  try {
    if (!adSlotId) {
      return {
        success: false,
        error: 'Ad Slot ID is required',
      };
    }

    await api<void>(`/api/ad-slots/${adSlotId}/unbook`, {
      method: 'POST',
    });

    revalidatePath('/marketplace');

    return { success: true };
  } catch (error) {
    console.log('Error unbooking ad slot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset booking',
    };
  }
}
