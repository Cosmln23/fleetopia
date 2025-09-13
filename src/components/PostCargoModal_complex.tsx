'use client'

import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

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
  pickupTimeEnd?: string
  deliveryAddress: string
  deliveryCity: string
  deliveryCountry: string
  deliveryPostalCode?: string
  deliveryDate: string
  deliveryTimeStart?: string
  deliveryTimeEnd?: string
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
    pickupTimeEnd: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: 'Romania', 
    deliveryPostalCode: '',
    deliveryDate: '',
    deliveryTimeStart: '',
    deliveryTimeEnd: '',
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
      const apiData = {
        ...formData,
        weight: formData.weight ? (typeof formData.weight === 'string' ? parseFloat(formData.weight) : formData.weight) : undefined,
        volume: formData.volume ? (typeof formData.volume === 'string' ? parseFloat(formData.volume) : formData.volume) : undefined,
        estimatedValue: formData.price ? (typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price) : undefined,
        budgetMax: formData.price ? (typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price) : undefined,
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
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
      
      <div className="relative bg-[#0E0E13] rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
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

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            
            {error && (
              <div className="mb-4 text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">
                <AlertCircle className="inline h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-green-400 bg-green-500/10 border border-green-500/20 p-2 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="text-cyan-300 mb-2">{"{"}</div>
              
              <div className="ml-2">
                <div className="text-blue-300">"title": <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-64"
                  placeholder="Transport mobilier București - Cluj"
                /></div>
                
                <div className="text-blue-300 mt-1">"description": <input 
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-80"
                  placeholder="Detalii suplimentare..."
                /></div>
              </div>

              <div className="ml-2 mt-4">
                <div className="text-purple-300">"cargoSpecs": {"{"}</div>
                <div className="ml-4">
                  <div className="text-blue-300">"type": <select
                    required
                    value={formData.cargoType}
                    onChange={(e) => handleInputChange('cargoType', e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400"
                  >
                    <option value="General">General</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Hazardous">Hazardous</option>
                    <option value="Refrigerated">Refrigerated</option>
                  </select></div>
                  
                  <div className="text-blue-300 mt-1">"vehicleType": <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-40"
                  >
                    <option value="">Selectează...</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select></div>
                  
                  <div className="text-blue-300 mt-1">"weight": <input 
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-32"
                    placeholder="1000"
                  /> kg</div>
                  
                  <div className="text-blue-300 mt-1">"volume": <input 
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-32"
                    placeholder="5.2"
                  /> m³</div>
                  
                  <div className="text-blue-300 mt-1">"packaging": <input 
                    type="text"
                    value={formData.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-64"
                    placeholder="Paleți, cutii, etc."
                  /></div>
                  
                  <div className="text-blue-300 mt-1">"specialRequirements": <input 
                    type="text"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-80"
                    placeholder="Manipulare cu grijă..."
                  /></div>
                </div>
                <div className="text-purple-300">{"}"}</div>
              </div>

              <div className="ml-2 mt-4 grid grid-cols-2 gap-8">
                
                <div>
                  <div className="text-purple-300">"pickup": {"{"}</div>
                  <div className="ml-4">
                    <div className="text-blue-300">"address": <input 
                      type="text"
                      required
                      value={formData.pickupAddress}
                      onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                      placeholder="Str. Exemplu Nr. 123"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"city": <input 
                      type="text"
                      required
                      value={formData.pickupCity}
                      onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                      placeholder="București"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"postalCode": <input 
                      type="text"
                      value={formData.pickupPostalCode}
                      onChange={(e) => handleInputChange('pickupPostalCode', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                      placeholder="100001"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"country": <select
                      required
                      value={formData.pickupCountry}
                      onChange={(e) => handleInputChange('pickupCountry', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    >
                      {europeanCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select></div>
                    
                    <div className="text-blue-300 mt-1">"date": <input 
                      type="date"
                      required
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"timeStart": <input 
                      type="time"
                      value={formData.pickupTimeStart}
                      onChange={(e) => handleInputChange('pickupTimeStart', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"timeEnd": <input 
                      type="time"
                      value={formData.pickupTimeEnd}
                      onChange={(e) => handleInputChange('pickupTimeEnd', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    /></div>
                  </div>
                  <div className="text-purple-300">{"}"}</div>
                </div>

                <div>
                  <div className="text-purple-300">"delivery": {"{"}</div>
                  <div className="ml-4">
                    <div className="text-blue-300">"address": <input 
                      type="text"
                      required
                      value={formData.deliveryAddress}
                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                      placeholder="Str. Exemplu Nr. 456"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"city": <input 
                      type="text"
                      required
                      value={formData.deliveryCity}
                      onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                      placeholder="Cluj-Napoca"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"postalCode": <input 
                      type="text"
                      value={formData.deliveryPostalCode}
                      onChange={(e) => handleInputChange('deliveryPostalCode', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                      placeholder="400001"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"country": <select
                      required
                      value={formData.deliveryCountry}
                      onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    >
                      {europeanCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select></div>
                    
                    <div className="text-blue-300 mt-1">"date": <input 
                      type="date"
                      required
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"timeStart": <input 
                      type="time"
                      value={formData.deliveryTimeStart}
                      onChange={(e) => handleInputChange('deliveryTimeStart', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    /></div>
                    
                    <div className="text-blue-300 mt-1">"timeEnd": <input 
                      type="time"
                      value={formData.deliveryTimeEnd}
                      onChange={(e) => handleInputChange('deliveryTimeEnd', e.target.value)}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-full"
                    /></div>
                  </div>
                  <div className="text-purple-300">{"}"}</div>
                </div>
              </div>

              <div className="ml-2 mt-4">
                <div className="text-blue-300">"price": <input 
                  type="number"
                  min="1"
                  step="1"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="bg-transparent border border-white/20 rounded px-2 py-1 text-green-400 w-32"
                  placeholder="500"
                /> EUR</div>
              </div>

              <div className="ml-2 mt-4">
                <div className="text-purple-300">"options": {"{"}</div>
                <div className="ml-4">
                  <div className="text-blue-300">"isUrgent": <input 
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="ml-2"
                  /> <span className="text-green-400">{formData.isUrgent.toString()}</span></div>
                  
                  <div className="text-blue-300 mt-1">"isPublic": <input 
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="ml-2"
                  /> <span className="text-green-400">{formData.isPublic.toString()}</span></div>
                </div>
                <div className="text-purple-300">{"}"}</div>
              </div>

              <div className="text-cyan-300 mt-2">{"}"}</div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/80 transition"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-400/20 hover:bg-emerald-400/30 border border-emerald-400/30 rounded text-emerald-300 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Se postează...' : 'Postează Marfa'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-black/40 p-3 border-t border-white/10 text-left text-sm">
            <div className="text-emerald-400"><span className="text-white/70">$</span> publică cargo</div>
            <div className="text-cyan-300">› Validez câmpurile... complet</div>
            <div className="text-emerald-400">› Status: pregătit pentru postare — completează formularul</div>
          </div>
        </div>
      </div>
    </div>
  )
}