'use client'

import { Sparkles, Rows3, Route } from 'lucide-react'

interface QuickActionsProps {
  onPostFast: () => void
  onFindLoads: () => void
  onTrackShipments: () => void
}

export default function QuickActions({ onPostFast, onFindLoads, onTrackShipments }: QuickActionsProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button 
        onClick={onPostFast}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
      >
        <Sparkles className="h-4 w-4 text-cyan-300" /> Post Cargo Fast
      </button>
      <button 
        onClick={onFindLoads}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
      >
        <Rows3 className="h-4 w-4 text-emerald-300" /> Find Loads
      </button>
      <button 
        onClick={onTrackShipments}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
      >
        <Route className="h-4 w-4 text-indigo-300" /> Track My Shipments
      </button>
    </div>
  )
}