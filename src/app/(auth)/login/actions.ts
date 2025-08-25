'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validation/auth';

function isLikelyNetworkError(err: unknown): boolean {
  return err instanceof TypeError && /NetworkError|Failed to fetch|Load failed/i.test(err.message);
}

export type LoginActionState = {
  fieldErrors?: Partial<Record<'email' | 'password', string>>;
  formError?: string | null;
};

export async function loginAction(prev: LoginActionState | undefined, formData: FormData): Promise<LoginActionState | void> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    remember: String(formData.get('remember') ?? '') === 'on',
  });

  if (!parsed.success) {
    const fieldErrors: LoginActionState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === 'email' || key === 'password') fieldErrors[key] = issue.message;
    }
    return { fieldErrors, formError: null };
  }

  const { email, password, remember } = parsed.data;
  const supabase = createServerActionClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { formError: error.message, fieldErrors: undefined };
    }

    // Redirect to intended destination if provided
    const destination = String(formData.get('redirect') ?? '/marketplace');
    // Set a hint cookie for remember-me (read by cookie adapter to set maxAge)
    const store = await cookies();
    store.set({ name: 'ft_remember_me', value: remember ? '1' : '0', path: '/', httpOnly: false });
    redirect(destination);
  } catch (err) {
    const message = isLikelyNetworkError(err)
      ? 'Network error. Please try again.'
      : err instanceof Error
        ? err.message
        : 'Unexpected error.';
    return { formError: message };
  }
}


