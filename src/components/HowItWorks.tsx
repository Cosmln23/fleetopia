import { Package, Handshake, Route } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14">
      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Cum funcționează</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="h-10 w-10 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-white/80" />
          </div>
          <div className="mt-4 text-lg font-medium tracking-tight">1. Postează marfa</div>
          <p className="mt-1 text-sm text-white/60">Completezi detaliile esențiale în mai puțin de 1 minut.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="h-10 w-10 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
            <Handshake className="h-5 w-5 text-white/80" />
          </div>
          <div className="mt-4 text-lg font-medium tracking-tight">2. Primești oferte</div>
          <p className="mt-1 text-sm text-white/60">Transportatorii potriviți licitează transparent. Alegi ce îți convine.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="h-10 w-10 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
            <Route className="h-5 w-5 text-white/80" />
          </div>
          <div className="mt-4 text-lg font-medium tracking-tight">3. Urmărești & plătești</div>
          <p className="mt-1 text-sm text-white/60">Tracking în timp real și închidere rapidă a deal-ului.</p>
        </div>
      </div>
    </section>
  )
}