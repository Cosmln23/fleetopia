'use client'

import { useState } from 'react'
import { X, Truck, MapPin, Calendar, Package, AlertCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface PostCargoModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  // Basic info
  title: string
  description?: string
  
  // Pickup details
  pickupAddress: string
  pickupCity: string
  pickupCountry: string
  pickupPostalCode?: string
  pickupDate: string
  pickupTimeStart?: string
  pickupTimeEnd?: string
  
  // Delivery details
  deliveryAddress: string
  deliveryCity: string
  deliveryCountry: string
  deliveryPostalCode?: string
  deliveryDate: string
  deliveryTimeStart?: string
  deliveryTimeEnd?: string
  
  // Cargo specifications
  weight?: number | ''
  volume?: number | ''
  cargoType: 'General' | 'Fragile' | 'Hazardous' | 'Refrigerated'
  vehicleType?: string
  packaging?: string
  specialRequirements?: string
  
  // Pricing
  price?: number | ''
  
  // Options
  isUrgent: boolean
  isPublic: boolean
}

export default function PostCargoModal({ isOpen, onClose }: PostCargoModalProps) {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // European countries list
  const europeanCountries = [
    'Romania', 'Germania', 'Franța', 'Italia', 'Spania', 'Polonia', 'Ungaria', 
    'Cehia', 'Slovacia', 'Austria', 'Olanda', 'Belgia', 'Portugalia', 'Grecia',
    'Bulgaria', 'Croația', 'Slovenia', 'Estonia', 'Letonia', 'Lituania', 
    'Danemarca', 'Suedia', 'Finlanda', 'Irlanda', 'Cipru', 'Malta', 'Luxemburg',
    'Bosnia și Herțegovina', 'Serbia', 'Macedonia de Nord', 'Albania', 'Moldova',
    'Ucraina', 'Belarus', 'Norvegia', 'Elveția', 'Islanda', 'Muntenegru', 'Kosovo',
    'Turcia'
  ].sort()
  
  const [formData, setFormData] = useState<FormData>({
    // Basic info
    title: '',
    description: '',
    
    // Pickup details
    pickupAddress: '',
    pickupCity: '',
    pickupCountry: 'Romania',
    pickupPostalCode: '',
    pickupDate: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    
    // Delivery details
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: 'Romania',
    deliveryPostalCode: '',
    deliveryDate: '',
    deliveryTimeStart: '',
    deliveryTimeEnd: '',
    
    // Cargo specifications
    weight: '',
    volume: '',
    cargoType: 'General',
    vehicleType: '',
    packaging: '',
    specialRequirements: '',
    
    // Pricing
    price: '',
    
    // Options
    isUrgent: false,
    isPublic: true
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
        // Convert numbers
        weight: formData.weight ? (typeof formData.weight === 'string' ? parseFloat(formData.weight) : formData.weight) : undefined,
        volume: formData.volume ? (typeof formData.volume === 'string' ? parseFloat(formData.volume) : formData.volume) : undefined,
        estimatedValue: formData.price ? (typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price) : undefined,
        budgetMax: formData.price ? (typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price) : undefined,
        // Convert dates to ISO strings
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
        // Clean up empty strings
        pickupTimeStart: formData.pickupTimeStart || undefined,
        pickupTimeEnd: formData.pickupTimeEnd || undefined,
        deliveryTimeStart: formData.deliveryTimeStart || undefined,
        deliveryTimeEnd: formData.deliveryTimeEnd || undefined,
        pickupPostalCode: formData.pickupPostalCode || undefined,
        deliveryPostalCode: formData.deliveryPostalCode || undefined,
        vehicleType: formData.vehicleType || undefined,
        packaging: formData.packaging || undefined,
        specialRequirements: formData.specialRequirements || undefined,
        description: formData.description || undefined
      }

      const response = await fetch('/api/cargo/create', {
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
      
      <div className="relative max-w-6xl w-full">
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
          {/* JSON Terminal Header */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              <div className="flex items-center gap-2 mr-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
              </div>
              <div className="text-white/80 text-sm">add-cargo.json</div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>

        {/* JSON Content */}
        <div className="bg-[#0d1117] text-green-400 font-mono text-sm p-4 max-h-[80vh] overflow-y-auto">
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

            {/* Cargo Specifications */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-cyan-300" />
                Specificații Marfă
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                  <label className="block text-sm font-medium mb-2">Greutate (kg)</label>
                  <input
                    type="number"
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
                <div>
                  <label className="block text-sm font-medium mb-2">Ambalare</label>
                  <input
                    type="text"
                    value={formData.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="Paleți, cutii, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cerințe Speciale</label>
                <input
                  type="text"
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  placeholder="Manipulare cu grijă, temperatură controlată, etc."
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
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
              </div>
              
              {/* Time Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Oră început ridicare</label>
                  <input
                    type="time"
                    value={formData.pickupTimeStart}
                    onChange={(e) => handleInputChange('pickupTimeStart', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Oră sfârșit ridicare</label>
                  <input
                    type="time"
                    value={formData.pickupTimeEnd}
                    onChange={(e) => handleInputChange('pickupTimeEnd', e.target.value)}
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
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
              </div>
              
              {/* Time Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Oră început livrare</label>
                  <input
                    type="time"
                    value={formData.deliveryTimeStart}
                    onChange={(e) => handleInputChange('deliveryTimeStart', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Oră sfârșit livrare</label>
                  <input
                    type="time"
                    value={formData.deliveryTimeEnd}
                    onChange={(e) => handleInputChange('deliveryTimeEnd', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-300" />
                Prețuri și Buget
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valoare estimată (RON)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Minim (RON)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.budgetMin}
                    onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Maxim (RON)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.budgetMax}
                    onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition"
                    placeholder="500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h4 className="font-medium mb-3">Opțiuni</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <label htmlFor="isUrgent" className="text-sm">Transport urgent</label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <label htmlFor="isPublic" className="text-sm">Marfă publică (vizibilă tuturor)</label>
                </div>
              </div>
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