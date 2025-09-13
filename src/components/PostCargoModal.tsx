'use client'

import { useState } from 'react'
import { X, Truck, MapPin, Calendar, Package, AlertCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { z } from 'zod'

interface PostCargoModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  title: string
  description?: string
  pickupAddress: string
  pickupCity: string
  pickupCountry: string
  pickupPostalCode?: string
  pickupDate: string
  pickupTimeStart?: string
  deliveryAddress: string
  deliveryCity: string
  deliveryCountry: string
  deliveryPostalCode?: string
  deliveryDate: string
  deliveryTimeStart?: string
  weight?: number | ''
  volume?: number | ''
  cargoType: 'General' | 'Fragile' | 'Hazardous' | 'Refrigerated'
  vehicleType?: string
  packaging?: string
  specialRequirements?: string
  price?: number | ''
  isUrgent: boolean
  isPublic: boolean
}

// Frontend validation schema (adapted from API schema)
const createCargoSchema = z.object({
  // Basic info
  title: z.string().min(3, 'Titlul trebuie să aibă cel puțin 3 caractere').max(200, 'Titlul este prea lung'),
  description: z.string().optional(),

  // Pickup details
  pickupAddress: z.string().min(5, 'Adresa de ridicare este necesară'),
  pickupCity: z.string().min(2, 'Orașul de ridicare este necesar'),
  pickupCountry: z.string().min(2, 'Țara de ridicare este necesară'),
  pickupPostalCode: z.string().optional(),
  pickupDate: z.string().min(1, 'Data ridicării este necesară'),
  pickupTimeStart: z.string().optional(),

  // Delivery details
  deliveryAddress: z.string().min(5, 'Adresa de livrare este necesară'),
  deliveryCity: z.string().min(2, 'Orașul de livrare este necesar'),
  deliveryCountry: z.string().min(2, 'Țara de livrare este necesară'),
  deliveryPostalCode: z.string().optional(),
  deliveryDate: z.string().min(1, 'Data livrării este necesară'),
  deliveryTimeStart: z.string().optional(),

  // Cargo specifications  
  weight: z.preprocess(
    (val: unknown) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive('Greutatea trebuie să fie pozitivă').optional()
  ),
  volume: z.preprocess(
    (val: unknown) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive('Volumul trebuie să fie pozitiv').optional()
  ),
  cargoType: z.enum(['General', 'Fragile', 'Hazardous', 'Refrigerated']),
  vehicleType: z.string().optional(),
  packaging: z.string().optional(),
  specialRequirements: z.string().optional(),

  // Pricing
  price: z.preprocess(
    (val: unknown) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive('Prețul trebuie să fie pozitiv').optional()
  ),

  // Options
  isUrgent: z.boolean().default(false),
  isPublic: z.boolean().default(true)
});

export default function PostCargoModal({ isOpen, onClose }: PostCargoModalProps) {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const europeanCountries = [
    'Romania', 'Germania', 'Franța', 'Italia', 'Spania', 'Polonia', 'Ungaria', 
    'Cehia', 'Slovacia', 'Austria', 'Olanda', 'Belgia', 'Portugalia', 'Grecia',
    'Bulgaria', 'Croația', 'Slovenia', 'Estonia', 'Letonia', 'Lituania', 
    'Danemarca', 'Suedia', 'Finlanda', 'Irlanda', 'Cipru', 'Malta', 'Luxemburg',
    'Bosnia și Herțegovina', 'Serbia', 'Macedonia de Nord', 'Albania', 'Moldova',
    'Ucraina', 'Belarus', 'Norvegia', 'Elveția', 'Islanda', 'Muntenegru', 'Kosovo',
    'Turcia'
  ].sort()

  const vehicleTypes = [
    'Prelată', 'Prelată - Mega', 'Dublă etajă', 'Frigider', 'Izotermă', 
    'Cisternă', 'Container', 'Auto-platforma', 'Basculantă', 'Betoniera'
  ]
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    pickupAddress: '',
    pickupCity: '',
    pickupCountry: 'Romania',
    pickupPostalCode: '',
    pickupDate: '',
    pickupTimeStart: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: 'Romania', 
    deliveryPostalCode: '',
    deliveryDate: '',
    deliveryTimeStart: '',
    weight: '',
    volume: '',
    cargoType: 'General',
    vehicleType: '',
    packaging: '',
    specialRequirements: '',
    price: '',
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
      // Frontend validation with Zod
      console.log('FormData being validated:', formData)
      const validationResult = createCargoSchema.safeParse(formData)
      console.log('Validation result:', validationResult)
      
      if (!validationResult.success) {
        console.log('Validation errors:', validationResult.error.errors)
        const errors = validationResult.error.errors
        const firstError = errors && errors.length > 0 ? errors[0] : null
        setError(firstError ? firstError.message : 'Eroare de validare')
        setIsSubmitting(false)
        return
      }
      
      console.log('Validation successful, preparing API data...')

      const validatedData = validationResult.data
      console.log('Validated data:', validatedData)

      const apiData = {
        ...validatedData,
        weight: validatedData.weight,
        volume: validatedData.volume,
        estimatedValue: validatedData.price,
        budgetMax: validatedData.price,
        pickupDate: validatedData.pickupDate,
        deliveryDate: validatedData.deliveryDate,
        pickupTimeStart: validatedData.pickupTimeStart,
        deliveryTimeStart: validatedData.deliveryTimeStart,
        pickupPostalCode: validatedData.pickupPostalCode,
        deliveryPostalCode: validatedData.deliveryPostalCode,
        vehicleType: validatedData.vehicleType,
        packaging: validatedData.packaging,
        specialRequirements: validatedData.specialRequirements,
        description: validatedData.description
      }

      console.log('API data being sent:', apiData)

      console.log('Sending request to API...')
      const response = await fetch('/api/cargo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      console.log('API Response status:', response.status)
      const result = await response.json()
      console.log('API Response data:', result)

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Eroare la postarea mărfii')
      }

      setSuccess('Marfa a fost postată cu succes!')
      
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
        {/* Header JSON Style */}
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

        {/* Form */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Titlu Marfă *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                placeholder="ex. Transport mobilier București - Cluj"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Descriere</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition resize-none text-white"
                placeholder="Detalii suplimentare despre marfă..."
              />
            </div>

            {/* Cargo Specifications */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-white">
                <Package className="h-4 w-4 text-white" />
                Specificații Marfă
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Tip Marfă *</label>
                  <select
                    required
                    value={formData.cargoType}
                    onChange={(e) => handleInputChange('cargoType', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                  >
                    <option value="General">General</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Hazardous">Hazardous</option>
                    <option value="Refrigerated">Refrigerated</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Tip Vehicul</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                  >
                    <option value="">Selectează...</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Greutate (kg)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="50000"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Volum (m³)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    placeholder="5.2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Ambalare</label>
                  <input
                    type="text"
                    value={formData.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    placeholder="Paleți, cutii, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Cerințe Speciale</label>
                  <input
                    type="text"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    placeholder="Manipulare cu grijă..."
                  />
                </div>
              </div>
            </div>

            {/* Pickup and Delivery Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-white" />
                  <h4 className="font-medium text-white">Ridicare</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Adresă *</label>
                    <input
                      type="text"
                      required
                      value={formData.pickupAddress}
                      onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                      placeholder="Str. Exemplu Nr. 123"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Oraș *</label>
                      <input
                        type="text"
                        required
                        value={formData.pickupCity}
                        onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                        placeholder="București"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Cod Postal</label>
                      <input
                        type="text"
                        value={formData.pickupPostalCode}
                        onChange={(e) => handleInputChange('pickupPostalCode', e.target.value)}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                        placeholder="100001"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Țară *</label>
                    <select
                      required
                      value={formData.pickupCountry}
                      onChange={(e) => handleInputChange('pickupCountry', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    >
                      {europeanCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Data ridicării *</label>
                    <input
                      type="date"
                      required
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Oră</label>
                    <input
                      type="time"
                      value={formData.pickupTimeStart}
                      onChange={(e) => handleInputChange('pickupTimeStart', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-emerald-300" />
                  <h4 className="font-medium text-white">Livrare</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Adresă *</label>
                    <input
                      type="text"
                      required
                      value={formData.deliveryAddress}
                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                      placeholder="Str. Exemplu Nr. 456"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Oraș *</label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryCity}
                        onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                        placeholder="Cluj-Napoca"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Cod Postal</label>
                      <input
                        type="text"
                        value={formData.deliveryPostalCode}
                        onChange={(e) => handleInputChange('deliveryPostalCode', e.target.value)}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Țară *</label>
                    <select
                      required
                      value={formData.deliveryCountry}
                      onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    >
                      {europeanCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Data livrării *</label>
                    <input
                      type="date"
                      required
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Oră</label>
                    <input
                      type="time"
                      value={formData.deliveryTimeStart}
                      onChange={(e) => handleInputChange('deliveryTimeStart', e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Preț (EUR)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-32 px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition text-white"
                placeholder="500"
              />
            </div>

            {/* Additional Options */}
            <div>
              <h4 className="font-medium mb-3 text-white">Opțiuni</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <label htmlFor="isUrgent" className="text-sm text-white">Transport urgent</label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <label htmlFor="isPublic" className="text-sm text-white">Marfă publică (vizibilă tuturor)</label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition text-white/80"
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

        {/* Footer Terminal Style */}
        <div className="bg-black/40 p-3 border-t border-white/10 text-left text-sm">
          <div className="text-emerald-400"><span className="text-white/70">$</span> publică cargo</div>
          <div className="text-cyan-300">› Validez câmpurile... completează formularul pentru publicare</div>
          <div className="text-emerald-400">› Status: pregătit pentru postare</div>
        </div>
      </div>
    </div>
  )
}