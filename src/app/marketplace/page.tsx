'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import CursorSpotlight from '@/components/CursorSpotlight';
import TabNavigation from '@/components/TabNavigation';
import SearchBar from '@/components/SearchBar';
import CargoFilters from '@/components/CargoFilters';
import CargoCard from '@/components/CargoCard';
import Link from 'next/link';
import { SlidersHorizontal, MapPin, Eye, CheckCircle, Clock3, FileDown, Shield, Calendar, Truck, MessageCircle, Heart, X } from 'lucide-react';

export default function MarketplacePage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAddCargoOpen, setIsAddCargoOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // New state for components
  const [activeTab, setActiveTab] = useState('all-offers');
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});

  // Mock data pentru cargo cards
  const mockCargos = [
    {
      id: 1,
      title: 'Produse textile pentru export',
      route: 'RO, București, 100001 → RO, Cluj-Napoca, 400001',
      type: 'General',
      weight: '1200 kg',
      volume: '15.5 m³',
      price: '€520',
      poster: 'Alexandru Transport SRL',
      verified: true,
      urgency: 'Medium',
      loadingDate: '2025-01-15',
      deliveryDate: '2025-01-17',
      distance: '432 km',
      estimatedTime: '5h 45m'
    },
    {
      id: 2,
      title: 'Produse alimentare refrigerate',
      route: 'RO, Timișoara, 300001 → RO, Oradea, 410001',
      type: 'Refrigerat',
      weight: '450 kg',
      volume: '8.2 m³',
      price: '€210',
      poster: 'Fresh Food Express',
      verified: false,
      urgency: 'High',
      loadingDate: '2025-01-12',
      deliveryDate: '2025-01-13',
      distance: '156 km',
      estimatedTime: '2h 30m'
    },
    {
      id: 3,
      title: 'Echipamente industriale',
      route: 'RO, Iași, 700001 → RO, Brașov, 500001',
      type: 'Oversized',
      weight: '800 kg',
      volume: '22.1 m³',
      price: '€430',
      poster: 'Industrial Logistics Co',
      verified: true,
      urgency: 'Low',
      loadingDate: '2025-01-20',
      deliveryDate: '2025-01-22',
      distance: '298 km',
      estimatedTime: '4h 15m'
    }
  ];

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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mockCargos.map((cargo) => (
            <CargoCard key={cargo.id} cargo={cargo} onClick={setSelectedCargo} />
          ))}
        </div>
      </main>


      {/* Add Cargo Modal */}
      {isAddCargoOpen && (
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
              
              {/* Code Lines */}
              <div className="flex divide-x divide-white/10">
                <div className="bg-black/50 text-white/40 py-3 px-2 text-right select-none w-10 text-xs leading-6">
                  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
                </div>
                <div className="py-3 px-4 overflow-auto w-full bg-black/30 text-left text-sm leading-6">
                  <pre className="whitespace-pre text-white/90">
{`{
  "titlu": `}<span className="font-bold">{selectedCargo.title}</span>{`,
  "ridicare": "`}<span className="font-bold">{selectedCargo.route.split(' → ')[0]}</span>{`",
  "livrare": "`}<span className="font-bold">{selectedCargo.route.split(' → ')[1]}</span>{`",
  "greutateKg": `}<span className="font-bold">{selectedCargo.weight.replace(' kg', '')}</span>{`,
  "dataRidicare": "`}<span className="font-bold">{selectedCargo.loadingDate}</span>{`",
  "dataLivrare": "`}<span className="font-bold">{selectedCargo.deliveryDate}</span>{`",
  "tipVehicul": "`}<span className="font-bold">{selectedCargo.type}</span>{`",
  "pretEUR": `}<span className="font-bold">{selectedCargo.price.replace('€', '')}</span>{`,
  "poster": "`}<span className="font-bold">{selectedCargo.poster}</span>{`",
  "verificat": `}<span className="font-bold">{selectedCargo.verified}</span>{`,
  "distanta": "`}<span className="font-bold">{selectedCargo.distance}</span>{`", `}<a 
                      href={`https://www.google.com/maps/dir/${encodeURIComponent(selectedCargo.route.split(' → ')[0])}/${encodeURIComponent(selectedCargo.route.split(' → ')[1])}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                    >vezi link</a>{`
  "timpEstimat": "`}<span className="font-bold">{selectedCargo.estimatedTime}</span>{`"
}`}
                  </pre>
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
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-10 px-4 rounded-lg border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 text-emerald-300 transition text-sm font-medium">
                    Trimite Ofertă
                  </button>
                  <button className="h-10 px-4 rounded-lg border border-cyan-400/30 bg-cyan-400/15 hover:bg-cyan-400/20 text-cyan-200 transition text-sm flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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