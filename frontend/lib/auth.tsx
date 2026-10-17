'use client';
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import * as api from './api';
import type { User } from './api';

type Session = { token: string; user: User };
type Ctx = {
  user: User | null; token: string | null; ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};
const AuthCtx = createContext<Ctx>(null!);
export const useAuth = () => useContext(AuthCtx);
const KEY = 'mushtech-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  const save = useCallback((s: Session | null) => {
    if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY);
    setSession(s);
  }, []);

  // Restore the session and confirm the token is still valid.
  useEffect(() => {
    (async () => {
      let stored: Session | null = null;
      try { stored = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
      if (stored?.token) {
        try {
          const user = await api.me(stored.token);
          setSession({ token: stored.token, user });
        } catch (e) {
          // only drop the session when the server says the token is bad (not when it is asleep)
          if (e instanceof api.ApiError && e.status === 401) localStorage.removeItem(KEY);
          else setSession(stored);
        }
      }
      setReady(true);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.login({ email, password });
    save({ token: r.accessToken, user: r.user });
  };
  const register = async (name: string, email: string, password: string) => {
    const r = await api.register({ name, email, password });
    save({ token: r.accessToken, user: r.user });
  };
  const logout = useCallback(() => save(null), [save]);

  return (
    <AuthCtx.Provider value={{ user: session?.user ?? null, token: session?.token ?? null, ready, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
