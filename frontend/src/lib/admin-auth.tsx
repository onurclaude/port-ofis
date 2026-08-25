"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "portofis_admin_session";

interface AdminSession {
  token: string;
  username: string;
  expiresAt: string;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  isReady: boolean;
  login: (session: AdminSession) => void;
  logout: (message?: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function readSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.token) return null;
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // localStorage is only available client-side; reading it here (rather
    // than during render) keeps the server-rendered and first-client-render
    // output identical (both `null`), avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(readSession());
    setIsReady(true);
  }, []);

  const login = useCallback((next: AdminSession) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(
    (message?: string) => {
      window.localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      const qs = message ? `?message=${encodeURIComponent(message)}` : "";
      router.replace(`/admin/login${qs}`);
    },
    [router],
  );

  const value = useMemo(() => ({ session, isReady, login, logout }), [session, isReady, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

/**
 * Wraps an admin API call: on ApiError with status 401, logs out and redirects
 * to /admin/login with the standard session-expired message, per
 * FRONTEND_SPEC §7.6. Rethrows all other errors for the caller to handle.
 */
export async function withAdminAuthGuard<T>(
  logout: (message?: string) => void,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof Error && err.name === "ApiError" && "status" in err && (err as { status: number }).status === 401) {
      logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
    }
    throw err;
  }
}
