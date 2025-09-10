'use client'

import { Truck, Search, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  onAddCargo: () => void
  onFindLoads: () => void
}

export default function HeroSection({ onAddCargo, onFindLoads }: HeroSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
          Ce cauți astăzi?
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/60">
          How can we help you today?
        </p>
      </div>

      {/* Primary choices */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <button 
          onClick={onAddCargo}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] transition"
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cyan-400/10 via-transparent to-transparent"></div>
          <div className="p-6 sm:p-8 flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-cyan-400/10 flex items-center justify-center ring-1 ring-cyan-400/30">
              <Truck className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-medium tracking-tight">Am marfă de transportat</div>
              <div className="mt-1 text-sm text-white/60">Deschide rapid formularul pentru a posta încărcătura.</div>
            </div>
            <div className="ml-auto opacity-60 group-hover:opacity-100 transition">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </button>

        <button 
          onClick={onFindLoads}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] transition"
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-emerald-400/10 via-transparent to-transparent"></div>
          <div className="p-6 sm:p-8 flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-emerald-400/10 flex items-center justify-center ring-1 ring-emerald-400/30">
              <Search className="h-6 w-6 text-emerald-300" />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-medium tracking-tight">Caut marfă de transportat</div>
              <div className="mt-1 text-sm text-white/60">Vezi Toate Ofertele din Piață, cu filtre pre-setate.</div>
            </div>
            <div className="ml-auto opacity-60 group-hover:opacity-100 transition">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </button>
      </div>
    </section>
  )
}