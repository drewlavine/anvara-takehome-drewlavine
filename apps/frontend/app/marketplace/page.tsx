import { AdSlotGrid } from './components/ad-slot-grid';

// FIXME: This page fetches all ad slots client-side. Consider:
// 1. Server-side pagination with searchParams
// 2. Filtering by category, price range, slot type
// 3. Search functionality

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[var(--color-muted)]">Browse available ad slots from our publishers</p>
        <div className="mt-4">
          <form className="flex flex-col justify-between sm:flex-row sm:items-end gap-3">
            <div className="flex flex-col sm:w-150">
              <label htmlFor="marketplace-search" className="mb-1 text-xs font-medium text-[var(--color-muted)]">Search</label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                </svg>
                <input
                  id="marketplace-search"
                  type="text"
                  placeholder="Search publishers, slots, keywords..."
                  className="w-full rounded-md border text-[var(--color-foreground)] border-[var(--color-border)] bg-white py-2 pl-10 pr-3 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col">
                <label htmlFor="filter-type" className="mb-1 text-xs font-medium text-[var(--color-muted)]">Filter</label>
                <select id="filter-type" className="rounded-md border border-[var(--color-border)] bg-white py-2 px-3 text-sm text-(--color-background)">
                  <option value="">All types</option>
                  <option value="DISPLAY">Display</option>
                  <option value="VIDEO">Video</option>
                  <option value="NEWSLETTER">Newsletter</option>
                  <option value="PODCAST">Podcast</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="sort-by" className="mb-1 text-xs font-medium text-[var(--color-muted)]">Sort</label>
                <select id="sort-by" className="rounded-md border border-[var(--color-border)] bg-white py-2 px-3 text-sm text-(--color-background)">
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AdSlotGrid />
    </div>
  );
}
