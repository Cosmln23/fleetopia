'use client'

import TopBar from '@/components/TopBar'
import Link from 'next/link'
import { User, Bell, Shield, CreditCard, Download, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 11, 15, 0.85), rgba(11, 11, 15, 0.85)), url('/imagine.jpg')`
      }}
    >
      <TopBar />

      {/* SETTINGS */}
      <main className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight">Setări</h1>
          <p className="mt-2 text-base text-white/60">Gestionează contul, preferințele și securitatea.</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Settings */}
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:bg-black/50 transition">
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
                    <span className="px-2 py-1 rounded-md bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 text-xs">Pro</span>
                  </div>
                </div>

                <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                  Editează profilul
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:bg-black/50 transition">
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
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Push notificări</span>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">SMS alerte</span>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <button className="mt-4 w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                  Configurează avansate
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:bg-black/50 transition">
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
                    <span className="px-2 py-1 rounded-md bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-xs">Activ</span>
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

          {/* Billing */}
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:bg-black/50 transition">
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

          {/* Data Export */}
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:bg-black/50 transition">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-400/10 flex items-center justify-center ring-1 ring-purple-400/30">
                <Download className="h-6 w-6 text-purple-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium tracking-tight">Export Date</h3>
                <p className="mt-1 text-sm text-white/60">Descarcă informațiile tale</p>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-white/70">Exportă toate datele din cont într-un format JSON sau CSV.</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    JSON
                  </button>
                  <button className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                    CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/30">
                <Trash2 className="h-6 w-6 text-red-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium tracking-tight text-red-200">Zona Periculoasă</h3>
                <p className="mt-1 text-sm text-red-300/70">Acțiuni ireversibile</p>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-red-300/70">Ștergerea contului va elimina permanent toate datele.</p>
                </div>

                <button className="mt-4 w-full h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 transition text-sm">
                  Șterge contul
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Backend Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-medium tracking-tight mb-4">🔧 Backend Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-emerald-300">API Endpoints Ready:</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• GET /api/settings/general</li>
                <li>• PUT /api/settings/general</li>
                <li>• GET /api/settings/account</li>
                <li>• PUT /api/settings/account/profile</li>
                <li>• GET /api/settings/notifications</li>
                <li>• POST /api/settings/subscription/upgrade</li>
                <li>• POST /api/settings/data/export</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-cyan-300">Features:</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• User profile management</li>
                <li>• Notification preferences</li>
                <li>• Stripe billing integration</li>
                <li>• GDPR data export/deletion</li>
                <li>• Security settings</li>
                <li>• Two-factor authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-md bg-white/70"></div>
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
  )
}