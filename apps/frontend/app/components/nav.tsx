'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './logout-button';
import { useAuth } from '@/lib/auth-context';

export function Nav() {
  const { user, role } = useAuth();
  const pathname = usePathname();

  function isActivePath(path: string): boolean {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/') || pathname.startsWith(path);
  }

  return (
    <header className="sticky top-0 z-50 bg-(--color-background)/95 backdrop-blur-sm border-b border-[var(--color-border)]  shadow-(--header-shadow)">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/marketplace"
            className={
              isActivePath('/marketplace')
                ? 'text-[var(--color-foreground)] font-semibold'
                : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
            }
          >
            Marketplace
          </Link>

          {user && role === 'sponsor' && (
            <Link
              href="/dashboard/sponsor"
              className={
                isActivePath('/dashboard/sponsor')
                  ? 'text-[var(--color-foreground)] font-semibold'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }
            >
              My Campaigns
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link
              href="/dashboard/publisher"
              className={
                isActivePath('/dashboard/publisher')
                  ? 'text-[var(--color-foreground)] font-semibold'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }
            >
              My Ad Slots
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-muted)]">
                {user.name} {role && `(${role})`}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className={
                isActivePath('/login')
                  ? 'text-[var(--color-foreground)] font-semibold rounded bg-[var(--color-primary)] px-4 py-2 text-sm text-white'
                  : 'rounded bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:bg-[var(--color-primary-hover)]'
              }
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
