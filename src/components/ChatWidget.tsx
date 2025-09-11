'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, ArrowLeft } from 'lucide-react'

export default function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentView, setCurrentView] = useState('history') // 'history' or 'chat'
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const isInsideChatWidget = target.closest('[data-chat-widget]')
      
      if (!isInsideChatWidget && isChatOpen) {
        setIsChatOpen(false)
        setCurrentView('history') // Reset to history when closing
      }
    }

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isChatOpen])

  return (
    <>
      {/* Sticky Chat Icon */}
      <button 
        data-chat-widget
        onClick={() => {
          if (!isChatOpen) {
            setCurrentView('history') // Reset to history when opening
          }
          setIsChatOpen(!isChatOpen)
        }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
      >
        <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-cyan-400 text-[10px] font-medium text-black flex items-center justify-center">3</span>
      </button>

      {/* Chat Widget */}
      {isChatOpen && (
        <div data-chat-widget className="fixed bottom-24 right-6 z-50 w-[640px] h-96 bg-black/60 rounded-xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-md flex flex-col">
          {/* Header */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              {currentView === 'chat' && (
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentView('history')
                  }}
                  className="mr-3 text-white/70 hover:text-white p-1 rounded hover:bg-white/5 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="flex items-center gap-2 mr-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60"></div>
              </div>
              <div className="text-white/80 text-sm">
                {currentView === 'history' ? 'message-history.json' : `chat-${selectedContact?.id || 'session'}.json`}
              </div>
            </div>
            <button 
              onClick={() => {
                setIsChatOpen(false)
                setCurrentView('history') // Reset to history when closing
              }}
              className="text-white/70 hover:text-white px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition text-xs inline-flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>

          {/* Content */}
          <div className={`overflow-y-auto bg-black/30 ${currentView === 'history' ? 'flex-1' : 'h-64'}`}>
            {currentView === 'history' ? (
              /* Conversations History */
              <div className="p-4 space-y-3">
                {/* Conversation 1 - Most Recent */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedContact({id: 'mt', name: 'Mihai Transport SRL', avatar: 'MT', color: 'bg-emerald-500'})
                    setCurrentView('chat')
                  }}
                  className="p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm text-white font-medium flex-shrink-0">
                      MT
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-white text-sm">Mihai Transport SRL</div>
                        <div className="text-xs text-white/50">2h</div>
                      </div>
                      <div className="text-sm text-white/70 truncate">Salut! Vă confirm că am preluat cargo-ul...</div>
                      <div className="text-xs text-white/40 mt-1">Ultima activitate: Acum 2 ore</div>
                    </div>
                  </div>
                </div>

                {/* Conversation 2 */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedContact({id: 'el', name: 'Elena Logistics', avatar: 'EL', color: 'bg-blue-500'})
                    setCurrentView('chat')
                  }}
                  className="p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-sm text-white font-medium flex-shrink-0">
                      EL
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-white text-sm">Elena Logistics</div>
                        <div className="text-xs text-white/50">ieri</div>
                      </div>
                      <div className="text-sm text-white/70 truncate">Mulțumesc pentru colaborare! Cargo livrat...</div>
                      <div className="text-xs text-white/40 mt-1">Ultima activitate: Ieri la 16:30</div>
                    </div>
                  </div>
                </div>

                {/* Conversation 3 */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedContact({id: 'dt', name: 'Dan Transport', avatar: 'DT', color: 'bg-purple-500'})
                    setCurrentView('chat')
                  }}
                  className="p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-sm text-white font-medium flex-shrink-0">
                      DT
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-white text-sm">Dan Transport</div>
                        <div className="text-xs text-white/50">3 zile</div>
                      </div>
                      <div className="text-sm text-white/70 truncate">Pot să preiau cargo-ul pentru...</div>
                      <div className="text-xs text-white/40 mt-1">Ultima activitate: 3 zile în urmă</div>
                    </div>
                  </div>
                </div>

                {/* Conversation 4 */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedContact({id: 'at', name: 'Alexandru Transport', avatar: 'AT', color: 'bg-orange-500'})
                    setCurrentView('chat')
                  }}
                  className="p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-sm text-white font-medium flex-shrink-0">
                      AT
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-white text-sm">Alexandru Transport</div>
                        <div className="text-xs text-white/50">1 săpt</div>
                      </div>
                      <div className="text-sm text-white/70 truncate">Bună ziua! Am văzut cargo-ul pentru...</div>
                      <div className="text-xs text-white/40 mt-1">Ultima activitate: 1 săptămână în urmă</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Individual Chat */
              <div className="p-3 space-y-3">
                {/* Contact's message */}
                <div className="flex gap-2">
                  <div className={`h-6 w-6 rounded-full ${selectedContact?.color || 'bg-emerald-500'} flex items-center justify-center text-xs text-white font-medium flex-shrink-0`}>
                    {selectedContact?.avatar || 'AS'}
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 max-w-[80%] shadow-sm border border-white/10">
                    <div className="text-sm text-white">Bună ziua! Cu ce vă pot ajuta astăzi?</div>
                    <div className="text-xs text-white/50 mt-1">10:30</div>
                  </div>
                </div>

                {/* My message */}
                <div className="flex gap-2 justify-end">
                  <div className="bg-emerald-500 text-white rounded-lg px-3 py-2 max-w-[80%]">
                    <div className="text-sm">Am o întrebare despre procesul de transport</div>
                    <div className="text-xs text-emerald-100 mt-1">10:32</div>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                    EU
                  </div>
                </div>

                {/* Contact's response */}
                <div className="flex gap-2">
                  <div className={`h-6 w-6 rounded-full ${selectedContact?.color || 'bg-emerald-500'} flex items-center justify-center text-xs text-white font-medium flex-shrink-0`}>
                    {selectedContact?.avatar || 'AS'}
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-2 max-w-[80%] shadow-sm border border-white/10">
                    <div className="text-sm text-white">Desigur! Vă pot explica tot procesul. Despre ce anume doriți să aflați?</div>
                    <div className="text-xs text-white/50 mt-1">10:33</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input - Only show in chat view */}
          {currentView === 'chat' && (
            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Scrieți un mesaj..."
                  className="flex-1 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-white placeholder-white/40"
                />
                <button className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition">
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}