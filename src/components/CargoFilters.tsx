'use client'

interface CargoFiltersProps {
  filters?: {
    country?: string
    sortBy?: string
    cargoType?: string
    urgency?: string
    minPrice?: string
    maxPrice?: string
  }
  onFiltersChange?: (filters: any) => void
}

export default function CargoFilters({ filters = {}, onFiltersChange }: CargoFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange?.(newFilters)
  }

  const handleClear = () => {
    const clearedFilters = {
      country: 'All Countries',
      sortBy: 'Newest First',
      cargoType: 'All Types',
      urgency: 'All Urgency',
      minPrice: '',
      maxPrice: ''
    }
    onFiltersChange?.(clearedFilters)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select 
        value={filters.country || 'All Countries'}
        onChange={(e) => handleFilterChange('country', e.target.value)}
        className="h-9 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
      >
        <option>All Countries</option>
        <option>România</option>
        <option>Germania</option>
        <option>Franța</option>
        <option>Italia</option>
      </select>
      
      <select 
        value={filters.sortBy || 'Newest First'}
        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        className="h-9 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
      >
        <option>Newest First</option>
        <option>Oldest First</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Distance: Near to Far</option>
      </select>
      
      <select 
        value={filters.cargoType || 'All Types'}
        onChange={(e) => handleFilterChange('cargoType', e.target.value)}
        className="h-9 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
      >
        <option>All Types</option>
        <option>General</option>
        <option>Fragile</option>
        <option>Refrigerat</option>
        <option>Lichid</option>
        <option>Oversized</option>
      </select>
      
      <select 
        value={filters.urgency || 'All Urgency'}
        onChange={(e) => handleFilterChange('urgency', e.target.value)}
        className="h-9 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
      >
        <option>All Urgency</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Urgent</option>
      </select>
      
      <input 
        type="number" 
        placeholder="Min (€)"
        value={filters.minPrice || ''}
        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        className="w-24 h-9 px-3 rounded-lg bg-white/[0.06] border border-white/10 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
      />
      
      <input 
        type="number" 
        placeholder="Max (€)"
        value={filters.maxPrice || ''}
        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        className="w-24 h-9 px-3 rounded-lg bg-white/[0.06] border border-white/10 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
      />
      
      <button 
        onClick={handleClear}
        className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
      >
        Clear
      </button>
    </div>
  )
}