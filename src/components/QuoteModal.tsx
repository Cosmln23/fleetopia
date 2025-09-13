'use client'

import { useState } from 'react'
import { X, Euro, MessageCircle, CheckCircle } from 'lucide-react'

interface CargoData {
  id: string
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

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  cargo: CargoData
  onQuoteSubmitted?: () => void
}

export default function QuoteModal({ isOpen, onClose, cargo, onQuoteSubmitted }: QuoteModalProps) {
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [quoteId, setQuoteId] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        totalPrice: parseFloat(price),
        vehicleType: 'Prelată' // Default
      }

      const response = await fetch(`/api/cargo/${cargo.id}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit quote')
      }

      setSuccess(true)
      setQuoteId(result.data?.quote?.id || 'unknown')
      onQuoteSubmitted?.()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPrice('')
    setError('')
    setSuccess(false)
    setQuoteId('')
    onClose()
  }

  const handleChat = () => {
    // TODO: Open chat with cargo owner
    alert('Chat functionality coming soon!')
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative max-w-md w-full">
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
          {/* Header */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              <div className="flex items-center gap-2 mr-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-sm">quote.json</div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 bg-black/30">
            {!success ? (
              // Quote Form
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Trimite Ofertă</h2>
                  <p className="text-white/60 text-sm">{cargo.title}</p>
                  <p className="text-white/40 text-xs">{cargo.route}</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      Preț Ofertă (EUR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-white/[0.06] border border-white/10 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-lg text-center"
                      placeholder="500.00"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || !price}
                    className="w-full h-12 rounded-lg border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 text-emerald-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Se trimite...' : 'Trimite Oferta'}
                  </button>
                </form>
              </>
            ) : (
              // Success State
              <>
                <div className="text-center mb-6">
                  <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">Ofertă Trimisă!</h2>
                  <p className="text-white/60 text-sm">Oferta ta de <span className="text-emerald-400 font-medium">€{price}</span> a fost trimisă</p>
                  <p className="text-white/40 text-xs mt-2">Quote ID: {quoteId}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleChat}
                    className="h-10 px-4 rounded-lg border border-cyan-400/30 bg-cyan-400/15 hover:bg-cyan-400/20 text-cyan-200 transition text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </button>
                  <button 
                    onClick={handleClose}
                    className="h-10 px-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
                  >
                    Închide
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}