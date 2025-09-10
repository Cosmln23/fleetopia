'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, MessageSquare, Bell, CircleUser, X } from 'lucide-react'

export default function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link 
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-white/90 to-white/60 shadow-sm ring-1 ring-white/20"></div>
            <span className="text-lg sm:text-xl font-medium tracking-tight">Fletopia</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/"
              className="text-sm text-white/70 hover:text-white transition"
            >
              Acasă
            </Link>
            <Link 
              href="/marketplace"
              className="text-sm text-white/70 hover:text-white transition"
            >
              Piața
            </Link>
            <Link 
              href="/settings"
              className="text-sm text-white/70 hover:text-white transition"
            >
              Setări
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition text-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Mesaje</span>
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-emerald-500 text-[10px] font-medium text-black flex items-center justify-center">2</span>
            </button>
            <button className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition text-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden lg:inline">Notificări</span>
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-cyan-400 text-[10px] font-medium text-black flex items-center justify-center">4</span>
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition text-sm">
              <CircleUser className="h-5 w-5" />
              <span className="hidden lg:inline">Profil</span>
              <span className="text-white/50 hidden xl:inline">· Clerk</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="grid gap-2">
              <Link 
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-left"
              >
                Acasă
              </Link>
              <Link 
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-left"
              >
                Piața
              </Link>
              <Link 
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-left"
              >
                Setări
              </Link>
            </nav>
            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                <MessageSquare className="h-4 w-4" /> Mesaje
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                <Bell className="h-4 w-4" /> Notificări
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm">
                <CircleUser className="h-4 w-4" /> Profil
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}