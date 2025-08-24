"use client";
import React, { useEffect } from "react";
import { HeroSection, QuickActionsSection, HowItWorksSection, TestimonialsSection, FooterSection } from "../../shared/ui";

export default function Home() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } as IntersectionObserverInit;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, observerOptions);
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="antialiased text-gray-100 bg-black pb-20">
      {/* TopNavbar & BottomNav vin din (app)/layout */}
      <HeroSection />
      <QuickActionsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}


