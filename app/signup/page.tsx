'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to create your account.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">L</span>
          <span className="text-xl font-bold text-slate-900">Learniee</span>
        </Link>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Create a Learniee parent account to discover courses.</p>

          {error && (
            <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 space-y-4">
            {([
              ['name', 'Name', 'text', 'Your name', 'name'],
              ['email', 'Email', 'email', 'you@example.com', 'email'],
              ['password', 'Password', 'password', 'At least 6 characters', 'new-password'],
              ['confirmPassword', 'Confirm password', 'password', 'Re-enter your password', 'new-password'],
            ] as const).map(([field, label, type, placeholder, autoComplete]) => (
              <label key={field} className="block text-sm font-medium text-slate-700">
                {label}
                <input
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => updateField(field, e.target.value)}
                  autoComplete={autoComplete}
                  minLength={type === 'password' ? 6 : undefined}
                  required
                />
              </label>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Log in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
