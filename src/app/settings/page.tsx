'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { User, Bell, Shield, CreditCard, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      const content = document.querySelector('.scroll-blur-content');
      if (content) {
        if (window.scrollY > 100) {
          content.classList.add('scrolling');
        } else {
          content.classList.remove('scrolling');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={'min-h-screen bg-cover bg-center bg-fixed scroll-blur-container' + (isScrolled ? ' scrolled' : '')}
      style={{
        backgroundImage:
          "linear-gradient(rgba(11, 11, 15, 0.85), rgba(11, 11, 15, 0.85)), url('/imagine.jpg')",
      }}
    >
      <TopBar />

      {/* SETTINGS */}
      <main className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 pt-16 scroll-blur-content">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Setări</h1>
          <p className="mt-2 text-base text-white/60">Gestionează contul, preferințele și securitatea.</p>
        </div>

        {/* Settings Grid (6 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Account Settings */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
            {/* Header cu punctele colorate */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-xs">account-settings.json</div>
            </div>

            {/* Content */}
            <div className="p-6 bg-black/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-emerald-400/10 flex items-center justify-center ring-1 ring-emerald-400/30">
                  <User className="h-6 w-6 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight">Cont</h3>
                  <p className="mt-1 text-sm text-white/60">Profil, echipă și informații personale</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Nume complet</span>
                      <span className="text-sm">Alexandru Vasile</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Email</span>
                      <span className="text-sm">alex@company.ro</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/70">Plan</span>
                      <span className="px-2 py-1 rounded-md bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 text-xs">
                        Pro
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    Editează profilul
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
            {/* Header cu punctele colorate */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-xs">notifications.json</div>
            </div>

            {/* Content */}
            <div className="p-6 bg-black/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-400/10 flex items-center justify-center ring-1 ring-yellow-400/30">
                  <Bell className="h-6 w-6 text-yellow-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight">Notificări</h3>
                  <p className="mt-1 text-sm text-white/60">Preferințe alerte și comunicare</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Email notificări</span>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-white/10 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Push notificări</span>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-white/10 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">SMS alerte</span>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-white/10 rounded-full peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>
                  </div>

                  <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    Configurează avansate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
            {/* Header cu punctele colorate */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-xs">security.json</div>
            </div>

            {/* Content */}
            <div className="p-6 bg-black/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-400/10 flex items-center justify-center ring-1 ring-red-400/30">
                  <Shield className="h-6 w-6 text-red-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight">Securitate</h3>
                  <p className="mt-1 text-sm text-white/60">Autentificare și permisiuni</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">2FA</span>
                      <span className="px-2 py-1 rounded-md bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-xs">
                        Activ
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Ultima conectare</span>
                      <span className="text-xs text-white/50">Azi, 14:30</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/70">Sesiuni active</span>
                      <span className="text-sm">3 dispozitive</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    Schimbă parola
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
            {/* Header cu punctele colorate */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-xs">billing.json</div>
            </div>

            {/* Content */}
            <div className="p-6 bg-black/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-400/10 flex items-center justify-center ring-1 ring-blue-400/30">
                  <CreditCard className="h-6 w-6 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight">Facturare</h3>
                  <p className="mt-1 text-sm text-white/60">Abonamente și plăți</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Plan curent</span>
                      <span className="text-sm">Pro Monthly</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Următoarea plată</span>
                      <span className="text-sm">€29/lună</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/70">Data expirării</span>
                      <span className="text-xs text-white/50">15 Oct 2025</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    Gestionează abonamentul
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Export */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
            {/* Header cu punctele colorate */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-xs">data-export.json</div>
            </div>

            {/* Content */}
            <div className="p-6 bg-black/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-400/10 flex items-center justify-center ring-1 ring-purple-400/30">
                  <Download className="h-6 w-6 text-purple-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight">Export Date</h3>
                  <p className="mt-1 text-sm text-white/60">Descarcă informațiile tale</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Format disponibil</span>
                      <span className="text-sm">JSON, CSV</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Dimensiune estimată</span>
                      <span className="text-sm">~2.5 MB</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/70">Disponibilitate</span>
                      <span className="text-xs text-white/50">24/7</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    Descarcă datele
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone (neutral card frame; accent doar pe icon/texte interne) */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
            {/* Header cu punctele colorate */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-xs">danger-zone.json</div>
            </div>

            {/* Content */}
            <div className="p-6 bg-black/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-400/10 flex items-center justify-center ring-1 ring-red-400/30">
                  <Trash2 className="h-6 w-6 text-red-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight text-red-200">Zona Periculoasă</h3>
                  <p className="mt-1 text-sm text-red-300/70">Acțiuni ireversibile</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Șterge toate datele</span>
                      <span className="text-sm">Permanent</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">Timp de anulare</span>
                      <span className="text-sm">0 zile</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/70">Backup disponibil</span>
                      <span className="text-xs text-white/50">Nu</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 transition text-sm">
                    Șterge contul
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>  {/* end of settings grid */}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-md bg-white/70" />
            <span className="text-white/70 text-sm">© 2025 Fletopia</span>
          </div>
          <div className="text-white/50 text-sm">
            <Link href="/" className="hover:text-white transition">Acasă</Link> ·
            <Link href="/marketplace" className="hover:text-white transition"> Piața</Link> ·
            <Link href="/settings" className="hover:text-white transition"> Setări</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}