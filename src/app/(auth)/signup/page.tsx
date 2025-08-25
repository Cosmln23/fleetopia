'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { GlassCard, Input, Button } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase/client';
import { signupSchema, type SignupInput } from '@/lib/validation/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" loading={pending} style={{ width: '100%' }}>
      Create account
    </Button>
  );
}

function PasswordStrength({ value }: { value: string }) {
  const rules = [/.{8,}/, /[A-Za-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  const score = rules.reduce((acc, r) => acc + (r.test(value) ? 1 : 0), 0);
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#ff8a8a', '#ffd27a', '#c2f07f', '#7de497'];
  const idx = Math.max(0, Math.min(score - 1, 3));
  return (
    <div aria-live="polite" style={{ fontSize: 12, color: colors[idx] }}>
      Password strength: {labels[idx]}
    </div>
  );
}

type UIState = {
  fieldErrors?: Partial<Record<'email' | 'password' | 'confirmPassword' | 'userType' | 'termsAccepted', string>>;
  formError?: string | null;
  success?: boolean;
};

export default function SignupPage() {
  const [state, setState] = React.useState<UIState | undefined>(undefined);
  const [password, setPassword] = React.useState('');

  if (state?.success) {
    return (
      <GlassCard className="glass-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>Check your email</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
            We sent a confirmation link to your email. Follow it to activate your account.
          </p>
          <a href="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Back to login</a>
        </div>
      </GlassCard>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const emailEntry = form.get('email');
    const passwordEntry = form.get('password');
    const confirmEntry = form.get('confirmPassword');
    const userTypeEntry = form.get('userType');
    const termsEntry = form.get('termsAccepted');
    const data: SignupInput = {
      email: typeof emailEntry === 'string' ? emailEntry : '',
      password: typeof passwordEntry === 'string' ? passwordEntry : '',
      confirmPassword: typeof confirmEntry === 'string' ? confirmEntry : '',
      userType: (typeof userTypeEntry === 'string' ? userTypeEntry : '') as SignupInput['userType'],
      termsAccepted: typeof termsEntry === 'string' ? termsEntry === 'on' : false,
    } as SignupInput;

    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: UIState['fieldErrors'] = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === 'email' ||
          key === 'password' ||
          key === 'confirmPassword' ||
          key === 'userType' ||
          key === 'termsAccepted'
        ) {
          fieldErrors[key] = issue.message;
        }
      }
      setState({ fieldErrors, formError: null });
      return;
    }

    try {
      const supabase = createBrowserClient();
      const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) as string;
      const emailRedirectTo: string = `${baseUrl}/auth/callback`;
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo,
          data: { user_type: parsed.data.userType },
        },
      });
      if (error) {
        setState({ formError: error.message });
        return;
      }
      setState({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error.';
      setState({ formError: message });
    }
  }

  return (
    <GlassCard className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>Create your account</h1>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            {...(state?.fieldErrors?.email ? { error: state.fieldErrors.email } : {})}
            required
          />
          <div>
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              {...(state?.fieldErrors?.password ? { error: state.fieldErrors.password } : {})}
              required
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordStrength value={password} />
          </div>
          <Input
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            {...(state?.fieldErrors?.confirmPassword ? { error: state.fieldErrors.confirmPassword } : {})}
            required
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}>
            <input type="radio" id="ut-shipper" name="userType" value="shipper" defaultChecked />
            <label htmlFor="ut-shipper">Shipper</label>
            <input type="radio" id="ut-carrier" name="userType" value="carrier" style={{ marginLeft: 12 }} />
            <label htmlFor="ut-carrier">Carrier</label>
          </div>
          {state?.fieldErrors?.userType ? (
            <div role="alert" style={{ color: '#ffb4b4' }}>{state.fieldErrors.userType}</div>
          ) : null}
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}>
            <input type="checkbox" name="termsAccepted" /> I agree to the <a href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms & Conditions</a>
          </label>
          {state?.fieldErrors?.termsAccepted ? (
            <div role="alert" style={{ color: '#ffb4b4' }}>{state.fieldErrors.termsAccepted}</div>
          ) : null}
          {state?.formError ? (
            <div role="alert" style={{ color: '#ffb4b4' }}>{state.formError}</div>
          ) : null}
          <SubmitButton />
        </form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a href="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Already have an account?</a>
        </div>
      </div>
    </GlassCard>
  );
}


