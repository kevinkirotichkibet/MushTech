'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { safeNext } from '@/lib/redirect';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      router.replace(safeNext(window.location.search));
    } catch (err: any) { setError(err.message); }
    setBusy(false);
  }

  return (
    <section className="auth">
      <h1 className="page-title" style={{ padding: 0 }}>Create account</h1>
      <form className="summary" onSubmit={submit}>
        <div className="field"><label htmlFor="n">Full name</label><input id="n" required minLength={2} autoComplete="name" value={form.name} onChange={set('name')} /></div>
        <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" required autoComplete="email" spellCheck={false} value={form.email} onChange={set('email')} /></div>
        <div className="field"><label htmlFor="p">Password</label><input id="p" type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={form.password} onChange={set('password')} /><span className="hint">At least 8 characters.</span></div>
        <button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        {error && <p className="error" role="alert">{error}</p>}
      </form>
      <p className="auth-alt">Already registered? <Link href="/login">Log in</Link></p>
    </section>
  );
}
