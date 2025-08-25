"use client";
import React from "react";
import styles from "./TopNavbar.module.css";
import { createBrowserClient, onAuthStateChanged } from "@/lib/supabase/client";

export type TopNavbarProps = {
  brand?: string;
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ brand = "Fleetopia" }) => {
  const [open, setOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const supabase = createBrowserClient();
    // Initial session check
    supabase.auth.getSession().then(({ data }) => setIsAuthenticated(!!data.session?.user));
    // Live updates
    const unsubscribe = onAuthStateChanged((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
      unsubscribe();
    };
  }, []);

  return (
    <header className={`${styles.container} glass-border fade-in`}>
      <div className="max-w-6xl flex mr-auto ml-auto pt-4 pr-6 pb-4 pl-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{brand}</span>
        </div>
        <nav className="flex items-center gap-8 text-sm text-gray-400">
          <a href="#messages" className="hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="message-circle" className="lucide lucide-message-circle w-4 h-4" style={{ strokeWidth: 1.5 }}><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path></svg>
          </a>
          <a href="#notifications" className="hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="bell" className="lucide lucide-bell w-4 h-4" style={{ strokeWidth: 1.5 }}><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>
          </a>
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-lucide="user" className="lucide lucide-user w-4 h-4" style={{ strokeWidth: 1.5 }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </button>
              {open ? (
                <div role="menu" className="absolute right-0 mt-2 min-w-[180px] glass-border rounded-lg p-2 text-sm bg-[var(--glass-bg)]">
                  <a href="/settings" role="menuitem" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded">Setări</a>
                  <a href="/faq" role="menuitem" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded">Ajutor și FAQ</a>
                  <form
                    action="/api/auth/signout"
                    method="post"
                    onSubmit={() => {
                      try {
                        if (typeof window !== 'undefined') {
                          window.localStorage.clear();
                          window.sessionStorage.clear();
                          document.cookie = 'ft_remember_me=0; Max-Age=0; path=/';
                        }
                      } catch {}
                    }}
                  >
                    <button type="submit" className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded">Deconectare</button>
                  </form>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <a href="/login" className="hover:text-white transition-colors">Login</a>
              <a href="/signup" className="hover:text-white transition-colors">Signup</a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};


