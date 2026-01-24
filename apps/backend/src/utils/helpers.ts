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
