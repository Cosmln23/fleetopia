import { createServerClient as createSSRClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import type { Database } from '@/lib/supabase/types';

type TypedClient = SupabaseClient<Database>;

const secureCookie = (env.NEXT_PUBLIC_APP_ENV === 'production');

/**
 * createServerClient
 * - For Server Components (RSC) and standard SSR usage.
 * - Uses Next.js App Router cookies() API to manage auth session.
 */
export function createServerClient(): TypedClient {
  const client = createSSRClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
      cookies: {
        getAll() {
          const store = cookies();
          return store.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet: { name: string; value: string; options?: { domain?: string; path?: string; sameSite?: boolean | 'lax' | 'strict' | 'none'; secure?: boolean; httpOnly?: boolean; maxAge?: number; expires?: Date } }[]) {
          const store = cookies();
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set({
              name,
              value,
              httpOnly: true,
              sameSite: 'lax',
              secure: secureCookie,
              path: '/',
              ...options,
            });
          });
        },
      },
      global: { headers: { 'X-Client-Context': 'server' } },
    }
  );
  return client;
}

/**
 * createServerActionClient
 * - For Server Actions. Same cookie strategy, isolated factory for clarity.
 */
export function createServerActionClient(): TypedClient {
  return createServerClient();
}

/**
 * createMiddlewareClient
 * - For Next.js Middleware (edge). Mutates response cookies for session persistence.
 */
export function createMiddlewareClient(req: NextRequest, res: NextResponse): TypedClient {
  const client = createSSRClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
      cookies: {
        getAll() {
          return req.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet: { name: string; value: string; options?: { domain?: string; path?: string; sameSite?: boolean | 'lax' | 'strict' | 'none'; secure?: boolean; httpOnly?: boolean; maxAge?: number; expires?: Date } }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({
              name,
              value,
              httpOnly: true,
              sameSite: 'lax',
              secure: secureCookie,
              path: '/',
              ...options,
            });
          });
        },
      },
      global: { headers: { 'X-Client-Context': 'middleware' } },
    }
  );
  return client;
}

/**
 * Helper: fetch current user on server, RLS-aware.
 */
export async function getServerUser() {
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { user: null, error } as const;
  return { user: data.user, error: null } as const;
}



