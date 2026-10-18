'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';

// Loads admin data with the logged-in token; a 401 sends the user back to log in.
export function useAdminData<T>(fetcher: (token: string) => Promise<T>) {
  const { token, logout } = useAuth();
  const router = useRouter();
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try { setData(await fetchRef.current(token)); setError(''); }
    catch (e: any) {
      if (e.status === 401) { logout(); router.replace('/login?next=/admin'); }
      else setError(e.message || 'Something went wrong');
    }
    setLoading(false);
  }, [token, logout, router]);

  useEffect(() => { reload(); }, [reload]);
  return { data, setData, error, setError, loading, reload, token };
}
