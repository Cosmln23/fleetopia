"use client";
import React, { useEffect, useState } from "react";
import { FooterSection, SettingsSidebar, ProfileGeneralSection, CompanyVerificationSection, OperationalAISection, SubscriptionBillingSection, PreferencesSecuritySection } from "@/shared/ui";

type SettingsKey = Parameters<typeof SettingsSidebar>[0]["active"];

export default function SettingsPage() {
  const [active, setActive] = useState<SettingsKey>("profile");

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } as IntersectionObserverInit;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, observerOptions);
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="antialiased text-gray-100 bg-black pb-20">
      <section className="min-h-screen bg-[url(https://images.unsplash.com/photo-1659115516377-25ed306a3551?w=2560&q=80)] bg-cover pt-20 pb-20">
        <div className="max-w-7xl mr-auto ml-auto pt-8 pr-6 pb-8 pl-6">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Settings</h1>
            <p className="text-gray-400">Gestionați contul, verificarea și preferințele aplicației</p>
          </div>
          <div className="flex gap-6">
            <SettingsSidebar active={active} onChange={setActive} />
            <div className="flex-1">
              <div className="glass-card rounded-xl pt-8 pr-8 pb-8 pl-8">
                {active === "profile" && <ProfileGeneralSection />}
                {active === "company" && <CompanyVerificationSection />}
                {active === "operational" && <OperationalAISection />}
                {active === "subscription" && <SubscriptionBillingSection />}
                {active === "preferences" && <PreferencesSecuritySection />}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
}


