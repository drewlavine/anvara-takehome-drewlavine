// Utility helpers for the API

// Helper to safely extract route/query params
// BUG: Return type should be 'string' but function can return empty string silently
export function getParam(param: unknown): string {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && typeof param[0] === 'string') return param[0];
  return '';
}

// Helper to format currency values
export function formatCurrency(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

// Helper to calculate percentage change
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Parse pagination params from query
type PaginationQuery = { page: string; limit: string };
type Pagination = { page: number; limit: number; skip: number };
export function parsePagination(query: PaginationQuery): Pagination {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to build filter object from query params
// Decided to go with Record<string, string> for both since
export const buildFilters = (
  query: Record<string, string>,
  allowedFields: string[]
): Record<string, string> => {
  const filters: Record<string, string> = {};

  for (const field of allowedFields) {
    if (query[field] !== undefined) {
      filters[field] = query[field];
    }
  }

  return filters;
};

export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// TODO: Add proper date formatting helper
// This is a stub that candidates might notice and implement
export function formatDate(date: string | number | Date): string {
  // BUG: Doesn't handle invalid dates
  return new Date(date).toLocaleDateString();
}

type FieldValidation = {
  canBeNull: boolean;
  mustBePositive: boolean;
  requiredInPost: boolean;
  label: string;
};
// Validate campaign fields

// Chose not to include created-at/updated-at in this since users shouldn't be able to update that
const campaignFieldValidations: Record<string, FieldValidation> = {
  id: { canBeNull: false, mustBePositive: false, requiredInPost: false, label: 'ID' },
  name: { canBeNull: false, mustBePositive: false, requiredInPost: true, label: 'Name' },
  budget: { canBeNull: false, mustBePositive: true, requiredInPost: true, label: 'Budget' },
  spent: { canBeNull: false, mustBePositive: true, requiredInPost: false, label: 'Spent' },
  startDate: { canBeNull: false, mustBePositive: false, requiredInPost: true, label: 'Start date' },
  endDate: { canBeNull: false, mustBePositive: false, requiredInPost: true, label: 'End date' },
  targetCategories: {
    canBeNull: false,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Target categories',
  },
  targetRegions: {
    canBeNull: false,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Target regions',
  },
  sponsor: { canBeNull: false, mustBePositive: false, requiredInPost: false, label: 'Sponsor' },
  creatives: { canBeNull: false, mustBePositive: false, requiredInPost: false, label: 'Creatives' },
  placements: {
    canBeNull: false,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Placements',
  },
  cpmRate: { canBeNull: true, mustBePositive: true, requiredInPost: false, label: 'CPM rate' },
  cpcRate: { canBeNull: true, mustBePositive: true, requiredInPost: false, label: 'CPC rate' },
  sponsorId: { canBeNull: false, mustBePositive: false, requiredInPost: true, label: 'Sponsor ID' },
};

export function validateCampaignFields(data: Record<string, unknown>): string | null {
  for (const [field, validation] of Object.entries(campaignFieldValidations)) {
    if (field in data) {
      const value = data[field];
      if (validation.requiredInPost && !value) {
        console.log('missing required field:', field);
        return `${validation.label} is required`;
      }

      if (value === null && !validation.canBeNull) {
        console.log('null not allowed for field:', field);
        return `${validation.label} cannot be null`;
      }

      if (validation.mustBePositive && typeof value === 'number' && value < 0) {
        console.log('negative value for field:', field);
        return `${validation.label} must be a positive value`;
      }
    }
  }
  return null;
}

// Validate Ad Slots fields
// Chose not to include created-at/updated-at in this since users shouldn't be able to update that
const adSlotsFieldValidations: Record<string, FieldValidation> = {
  id: { canBeNull: false, mustBePositive: false, requiredInPost: false, label: 'ID' },
  name: { canBeNull: false, mustBePositive: false, requiredInPost: true, label: 'Name' },
  description: {
    canBeNull: true,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Description',
  },
  type: { canBeNull: false, mustBePositive: false, requiredInPost: true, label: 'Type' },
  position: { canBeNull: true, mustBePositive: false, requiredInPost: false, label: 'Position' },
  width: { canBeNull: true, mustBePositive: false, requiredInPost: false, label: 'Width' },
  height: {
    canBeNull: true,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Height',
  },
  basePrice: {
    canBeNull: false,
    mustBePositive: true,
    requiredInPost: true,
    label: 'Base price',
  },
  cpmFloor: {
    canBeNull: true,
    mustBePositive: true,
    requiredInPost: false,
    label: 'CPM floor',
  },
  isAvailable: {
    canBeNull: false,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Is available',
  },
  publisher: {
    canBeNull: false,
    mustBePositive: false,
    requiredInPost: true,
    label: 'Publisher',
  },
  placements: {
    canBeNull: false,
    mustBePositive: false,
    requiredInPost: false,
    label: 'Placements',
  },
};

export function validateAdSlotsFields(data: Record<string, unknown>): string | null | undefined {
  for (const [field, validation] of Object.entries(adSlotsFieldValidations)) {
    if (field in data) {
      const value = data[field];
      if (validation.requiredInPost && !value) {
        console.log('missing required field:', field);
        return `${validation.label} is required`;
      }

      if (value === null && !validation.canBeNull) {
        console.log('null not allowed for field:', field);
        return `${validation.label} cannot be null`;
      }

      if (validation.mustBePositive && typeof value === 'number' && value < 0) {
        console.log('negative value for field:', field);
        return `${validation.label} must be a positive value`;
      }

      if (field === 'type') {
        const validTypes = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];
        if (typeof value === 'string' && !validTypes.includes(value)) {
          console.log('invalid enum value for field:', field);
          return `${validation.label} must be one of: ${validTypes.join(', ')}`;
        }
      }
    }
  }
  return null;
}
