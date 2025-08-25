import { createClient, type SupabaseClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import type { Database } from '@/lib/supabase/types';

let browserClient: SupabaseClient<Database> | null = null;

/**
 * createBrowserClient
 * - Singleton Supabase client for browser usage (Client Components)
 * - Validated env via env.ts (throws early if misconfigured)
 * - Optimized auth persistence and realtime tuning for UI interactivity
 *
 * Usage (Client Component):
 * ```tsx
 * 'use client'
 * import { createBrowserClient, onAuthStateChanged, subscribeToDealChat } from '@/lib/supabase/client'
 *
 * const supabase = createBrowserClient()
 *
 * // Listen auth changes
 * const unsubscribeAuth = onAuthStateChanged((_event, _session) => {
 * 	// trigger UI updates (e.g., router.refresh())
 * })
 *
 * // Realtime chat
 * const unsubscribeChat = subscribeToDealChat(dealId, (msg) => {
 * 	// append message to UI
 * })
 * ```
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  browserClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Use localStorage for remember-me, else sessionStorage
        storage: typeof window !== 'undefined'
          ? (document.cookie.includes('ft_remember_me=1') ? window.localStorage : window.sessionStorage)
          : undefined,
      },
      realtime: {
        // Slightly throttle event rate to avoid UI jank in heavy channels
        params: { eventsPerSecond: 10 },
      },
      global: {
        headers: { 'X-Client-Context': 'browser' },
      },
    }
  );

  return browserClient;
}

export type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row'];

/**
 * Subscribe to chat messages for a given deal.
 * Returns an unsubscribe function.
 */
export function subscribeToDealChat(
  dealId: string,
  onInsert: (message: ChatMessageRow) => void
): () => void {
  const supabase = createBrowserClient();

  const channel = supabase
    .channel(`chat_messages:deal:${dealId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `deal_id=eq.${dealId}` },
      (payload) => {
        onInsert(payload.new as ChatMessageRow);
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

/**
 * Listen to auth state changes and return an unsubscribe function.
 */
export function onAuthStateChanged(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const supabase = createBrowserClient();
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
}

/**
 * Utilities
 */
export function isLikelyNetworkError(err: unknown): boolean {
  return err instanceof TypeError && /NetworkError|Failed to fetch|Load failed/i.test(err.message);
}



