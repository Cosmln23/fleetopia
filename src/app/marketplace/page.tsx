'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import TopBar from '@/components/TopBar';
import CursorSpotlight from '@/components/CursorSpotlight';
import TabNavigation from '@/components/TabNavigation';
import SearchBar from '@/components/SearchBar';
import CargoFilters from '@/components/CargoFilters';
import CargoCard from '@/components/CargoCard';
import PostCargoModal from '@/components/PostCargoModal';
import QuoteModal from '@/components/QuoteModal';
import Link from 'next/link';
import { SlidersHorizontal, MapPin, Eye, CheckCircle, Clock3, FileDown, Shield, Calendar, Truck, MessageCircle, Heart, X, Loader2, Package, User, Scale, Edit, Trash2 } from 'lucide-react';

export default function MarketplacePage() {
  const { user, isLoaded } = useUser();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAddCargoOpen, setIsAddCargoOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // New state for components
  const [activeTab, setActiveTab] = useState('all-offers');
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});
  
  // Real data state
  const [cargos, setCargos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cargo data based on active tab
  const fetchCargos = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = activeTab === 'my-cargo' 
        ? '/api/marketplace/my-cargo' 
        : '/api/marketplace/all-offers';
      
      const response = await fetch(endpoint);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch cargo data');
      }
      
      // Transform API data to match CargoCard interface
      const transformedCargos = (result.data?.cargos || []).map((cargo: any) => ({
        id: cargo.id,
        userId: cargo.userId,
        title: cargo.title,
        route: `${cargo.pickup.country}, ${cargo.pickup.city} → ${cargo.delivery.country}, ${cargo.delivery.city}`,
        type: cargo.cargoType,
        weight: cargo.weight ? `${cargo.weight} kg` : '',
        volume: cargo.volume ? `${cargo.volume} m³` : '',
        price: cargo.estimatedValue ? `€${cargo.estimatedValue}` : '',
        poster: cargo.poster?.id ? 'Verified User' : 'Anonymous User',
        verified: true,
        urgency: cargo.isUrgent ? 'High' : 'Medium',
        loadingDate: new Date(cargo.pickup.date).toISOString().split('T')[0],
        deliveryDate: new Date(cargo.delivery.date).toISOString().split('T')[0],
        distance: '-- km',
        estimatedTime: '--'
      }));
      
      setCargos(transformedCargos);
    } catch (err) {
      console.error('Error fetching cargos:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCargos([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh cargo list
  const refreshCargos = () => {
    fetchCargos();
  };

  // Fetch cargos when component mounts or tab changes
  useEffect(() => {
    fetchCargos();
  }, [activeTab, isLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      const content = document.querySelector('.scroll-blur-content');
      if (content) {
        if (window.scrollY > 100) {
          content.classList.add('scrolling');
        } else {
          content.classList.remove('scrolling');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`min-h-screen bg-cover bg-center bg-fixed scroll-blur-container ${isScrolled ? 'scrolled' : ''}`}
      style={{
        backgroundImage: "linear-gradient(rgba(11, 11, 15, 0.3), rgba(11, 11, 15, 0.7)), url('/wallpaper.jpg')",
        filter: 'contrast(1.2) brightness(1.1)'
      }}
    >
      <TopBar />

      {/* MARKETPLACE */}
      <main className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 pt-16 scroll-blur-content">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">Piața — Toate Ofertele</h1>
          </div>
          
          {/* Tab Navigation + Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 transition text-sm">
                Delete Cargo
              </button>
              <span className="text-white/30">--</span>
              <button 
                onClick={() => { setIsAddCargoOpen(true); }}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 text-emerald-200 transition text-sm"
              >
                Add Cargo
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar value={searchValue} onChange={setSearchValue} />

          {/* Filters Row */}
          <CargoFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Offers grid */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              <span className="ml-2 text-white/60">Loading cargo...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-400 mb-2">Error: {error}</p>
                <button 
                  onClick={refreshCargos}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : cargos.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-white/60 mb-2">
                  {activeTab === 'my-cargo' ? 'No cargo posts found.' : 'No offers available.'}
                </p>
                {activeTab === 'my-cargo' && (
                  <button 
                    onClick={() => setIsAddCargoOpen(true)}
                    className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded-lg transition"
                  >
                    Post Your First Cargo
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cargos.map((cargo) => (
                <CargoCard key={cargo.id} cargo={cargo} onClick={setSelectedCargo} />
              ))}
            </div>
          )}
        </div>
      </main>


      {/* PostCargoModal */}
      <PostCargoModal 
        isOpen={isAddCargoOpen} 
        onClose={() => {
          setIsAddCargoOpen(false);
          refreshCargos(); // Refresh list after modal closes
        }} 
      />

      {/* Legacy mock modal - remove later */}
      {false && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setIsAddCargoOpen(false); }} />
          <div className="relative max-w-2xl w-full">
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
              {/* Editor Header */}
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
                  onClick={() => { setIsAddCargoOpen(false); }}
                  className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Close
                </button>
              </div>
              
              {/* Code Lines */}
              <div className="flex divide-x divide-white/10">
                <div className="bg-black/50 text-white/40 py-3 px-2 text-right select-none w-10 text-xs leading-6">
                  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
                </div>
                <div className="py-3 px-4 overflow-auto w-full bg-black/30 text-left text-sm leading-6">
                  <pre className="whitespace-pre text-white/90">
{`{`}
                    <br />
{`  "titlu": `}<input type="text" placeholder="Produse textile pentru export" className="bg-transparent border-none outline-none font-bold text-emerald-300 placeholder-emerald-300/50 w-80" />{`,`}
                    <br />
{`  "ridicare": "`}<input type="text" placeholder="București, RO" className="bg-transparent border-none outline-none text-white/90 placeholder-white/40 w-32" />{`",`}
                    <br />
{`  "livrare": "`}<input type="text" placeholder="Cluj-Napoca, RO" className="bg-transparent border-none outline-none text-white/90 placeholder-white/40 w-32" />{`",`}
                    <br />
{`  "greutateKg": `}<input type="number" placeholder="1200" className="bg-transparent border-none outline-none text-white/90 placeholder-white/40 w-16" />{`,`}
                    <br />
{`  "dataRidicare": "`}<input type="date" className="bg-transparent border-none outline-none text-white/90 w-32" />{`",`}
                    <br />
{`  "tipVehicul": "`}<select className="bg-transparent border-none outline-none text-white/90 w-24">
                      <option value="Prelată">Prelată</option>
                      <option value="Box">Box</option>
                      <option value="Frigorific">Frigorific</option>
                      <option value="Platformă">Platformă</option>
                    </select>{`",`}
                    <br />
{`  "pretEUR": `}<input type="number" placeholder="520" className="bg-transparent border-none outline-none text-white/90 placeholder-white/40 w-16" />{`,`}
                    <br />
{`  "notite": "`}<input type="text" placeholder="Încărcare laterală, 8 paleți" className="bg-transparent border-none outline-none text-white/90 placeholder-white/40 w-64" />{`"`}
                    <br />
{`}`}
                  </pre>
                </div>
              </div>
              
              {/* Terminal */}
              <div className="bg-black/40 p-3 border-t border-white/10 text-left text-sm">
                <div className="text-emerald-400"><span className="text-white/70">$</span> publică cargo</div>
                <div className="text-cyan-300">› Găsește transportatori... găsit 5 în raza de 50 km</div>
                <div className="text-emerald-400">› Status: draft pregătit — completează formularul pentru publicare</div>
              </div>
              
              {/* Status Bar */}
              <div className="px-3 py-1 border-t border-white/10 flex justify-between items-center text-white/50 text-xs">
                <div className="flex items-center gap-3">
                  <span>JSON</span><span>UTF-8</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Ln 9, Col 1</span><span>Spaces: 2</span><span>10 linii</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => { setIsAddCargoOpen(false); }}
                    className="h-10 px-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
                  >
                    Anulează
                  </button>
                  <button className="h-10 px-4 rounded-lg border border-blue-400/30 bg-blue-400/15 hover:bg-blue-400/20 text-blue-200 transition text-sm">
                    Salvează Draft
                  </button>
                  <button className="h-10 px-4 rounded-lg border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 text-emerald-300 transition text-sm font-medium">
                    Publică Cargo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setIsFiltersOpen(false); }} />
          <div className="relative max-w-md w-full">
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/60 backdrop-blur-md">
              {/* Editor Header */}
              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 mr-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
                  </div>
                  <div className="text-white/80 text-sm">filters-config.json</div>
                </div>
                <button 
                  onClick={() => { setIsFiltersOpen(false); }}
                  className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Close
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 bg-black/30">
                <h3 className="text-lg font-medium mb-6">Filtre de Căutare</h3>
            
            <div className="space-y-4">
              {/* All Countries */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Țară</label>
                <select className="w-full h-10 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm">
                  <option>All Countries</option>
                  <option>România</option>
                  <option>Germania</option>
                  <option>Franța</option>
                  <option>Italia</option>
                </select>
              </div>

              {/* Newest First */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Sortare</label>
                <select className="w-full h-10 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Distance: Near to Far</option>
                </select>
              </div>

              {/* All Types */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Tip Cargo</label>
                <select className="w-full h-10 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm">
                  <option>All Types</option>
                  <option>General</option>
                  <option>Fragile</option>
                  <option>Refrigerat</option>
                  <option>Lichid</option>
                  <option>Oversized</option>
                </select>
              </div>

              {/* All Urgency */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Urgență</label>
                <select className="w-full h-10 px-3 rounded-lg bg-white/[0.06] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm">
                  <option>All Urgency</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Min (€)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.06] border border-white/10 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Max (€)</label>
                  <input 
                    type="number" 
                    placeholder="10000"
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.06] border border-white/10 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
                  />
                </div>
              </div>
            </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <button 
                    className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => { setIsFiltersOpen(false); }}
                    className="px-6 py-2 rounded-lg border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 text-emerald-300 transition text-sm"
                  >
                    Aplică Filtrele
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cargo Detail Modal */}
      {selectedCargo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedCargo(null); }} />
          <div className="relative max-w-2xl w-full">
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
              {/* Editor Header */}
              <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 mr-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
                  </div>
                  <div className="text-white/80 text-sm">cargo-details.json</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => { setSelectedCargo(null); }}
                    className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              {/* Cargo Details - Normal Style */}
              <div className="py-6 px-6 bg-black/30 space-y-6">
                {/* Title */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Package className="h-6 w-6" />
                    {selectedCargo.title}
                  </h2>
                </div>

                {/* Transport Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Detalii Transport
                  </h3>
                  <div className="space-y-2 text-white/80">
                    <div><span className="text-white/60">Ridicare:</span> <span className="font-medium">{selectedCargo.route.split(' → ')[0]}</span></div>
                    <div><span className="text-white/60">Data ridicare:</span> <span className="font-medium">{selectedCargo.loadingDate}</span></div>
                    <div><span className="text-white/60">Livrare:</span> <span className="font-medium">{selectedCargo.route.split(' → ')[1]}</span></div>
                    <div><span className="text-white/60">Data livrare:</span> <span className="font-medium">{selectedCargo.deliveryDate}</span></div>
                  </div>
                </div>

                {/* Cargo Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Specificații Marfă
                  </h3>
                  <div className="space-y-2 text-white/80">
                    {selectedCargo.weight && <div><span className="text-white/60">Greutate:</span> <span className="font-medium">{selectedCargo.weight}</span></div>}
                    <div><span className="text-white/60">Tip vehicul:</span> <span className="font-medium">{selectedCargo.type}</span></div>
                    {selectedCargo.price && <div><span className="text-white/60">Preț:</span> <span className="font-medium text-emerald-400">{selectedCargo.price}</span></div>}
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informații Suplimentare
                  </h3>
                  <div className="space-y-2 text-white/80">
                    <div><span className="text-white/60">Postat de:</span> <span className="font-medium">{selectedCargo.poster}</span> {selectedCargo.verified && <span className="text-emerald-400">✓</span>}</div>
                    <div>
                      <span className="text-white/60">Distanță:</span> 
                      <span className="font-medium">{selectedCargo.distance}</span>
                      <a 
                        href={`https://www.google.com/maps/dir/${encodeURIComponent(selectedCargo.route.split(' → ')[0])}/${encodeURIComponent(selectedCargo.route.split(' → ')[1])}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer ml-2"
                      >
                        vezi link
                      </a>
                    </div>
                    <div><span className="text-white/60">Timp estimat:</span> <span className="font-medium">{selectedCargo.estimatedTime}</span></div>
                  </div>
                </div>
              </div>
              
              {/* Terminal */}
              <div className="bg-black/40 p-3 border-t border-white/10 text-left text-sm">
                <div className="text-emerald-400"><span className="text-white/70">$</span> vezi detalii cargo</div>
                <div className="text-cyan-300">› Se încarcă informațiile cargo...</div>
                <div className="text-emerald-400">› Status: gata pentru ofertă — {selectedCargo.verified ? 'poster verificat' : 'poster neverificat'}</div>
                <div className="text-white/70">› Acțiuni: trimite ofertă | chat | salvează | ignoră</div>
              </div>
              
              {/* Status Bar */}
              <div className="px-3 py-1 border-t border-white/10 flex justify-between items-center text-white/50 text-xs">
                <div className="flex items-center gap-3">
                  <span>JSON</span><span>UTF-8</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Ln 12, Col 1</span><span>Spaces: 2</span><span>12 lines</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                {selectedCargo?.userId === user?.id ? (
                  // Owner buttons - Edit/Delete
                  <div className="grid grid-cols-2 gap-3">
                    <button className="h-10 px-4 rounded-lg border border-blue-400/30 bg-blue-400/15 hover:bg-blue-400/20 text-blue-300 transition text-sm flex items-center justify-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button className="h-10 px-4 rounded-lg border border-red-400/30 bg-red-400/15 hover:bg-red-400/20 text-red-300 transition text-sm flex items-center justify-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                ) : (
                  // Non-owner buttons - Quote/Chat
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="h-10 px-4 rounded-lg border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 text-emerald-300 transition text-sm font-medium"
                    >
                      Trimite Ofertă
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCargo(null)
                        // TODO: Open chat only if user has active quotes with this cargo
                        window.dispatchEvent(new CustomEvent('openChat', { 
                          detail: { cargoId: selectedCargo.id, cargoTitle: selectedCargo.title }
                        }))
                      }}
                      className="h-10 px-4 rounded-lg border border-cyan-400/30 bg-cyan-400/15 hover:bg-cyan-400/20 text-cyan-200 transition text-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {selectedCargo && (
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          cargo={selectedCargo}
          onQuoteSubmitted={() => {
            setIsQuoteModalOpen(false);
            // TODO: Refresh quotes if needed
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-md bg-white/70" />
            <span className="text-white/70 text-sm">© 2025 Fletopia</span>
          </div>
          <div className="text-white/50 text-sm">
            <Link href="/" className="hover:text-white transition">Acasă</Link> · 
            <Link href="/marketplace" className="hover:text-white transition"> Piața</Link> · 
            <Link href="/settings" className="hover:text-white transition"> Setări</Link>
          </div>
        </div>
      </footer>
      
      <CursorSpotlight intensity="subtle" size={275} />
    </div>
  );
}