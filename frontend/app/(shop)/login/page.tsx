'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { safeNext } from '@/lib/redirect';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await login(email, password);
      router.replace(safeNext(window.location.search));
    } catch (err: any) { setError(err.message); }
    setBusy(false);
  }

  return (
    <section className="auth">
      <p className="kicker"><b>Karibu</b> means welcome</p>
      <h1 className="page-title" style={{ padding: 0 }}>Log in</h1>
      <form className="summary" onSubmit={submit}>
        <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="field"><label htmlFor="p">Password</label><input id="p" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        {error && <p className="error" role="alert">{error}</p>}
      </form>
      <p className="auth-alt">New here? <Link href="/register">Create an account</Link></p>
    </section>
  );
}
