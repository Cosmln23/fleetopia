import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  // Clear remember-me hint and client storage via header hint
  res.cookies.set({ name: 'ft_remember_me', value: '0', path: '/', maxAge: 0 });
  res.headers.set('x-clear-client-storage', '1');
  return res;
}


