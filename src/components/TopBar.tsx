'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Bell, CircleUser, X, Truck, CheckCircle, DollarSign, AlertTriangle } from 'lucide-react'

export default function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const isInsideDropdown = target.closest('[data-dropdown]')
      const isInsideDropdownContent = target.closest('.dropdown-content')
      
      if (!isInsideDropdown && !isInsideDropdownContent) {
        setIsNotificationsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-50 backdrop-blur border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-white/20 bg-black/60 shadow-lg shadow-black/30' 
        : 'border-white/10 bg-black/40'
    }`}>
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
            <div className="relative" data-dropdown>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition text-sm"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden lg:inline">Notificări</span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="dropdown-content absolute top-full right-0 mt-2 w-80 bg-black/95 rounded-lg shadow-2xl border border-white/10 overflow-hidden z-[70] backdrop-blur-md">
                  <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2 mr-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60"></div>
                      </div>
                      <div className="text-white/80 text-sm">notifications.json</div>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto bg-black/60">
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="text-white/40 text-sm mb-2">Nu există notificări</div>
                        <div className="text-white/30 text-xs">Notificările vor apărea aici</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-white/10 bg-black/60">
                    <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                      Vezi toate notificările
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
              >
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