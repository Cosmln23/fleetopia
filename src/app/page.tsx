'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import HeroSection from '@/components/HeroSection'
import QuickActions from '@/components/QuickActions'
import CodePreview from '@/components/CodePreview'
import HowItWorks from '@/components/HowItWorks'
import TestimonialSlider from '@/components/TestimonialSlider'
import Link from 'next/link'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 11, 15, 0.85), rgba(11, 11, 15, 0.85)), url('/imagine.jpg')`
      }}
    >
      <TopBar />
      
      {/* HOME */}
      <main id="home" className="scroll-mt-20">
        <HeroSection 
          onAddCargo={openModal}
          onFindLoads={() => window.location.href = '/marketplace'}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <QuickActions 
            onPostFast={openModal}
            onFindLoads={() => window.location.href = '/marketplace'}
            onTrackShipments={() => window.location.href = '/marketplace'}
          />
          
          <CodePreview />
        </div>
        
        <HowItWorks />
        <TestimonialSlider />
      </main>

      {/* Backend Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-medium tracking-tight mb-4">🔧 Backend Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-emerald-300">API Endpoints Ready:</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• GET /api/home-data</li>
                <li>• POST /api/cargo/quick-post</li>
                <li>• GET /api/loads/quick-search</li>
                <li>• GET /api/deals/active</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-cyan-300">Features:</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Dynamic hero content</li>
                <li>• Quick actions functionality</li>
                <li>• Real-time cargo preview</li>
                <li>• User activity tracking</li>
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

      {/* Add Cargo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-[#0E0E13] rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-lg font-medium">Add Cargo Modal</h3>
            <p className="mt-2 text-white/60">Modal functionality will be implemented with backend integration.</p>
            <button 
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}