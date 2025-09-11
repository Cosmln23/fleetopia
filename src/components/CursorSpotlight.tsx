'use client';

import { useState, useEffect, useRef } from 'react';

interface CursorSpotlightProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  size?: number;
  enabled?: boolean;
}

export default function CursorSpotlight({ 
  intensity = 'subtle', 
  size = 200, 
  enabled = true 
}: CursorSpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();

  const intensityMap = {
    subtle: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.08)', 
    strong: 'rgba(0, 0, 0, 0.12)'
  };

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let isMouseInside = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        try {
          setMousePosition({ x: e.clientX, y: e.clientY });
          if (!isMouseInside) {
            setIsVisible(true);
            isMouseInside = true;
          }
        } catch (error) {
          console.warn('CursorSpotlight: Error updating position', error);
        }
      });
    };

    const handleMouseEnter = () => {
      isMouseInside = true;
      setIsVisible(true);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Nu ascunde spotlight-ul dacă mouse-ul este încă în window
      if (e.clientX >= 0 && e.clientX <= window.innerWidth && e.clientY >= 0 && e.clientY <= window.innerHeight) {
        return;
      }
      isMouseInside = false;
      setIsVisible(false);
    };

    const handleTouchStart = () => {
      setIsVisible(false);
    };

    try {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
    } catch (error) {
      console.warn('CursorSpotlight: Error adding event listeners', error);
    }

    return () => {
      try {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('touchstart', handleTouchStart);
      } catch (error) {
        console.warn('CursorSpotlight: Error cleaning up event listeners', error);
      }
    };
  }, [enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Background layer - behind content */}
      <div
        className="fixed inset-0 pointer-events-none z-[5] transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle ${size}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 50%, ${intensityMap[intensity]} 80%)`,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        aria-hidden="true"
      />
      
      {/* Foreground layer - over content but under modals */}
      <div
        className="fixed inset-0 pointer-events-none z-[50] transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle ${size * 0.8}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.03) 0%, transparent 40%, ${intensityMap[intensity]} 70%)`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          mixBlendMode: 'soft-light'
        }}
        aria-hidden="true"
      />
    </>
  );
}