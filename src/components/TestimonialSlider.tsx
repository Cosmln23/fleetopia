'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    initials: 'AV',
    name: 'Alexandru V.',
    role: 'Producător mobilier',
    content: 'Am găsit transport în aceeași zi, la un preț corect. Interfață clară, fără bătăi de cap.',
    bgColor: 'bg-emerald-400/20',
    ringColor: 'ring-emerald-300/30'
  },
  {
    id: 2,
    initials: 'MN',
    name: 'Mihai N.',
    role: 'Transportator',
    content: 'Filtrele din Piață sunt excelente. Am găsit încărcături pe traseul meu în 2 minute.',
    bgColor: 'bg-cyan-400/20',
    ringColor: 'ring-cyan-300/30'
  },
  {
    id: 3,
    initials: 'DR',
    name: 'Daria R.',
    role: 'Retail',
    content: 'Tracking-ul și comunicarea au făcut livrarea mult mai previzibilă.',
    bgColor: 'bg-indigo-400/20',
    ringColor: 'ring-indigo-300/30'
  }
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Ce spun utilizatorii</h2>
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={prevSlide}
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div 
          className="flex transition-transform duration-500" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="min-w-full p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-full ${testimonial.bgColor} ring-1 ${testimonial.ringColor} flex items-center justify-center text-sm`}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-white/80 text-base">{testimonial.content}</p>
                  <div className="mt-2 text-sm text-white/50">{testimonial.name} — {testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile controls */}
        <div className="sm:hidden flex items-center justify-center gap-3 pb-4">
          <button 
            onClick={prevSlide}
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={nextSlide}
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}