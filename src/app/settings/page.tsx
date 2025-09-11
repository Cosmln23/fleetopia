'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import SettingsCard from '@/components/SettingsCard';
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
          "linear-gradient(rgba(11, 11, 15, 0.3), rgba(11, 11, 15, 0.7)), url('/wallpaper.jpg')",
        filter: 'contrast(1.2) brightness(1.1)'
      }}
    >
      <TopBar />

      <main className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 pt-16 scroll-blur-content">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Setări</h1>
          <p className="mt-2 text-base text-white/60">Gestionează contul, preferințele și securitatea.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SettingsCard
            fileName="account-settings.json"
            Icon={User}
            iconBgClass="bg-emerald-400/10 ring-1 ring-emerald-400/30"
            title="Cont"
            description="Profil, echipă și informații personale"
          >
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
          </SettingsCard>

          <SettingsCard
            fileName="notifications.json"
            Icon={Bell}
            iconBgClass="bg-yellow-400/10 ring-1 ring-yellow-400/30"
            title="Notificări"
            description="Preferințe alerte și comunicare"
          >
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
          </SettingsCard>

          <SettingsCard
            fileName="security.json"
            Icon={Shield}
            iconBgClass="bg-red-400/10 ring-1 ring-red-400/30"
            title="Securitate"
            description="Autentificare și permisiuni"
          >
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
          </SettingsCard>

          <SettingsCard
            fileName="billing.json"
            Icon={CreditCard}
            iconBgClass="bg-blue-400/10 ring-1 ring-blue-400/30"
            title="Facturare"
            description="Abonamente și plăți"
          >
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
          </SettingsCard>

          <SettingsCard
            fileName="data-export.json"
            Icon={Download}
            iconBgClass="bg-purple-400/10 ring-1 ring-purple-400/30"
            title="Export Date"
            description="Descarcă informațiile tale"
          >
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
          </SettingsCard>

          <SettingsCard
            fileName="danger-zone.json"
            Icon={Trash2}
            iconBgClass="bg-red-400/10 ring-1 ring-red-400/30"
            title="Zona Periculoasă"
            description="Acțiuni ireversibile"
            titleColor="text-red-200"
            descriptionColor="text-red-300/70"
          >
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
          </SettingsCard>
        </div>
      </main>

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