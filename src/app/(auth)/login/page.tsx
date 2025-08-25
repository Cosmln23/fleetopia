'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { GlassCard, Input, Button } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation/auth';

export default function LoginPage() {
  const search = useSearchParams();
  const redirect = search.get('redirect') ?? '/marketplace';
  const initialError = search.get('error') ?? undefined;
  const [loading, setLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<'email' | 'password', string>>>({});
  const [formError, setFormError] = React.useState<string | null>(initialError ?? null);

  const AUTH_ROUTES = new Set<string>(['/login', '/signup', '/auth/callback']);
  function sanitizeRedirect(input: string | null): string {
    const raw = input || '/marketplace';
    if (!raw.startsWith('/') || raw.startsWith('//') || AUTH_ROUTES.has(raw)) return '/marketplace';
    return raw;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const form = new FormData(e.currentTarget);
    const emailEntry = form.get('email');
    const passwordEntry = form.get('password');
    const rememberEntry = form.get('remember');
    const email = typeof emailEntry === 'string' ? emailEntry : '';
    const password = typeof passwordEntry === 'string' ? passwordEntry : '';
    const remember = typeof rememberEntry === 'string' ? rememberEntry === 'on' : false;

    const parsed = loginSchema.safeParse({ email, password, remember });
    if (!parsed.success) {
      const errs: Partial<Record<'email' | 'password', string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === 'email' || key === 'password') errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    void (async () => {
      try {
        setLoading(true);
        document.cookie = `ft_remember_me=${remember ? '1' : '0'}; path=/`;
        const supabase = createBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setFormError(error.message);
          setLoading(false);
          return;
        }
        window.location.assign(sanitizeRedirect(redirect));
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Unexpected error.');
        setLoading(false);
      }
    })();
  }

  return (
    <GlassCard className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>Welcome back</h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>Sign in to your account</p>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="hidden" name="redirect" value={redirect} />
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            {...(fieldErrors.email ? { error: fieldErrors.email } : {})}
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            {...(fieldErrors.password ? { error: fieldErrors.password } : {})}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}>
              <input
                type="checkbox"
                name="remember"
                onChange={(e) => {
                  // Set a hint cookie for server cookie adapter to set maxAge
                  if (typeof document !== 'undefined') {
                    document.cookie = `ft_remember_me=${e.currentTarget.checked ? '1' : '0'}; path=/`;
                  }
                }}
              />{' '}
              Remember me
            </label>
            <a href="/signup" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Create account</a>
          </div>
          {formError ? (
            <div role="alert" style={{ color: '#ffb4b4' }}>{formError}</div>
          ) : null}
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
            Sign in
          </Button>
        </form>
      </div>
    </GlassCard>
  );
}


