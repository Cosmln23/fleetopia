'use client'

import { useState } from 'react'
import { X, Truck, MapPin, Calendar, Package, AlertCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface PostCargoModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  title: string
  cargoType: 'General' | 'Fragile' | 'Hazardous' | 'Refrigerated'
  weight: number | ''
  volume?: number | ''
  pickupCity: string
  pickupCountry: string
  pickupAddress: string
  pickupDate: string
  deliveryCity: string
  deliveryCountry: string
  deliveryAddress: string
  deliveryDate: string
  budgetMax?: number | ''
  isUrgent: boolean
  description?: string
}

export default function PostCargoModal({ isOpen, onClose }: PostCargoModalProps) {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    cargoType: 'General',
    weight: '',
    volume: '',
    pickupCity: '',
    pickupCountry: 'Romania',
    pickupAddress: '',
    pickupDate: '',
    deliveryCity: '',
    deliveryCountry: 'Romania',
    deliveryAddress: '',
    deliveryDate: '',
    budgetMax: '',
    isUrgent: false,
    description: ''
  })

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Trebuie să fii conectat pentru a posta marfă.')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      // Convert form data for API
      const apiData = {
        ...formData,
        weight: typeof formData.weight === 'string' ? parseFloat(formData.weight) : formData.weight,
        volume: formData.volume ? (typeof formData.volume === 'string' ? parseFloat(formData.volume) : formData.volume) : undefined,
        budgetMax: formData.budgetMax ? (typeof formData.budgetMax === 'string' ? parseFloat(formData.budgetMax) : formData.budgetMax) : undefined,
        pickupDate: new Date(formData.pickupDate).toISOString(),
        deliveryDate: new Date(formData.deliveryDate).toISOString()
      }

      const response = await fetch('/api/cargo/quick-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Eroare la postarea mărfii')
      }

      setSuccess('Marfa a fost postată cu succes!')
      
      // Redirect after short delay
      setTimeout(() => {
        if (result.data.redirectUrl) {
          window.location.href = result.data.redirectUrl
        } else {
          window.location.href = '/marketplace'
        }
      }, 1500)

    } catch (err) {
      console.error('Error posting cargo:', err)
      setError(err instanceof Error ? err.message : 'Eroare neașteptată')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div data-testid="post-cargo-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0E0E13] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-400/10 flex items-center justify-center ring-1 ring-cyan-400/30">
              <Truck className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Post Cargo Fast</h3>
              <p className="text-sm text-white/60">Postează marfa rapid și eficient</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium mb-2">Titlu Marfă *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                placeholder="ex. Transport mobilier București - Cluj"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tip Marfă *</label>
                <select
                  required
                  value={formData.cargoType}
                  onChange={(e) => handleInputChange('cargoType', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                >
                  <option value="General">General</option>
                  <option value="Fragile">Fragile</option>
                  <option value="Hazardous">Hazardous</option>
                  <option value="Refrigerated">Refrigerated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Greutate (kg) *</label>
                <input
                  type="number"
                  required
                  min="0.1"
                  max="50000"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Volum (m³)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.volume}
                  onChange={(e) => handleInputChange('volume', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  placeholder="5.2"
                />
              </div>
            </div>

            {/* Pickup */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <h4 className="font-medium">Ridicare</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Oraș *</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupCity}
                    onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="București"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Țară *</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupCountry}
                    onChange={(e) => handleInputChange('pickupCountry', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="Romania"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adresă *</label>
                  <input
                    type="text"
                    required
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="Str. Exemplu Nr. 123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data ridicării *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4 text-emerald-300" />
                <h4 className="font-medium">Livrare</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Oraș *</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryCity}
                    onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="Cluj-Napoca"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Țară *</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryCountry}
                    onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="Romania"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adresă *</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="Str. Exemplu Nr. 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data livrării *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget Maxim (RON)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.budgetMax}
                  onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  placeholder="5000"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="isUrgent"
                  checked={formData.isUrgent}
                  onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50"
                />
                <label htmlFor="isUrgent" className="text-sm">Transport urgent</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descriere</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition resize-none"
                placeholder="Detalii suplimentare despre marfă..."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Se postează...' : 'Postează Marfa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}