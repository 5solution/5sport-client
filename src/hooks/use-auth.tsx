"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  /** Call after a successful email/password login */
  loginWithToken: (token: string, user: AuthUser) => void;
  /** Unified logout — clears both NextAuth session and local state */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedToken && storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
        setLocalToken(storedToken);
      } catch {
        // corrupt data — clear it
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setHydrated(true);
  }, []);

  // Sync NextAuth session → local state (Google login)
  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, session.accessToken);
      setLocalToken(session.accessToken);
    }
    if (session?.backendUser) {
      const u = session.backendUser as AuthUser;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
      setLocalUser(u);
    }
  }, [session?.accessToken, session?.backendUser]);

  const loginWithToken = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setLocalToken(token);
    setLocalUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setLocalToken(null);
    setLocalUser(null);
    // Also clear NextAuth session if present
    nextAuthSignOut({ redirect: false });
  }, []);

  const isLoading = !hydrated || status === "loading";

  const value = useMemo<AuthContextValue>(
    () => ({ user: localUser, token: localToken, isLoading, loginWithToken, logout }),
    [localUser, localToken, isLoading, loginWithToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
