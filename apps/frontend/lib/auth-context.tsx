'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authClient } from '@/auth-client';
import { getUserRole } from '@/lib/auth-helpers';

interface AuthContextType {
  user: User | null;
  role: string | null;
  sponsorId: string | null;
  publisherId: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
  setSponsorId: (id: string | null) => void;
  setPublisherId: (id: string | null) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sponsorId, setSponsorId] = useState<string | null>(null);
  const [publisherId, setPublisherId] = useState<string | null>(null);
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
          setSponsorId(roleData.sponsorId ?? null);
          setPublisherId(roleData.publisherId ?? null);
        } catch (err) {
          setRole(null);
          setSponsorId(null);
          setPublisherId(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setSponsorId(null);
        setPublisherId(null);
      }
    } catch (err) {
      setUser(null);
      setRole(null);
      setSponsorId(null);
      setPublisherId(null);
    } finally {
      setLoading(false);
    }
  };

  // Only check auth status on mount
  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        sponsorId,
        publisherId,
        loading,
        setUser,
        setRole,
        setSponsorId,
        setPublisherId,
        refreshAuth,
      }}
    >
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
