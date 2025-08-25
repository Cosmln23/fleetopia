'use server';

import { redirect } from 'next/navigation';
import { createServerActionClient } from '@/lib/supabase/server';
import { isLikelyNetworkError } from '@/lib/supabase/client';
import { signupSchema } from '@/lib/validation/auth';

export type SignupActionState = {
  fieldErrors?: Partial<Record<'email' | 'password' | 'confirmPassword' | 'userType' | 'termsAccepted', string>>;
  formError?: string | null;
  success?: boolean;
};

export async function signupAction(prev: SignupActionState | undefined, formData: FormData): Promise<SignupActionState | void> {
  const parsed = signupSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
    userType: String(formData.get('userType') ?? ''),
    termsAccepted: String(formData.get('termsAccepted') ?? '') === 'on',
  });

  if (!parsed.success) {
    const fieldErrors: SignupActionState['fieldErrors'] = {};
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
    return { fieldErrors, formError: null };
  }

  const { email, password, userType } = parsed.data;
  const supabase = createServerActionClient();

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
          : undefined,
        data: { user_type: userType },
      },
    });

    if (error) {
      return { formError: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = isLikelyNetworkError(err) ? 'Network error. Please try again.' : 'Unexpected error.';
    return { formError: message };
  }
}


