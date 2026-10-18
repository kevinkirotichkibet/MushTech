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

  // Restore the saved session immediately, then confirm in the background that the token is still valid.
  // (A sleeping API on a free host can take a minute to answer, so the page must not wait for it.)
  useEffect(() => {
    let stored: Session | null = null;
    try { stored = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch {}
    if (stored?.token) {
      const token = stored.token;
      setSession(stored);
      api.me(token)
        .then((user) => save({ token, user }))
        .catch((e) => { if (e instanceof api.ApiError && e.status === 401) save(null); });
    }
    setReady(true);
  }, [save]);

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
