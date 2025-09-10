'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

interface CargoData {
  pickup: string
  delivery: string
  weightKg: number
  readyDate: string
  vehicleType: string
  priceEUR?: number
  notes: string
}

interface CodePreviewProps {
  cargoData?: CargoData
}

export default function CodePreview({ cargoData }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const defaultData: CargoData = {
    pickup: "București, RO",
    delivery: "Cluj-Napoca, RO",
    weightKg: 1200,
    readyDate: "2025-09-12",
    vehicleType: "Prelată",
    priceEUR: 520,
    notes: "Încărcare laterală, 8 paleți"
  }

  const displayData = cargoData || defaultData

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(displayData, null, 2)
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 700)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-white/10 overflow-hidden bg-black/40">
      {/* Editor Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center">
          <div className="flex items-center gap-2 mr-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60"></div>
          </div>
          <div className="text-white/80 text-sm">add-cargo.json</div>
        </div>
        <button 
          onClick={handleCopy}
          className={`text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1 ${
            copied ? 'bg-white/10' : ''
          }`}
        >
          <Copy className="h-3.5 w-3.5" /> Copy
        </button>
      </div>
      
      {/* Code Lines */}
      <div className="flex divide-x divide-white/10">
        <div className="bg-black/50 text-white/40 py-3 px-2 text-right select-none w-10 text-xs leading-6">
          <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
        </div>
        <div className="py-3 px-4 overflow-auto w-full bg-black/30 text-left text-sm leading-6">
          <pre className="whitespace-pre text-white/90">
            {JSON.stringify(displayData, null, 2)}
          </pre>
        </div>
      </div>
      
      {/* Terminal */}
      <div className="bg-black/40 p-3 border-t border-white/10 text-left text-sm">
        <div className="text-emerald-400"><span className="text-white/70">$</span> publish cargo</div>
        <div className="text-cyan-300">› Matching carriers... found 5 within 50 km</div>
        <div className="text-emerald-400">› Status: draft ready — open the form to post</div>
      </div>
      
      {/* Status Bar */}
      <div className="px-3 py-1 border-t border-white/10 flex justify-between items-center text-white/50 text-xs">
        <div className="flex items-center gap-3">
          <span>JSON</span><span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln 9, Col 1</span><span>Spaces: 2</span><span>10 lines</span>
        </div>
      </div>
    </div>
  )
}