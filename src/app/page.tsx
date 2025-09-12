'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import TopBar from '@/components/TopBar';
import HeroSection from '@/components/HeroSection';
import QuickActions from '@/components/QuickActions';
import CodePreview from '@/components/CodePreview';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSlider from '@/components/TestimonialSlider';
import CursorSpotlight from '@/components/CursorSpotlight';
import PostCargoModal from '@/components/PostCargoModal';
import Link from 'next/link';

export default function HomePage() {
  const { isSignedIn } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleMarketplaceAccess = () => {
    if (isSignedIn) {
      window.location.href = '/marketplace';
    } else {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 4000); // Auto-hide after 4s
    }
  };

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
  }, [])

  return (
    <div 
      className={`min-h-screen bg-cover bg-center bg-fixed scroll-blur-container ${isScrolled ? 'scrolled' : ''}`}
      style={{
        backgroundImage: `linear-gradient(rgba(11, 11, 15, 0.3), rgba(11, 11, 15, 0.7)), url('/wallpaper.jpg')`,
        filter: 'contrast(1.2) brightness(1.1)'
      }}
    >
      <TopBar />
      
      {/* HOME */}
      <main id="home" className="scroll-mt-20 scroll-blur-content">
        <HeroSection 
          onAddCargo={handleMarketplaceAccess}
          onFindLoads={handleMarketplaceAccess}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <QuickActions 
            onPostFast={openModal}
            onFindLoads={() => { window.location.href = '/marketplace'; }}
            onTrackShipments={() => { window.location.href = '/marketplace'; }}
          />
          
          <div className="mt-20">
            <CodePreview />
          </div>
        </div>
        
        <div className="mt-32">
          <HowItWorks />
        </div>
        
        <div className="mt-32 mb-20">
          <TestimonialSlider />
        </div>
      </main>


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

      {/* Auth Warning */}
      {showAuthWarning && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg border border-amber-400/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg className="h-5 w-5 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Acces restricționat</h4>
                <p className="text-xs text-amber-100 mt-1">Pentru a accesa marketplace-ul, trebuie să te conectezi sau să îți creezi un cont.</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setShowAuthWarning(false)}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
                  >
                    Am înțeles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Cargo Modal */}
      <PostCargoModal isOpen={isModalOpen} onClose={closeModal} />
      
      <CursorSpotlight intensity="subtle" size={275} />
    </div>
  )
}