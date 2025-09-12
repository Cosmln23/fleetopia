'use client'

import React from 'react'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'all-offers', label: 'ALL OFFERS' },
    { id: 'my-cargo', label: 'MY CARGO' },
    { id: 'my-quotes', label: 'MY QUOTES' },
    { id: 'active-deals', label: 'ACTIVE DEALS' }
  ]

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.id}>
          <button 
            onClick={() => onTabChange(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30'
                : 'border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition'
            }`}
          >
            {tab.label}
          </button>
          {index < tabs.length - 1 && (
            <span className="text-white/30 mx-1 hidden sm:inline">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}