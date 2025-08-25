import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validation/auth';

const AUTH_ROUTES = new Set<string>(['/login', '/signup', '/auth/callback']);

function sanitizeRedirect(input: unknown): string {
  const raw = typeof input === 'string' ? input : '';
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || AUTH_ROUTES.has(raw)) {
    return '/marketplace';
  }
  return raw;
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const formData = await req.formData();

  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    remember: String(formData.get('remember') ?? '') === 'on',
  });

  const redirectTo = sanitizeRedirect(formData.get('redirect'));
  const origin = new URL(req.url).origin;

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || 'Invalid credentials';
    const url = new URL('/login', origin);
    url.searchParams.set('error', first);
    url.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(url, { status: 303 });
  }

  const { email, password } = parsed.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const url = new URL('/login', origin);
    url.searchParams.set('error', error.message);
    url.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.redirect(new URL(redirectTo, origin), { status: 303 });
}


