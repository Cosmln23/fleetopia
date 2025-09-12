'use client'

import { MapPin } from 'lucide-react'

interface CargoData {
  id: number
  title: string
  route: string
  type: string
  weight: string
  volume?: string
  price: string
  poster: string
  verified?: boolean
  urgency?: string
  loadingDate?: string
  deliveryDate?: string
  distance?: string
  estimatedTime?: string
}

interface CargoCardProps {
  cargo: CargoData
  onClick?: (cargo: CargoData) => void
}

export default function CargoCard({ cargo, onClick }: CargoCardProps) {
  return (
    <div 
      onClick={() => onClick?.(cargo)}
      className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition cursor-pointer overflow-hidden"
    >
      {/* Header cu punctele colorate */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
        </div>
        <div className="text-white/80 text-xs">cargo-{String(cargo.id).padStart(3, '0')}.json</div>
      </div>
      
      {/* Content */}
      <div className="p-5 bg-black/30">
        {/* Cargo Title */}
        <div className="text-lg font-medium tracking-tight mb-3">{cargo.title}</div>
        
        {/* Adresă: Țară + Oraș + Cod poștal */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-white/50" />
          <span className="text-sm text-white/70">{cargo.route}</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Cargo Type */}
          <div>
            <span className="text-xs text-white/50">Cargo Type</span>
            <div className="text-sm font-medium">{cargo.type}</div>
          </div>
          {/* Weight */}
          <div>
            <span className="text-xs text-white/50">Weight</span>
            <div className="text-sm font-medium">{cargo.weight}</div>
          </div>
        </div>

        {/* Bottom Row: Preț + Nume Poster */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div>
            <span className="text-xs text-white/50">Preț</span>
            <div className="text-lg font-semibold text-emerald-300">{cargo.price}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-white/50">Poster</span>
            <div className="text-sm font-medium">{cargo.poster}</div>
          </div>
        </div>
      </div>
    </div>
  )
}