'use client';

import React from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function AuthExchangeFallback() {
  React.useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (!code) return;
        const supabase = createBrowserClient();
        // Attempt exchange on client as a safety net
        try {
          await supabase.auth.exchangeCodeForSession({ authCode: code });
        } catch {
          // ignore
        }
        // Clean URL params
        url.searchParams.delete('code');
        url.searchParams.delete('access_token');
        url.searchParams.delete('type');
        const nextUrl = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '');
        window.history.replaceState({}, '', nextUrl);
      } catch {
        // no-op
      }
    };
    void run();
  }, []);
  return null;
}


