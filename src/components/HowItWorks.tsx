import { Package, Handshake, Route } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14">
      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Cum funcționează</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
          {/* Header cu punctele colorate */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60"></div>
            </div>
            <div className="text-white/80 text-xs">step-1.json</div>
          </div>
          {/* Content */}
          <div className="p-5 bg-black/30">
            <div className="h-10 w-10 rounded-lg bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
              <Package className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="mt-4 text-lg font-medium tracking-tight">1. Postează marfa</div>
            <p className="mt-1 text-sm text-white/60">Completezi detaliile esențiale în mai puțin de 1 minut.</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
          {/* Header cu punctele colorate */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60"></div>
            </div>
            <div className="text-white/80 text-xs">step-2.json</div>
          </div>
          {/* Content */}
          <div className="p-5 bg-black/30">
            <div className="h-10 w-10 rounded-lg bg-blue-400/15 border border-blue-400/30 flex items-center justify-center">
              <Handshake className="h-5 w-5 text-blue-300" />
            </div>
            <div className="mt-4 text-lg font-medium tracking-tight">2. Primești oferte</div>
            <p className="mt-1 text-sm text-white/60">Transportatorii potriviți licitează transparent. Alegi ce îți convine.</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
          {/* Header cu punctele colorate */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60"></div>
            </div>
            <div className="text-white/80 text-xs">step-3.json</div>
          </div>
          {/* Content */}
          <div className="p-5 bg-black/30">
            <div className="h-10 w-10 rounded-lg bg-purple-400/15 border border-purple-400/30 flex items-center justify-center">
              <Route className="h-5 w-5 text-purple-300" />
            </div>
            <div className="mt-4 text-lg font-medium tracking-tight">3. Urmărești & plătești</div>
            <p className="mt-1 text-sm text-white/60">Tracking în timp real și închidere rapidă a deal-ului.</p>
          </div>
        </div>
      </div>
    </section>
  )
}