"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MarketplaceHero, MarketplaceTabs, MarketplaceFilters, CargoCard, AddCargoModal, CargoDetailModal, FooterSection, ScoutStatus } from "@/shared/ui";
import { ScoutBar } from "@/shared/ui/marketplace/ScoutBar";
import type { CargoDetailData } from "@/shared/ui/marketplace/CargoDetailModal";

type TabKey = Parameters<typeof MarketplaceTabs>[0]["active"];

type Cargo = {
  id: number;
  title: string;
  company: string;
  price: string;
  time: string;
  from: string;
  to: string;
  type: string;
  details: string;
  urgency: "Low" | "Medium" | "High";
};

const initialCargo: Cargo[] = [
  { id: 1, title: "Electronics Shipment", company: "TransCorp", price: "€1,850", time: "2 hours ago", from: "NL Amsterdam 1012", to: "DE Berlin 10115", type: "Pallets", details: "Pallets • 2,500 kg • 12.5 m³", urgency: "Medium" },
  { id: 2, title: "Food & Beverages", company: "FoodLogistics", price: "€3,200", time: "5 hours ago", from: "DE Berlin 10115", to: "FR Paris 75001", type: "Container", details: "Container • 15,000 kg • 68.0 m³", urgency: "High" },
  { id: 3, title: "Construction Materials", company: "BuildCorp", price: "€2,750", time: "1 day ago", from: "FR Paris 75001", to: "IT Rome 00118", type: "Bulk", details: "Bulk • 8,000 kg", urgency: "Low" },
  { id: 4, title: "Medical Supplies", company: "MedTrans", price: "€950", time: "3 hours ago", from: "BE Brussels 1000", to: "NL Utrecht 3511", type: "Refrigerated", details: "Refrigerated • 1,200 kg • 5.2 m³", urgency: "High" },
  { id: 5, title: "Automotive Parts", company: "AutoLogistics", price: "€2,150", time: "6 hours ago", from: "DE Munich 80331", to: "FR Lyon 69001", type: "Pallets", details: "Pallets • 3,800 kg • 18.3 m³", urgency: "Low" },
  { id: 6, title: "Textile Products", company: "FashionFreight", price: "€1,980", time: "8 hours ago", from: "IT Milan 20121", to: "DE Hamburg 20095", type: "Container", details: "Container • 6,500 kg • 42.8 m³", urgency: "Medium" },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all-offers");
  const [filters, setFilters] = useState({ country: "", sort: "newest", type: "", urgency: "", date: "", min: "", max: "", query: "" });
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailHtml, setDetailHtml] = useState<string>("");
  const [detailData, setDetailData] = useState<CargoDetailData | undefined>(undefined);
  // Scout UI state (UI-only)
  const [scoutLocationText, setScoutLocationText] = useState<string>("");
  const [scoutCoords, setScoutCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [scoutRadiusKm, setScoutRadiusKm] = useState<number>(150);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } as IntersectionObserverInit;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, observerOptions);
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filters]);

  const filteredCargo = useMemo(() => {
    let list = [...initialCargo];
    if (filters.query) list = list.filter((c) => c.title.toLowerCase().includes(filters.query.toLowerCase()) || c.company.toLowerCase().includes(filters.query.toLowerCase()));
    if (filters.type) list = list.filter((c) => c.type.toLowerCase() === filters.type);
    if (filters.urgency) list = list.filter((c) => c.urgency.toLowerCase() === filters.urgency);
    if (filters.sort === "price-high") list.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, "")));
    if (filters.sort === "price-low") list.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, "")));
    // sort "scout" left as-is (UI-only placeholder)
    return list;
  }, [filters]);

  const isScoutActive = Boolean((scoutCoords || scoutLocationText) && scoutRadiusKm);

  // Ensure sort switches to scout when active, and revert on reset
  useEffect(() => {
    if (isScoutActive) {
      setFilters((prev) => (prev.sort === "scout" ? prev : { ...prev, sort: "scout" }));
    }
  }, [isScoutActive]);

  const useCurrentLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setScoutCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // noop UI-only; could show a toast later
        }
      );
    }
  };

  const resetScout = () => {
    setScoutCoords(undefined);
    setScoutLocationText("");
    if (filters.sort === "scout") setFilters({ ...filters, sort: "newest" });
  };

  const openDetail = (id: number) => {
    const c = initialCargo.find((x) => x.id === id);
    if (!c) return;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(c.from)}&destination=${encodeURIComponent(c.to)}`;
    const data: CargoDetailData = {
      id: String(c.id),
      status: "PROGRAMAT",
      title: c.title,
      route: {
        from: { address: c.from, contactName: "Contact Pickup", contactPhone: "+40 712 345 678", notes: "Rampa 5" },
        to: { address: c.to, contactName: "Contact Delivery", contactPhone: "+40 745 111 222", notes: "Anunțați cu 15 min înainte" },
      },
      metrics: { mapsUrl },
      schedule: { loadWindow: "azi 08:00 - 09:00", eta: "azi 15:30", deadline: "azi 18:00" },
      cargo: { description: c.type, special: [] },
      resources: { vehicleType: "Van 3.5t", priceText: c.price },
    };
    setDetailData(data);
    setDetailHtml("");
    setDetailOpen(true);
  };

  return (
    <div className="antialiased text-gray-100 bg-black pb-20">
      <MarketplaceHero>
        <MarketplaceTabs active={activeTab} onChange={(t) => setActiveTab(t)} onAddCargo={() => setAddOpen(true)} />
        <div className="mt-4 mb-4">
          <ScoutBar
            locationText={scoutLocationText}
            onLocationTextChange={setScoutLocationText}
            onUseCurrentLocation={useCurrentLocation}
            radiusKm={scoutRadiusKm}
            onRadiusChange={(v) => { setScoutRadiusKm(v); }}
            active={isScoutActive}
            onReset={resetScout}
          />
        </div>
        <MarketplaceFilters values={filters} onChange={setFilters} onClear={() => setFilters({ country: "", sort: "newest", type: "", urgency: "", date: "", min: "", max: "", query: "" })} />
        <ScoutStatus active={isScoutActive} radiusKm={scoutRadiusKm} locationLabel={scoutLocationText || (scoutCoords ? "Locația curentă" : "")} resultsCount={filteredCargo.length} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll in-view">
          {filteredCargo.map((c) => (
            <CargoCard key={c.id} id={c.id} title={c.title} postedAgo={c.time} from={c.from} to={c.to} details={c.details} price={c.price} company={c.company} urgency={c.urgency} onClick={() => openDetail(c.id)} />
          ))}
        </div>
      </MarketplaceHero>
      <FooterSection />
      <AddCargoModal open={addOpen} onClose={() => setAddOpen(false)} />
      <CargoDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        contentHtml={detailHtml}
        data={detailData}
        onSendQuote={() => { /* UI-only */ setDetailOpen(false); }}
        onChat={() => { /* UI-only */ setDetailOpen(false); }}
      />
    </div>
  );
}


