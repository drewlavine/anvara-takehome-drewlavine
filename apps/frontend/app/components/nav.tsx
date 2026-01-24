import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import LogoutButton from './logout-button';

export async function Nav() {
  let role,
    user = null;
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    user = session?.user || null;

    const roleData = await getUserRole(user?.id || '');
    role = roleData.role;
  } catch (error) {
    console.error('Error fetching user role in Nav:', error);
  }

  // TODO: Add active link styling using usePathname() from next/navigation
  // The current page's link should be highlighted differently

  return (
    <header className="border-b border-[var(--color-border)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/marketplace"
            className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            Marketplace
          </Link>

          {user && role === 'sponsor' && (
            <Link
              href="/dashboard/sponsor"
              className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              My Campaigns
            </Link>
          )}
          {user && role === 'publisher' && (
            <Link
              href="/dashboard/publisher"
              className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
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
              className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm text-white hover:bg-[var(--color-primary-hover)]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
