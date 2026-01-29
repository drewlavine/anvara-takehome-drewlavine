import type { Metadata } from 'next';
import './globals.css';
import * as React from 'react';
import { Nav } from './components/nav';
import { NavErrorBoundary } from './components/nav-error-boundary';
import { FormProvider } from '@/lib/form-context';

// TODO: Consider adding a loading.tsx for Suspense boundaries
// TODO: Add Open Graph metadata for social media sharing
// TODO: Add Twitter Card metadata
// TODO: Consider adding favicon and app icons

export const metadata: Metadata = {
  title: 'Anvara Marketplace',
  description: 'Sponsorship marketplace connecting sponsors with publishers',
  // Missing: openGraph, twitter, icons, viewport, etc.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // HINT: If using React Query, you would wrap children with QueryClientProvider here
  // See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <FormProvider>
          <NavErrorBoundary>
            <Nav />
          </NavErrorBoundary>
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </FormProvider>
      </body>
    </html>
  );
}
