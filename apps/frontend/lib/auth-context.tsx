'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { authClient } from '@/auth-client';
import { getUserRole } from '@/lib/auth-helpers';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const { data } = await authClient.getSession();
      const sessionUser = data?.user as User | undefined;

      if (sessionUser) {
        setUser(sessionUser);
        try {
          const roleData = await getUserRole(sessionUser.id);
          setRole(roleData.role ?? null);
        } catch (err) {
          console.error('Error fetching role:', err);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Error getting session:', err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();

    // Poll for auth changes every 1 second
    const interval = setInterval(refreshAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
