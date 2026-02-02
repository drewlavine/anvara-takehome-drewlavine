'use client';

import { authClient } from '@/auth-client';
import { useAuth } from '@/lib/auth-context';

export default function LogoutButton() {
  const { setUser, setRole, setSponsorId, setPublisherId } = useAuth();

  return (
    <button
      onClick={async () => {
        // Clear auth context before signing out
        setUser(null);
        setRole(null);
        setSponsorId(null);
        setPublisherId(null);

        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = '/';
            },
          },
        });
      }}
      className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500"
    >
      Logout
    </button>
  );
}
