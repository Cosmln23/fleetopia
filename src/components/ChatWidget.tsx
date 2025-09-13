'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, ArrowLeft, AlertTriangle } from 'lucide-react'

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

    const handleOpenChat = (event: CustomEvent) => {
      const { cargoId, cargoTitle } = event.detail
      console.log('Opening chat for cargo:', cargoId, cargoTitle)
      
      // Create a new contact based on cargo info
      const newContact = {
        id: cargoId,
        name: `Chat despre: ${cargoTitle}`,
        avatar: 'CG',
        color: 'bg-cyan-400/15 border-cyan-400/30 text-cyan-300'
      }
      
      setSelectedContact(newContact)
      setCurrentView('chat')
      setIsChatOpen(true)
    }

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    // Listen for chat open events from QuoteModal
    window.addEventListener('openChat', handleOpenChat as EventListener)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('openChat', handleOpenChat as EventListener)
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
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-emerald-400/15 hover:bg-emerald-400/20 border border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
      >
        <MessageCircle className="h-6 w-6 text-emerald-300 group-hover:scale-110 transition-transform" />
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
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-white/40 text-sm mb-2">Nu există conversații</div>
                    <div className="text-white/30 text-xs">Conversațiile vor apărea aici după trimiterea ofertelor</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Individual Chat */
              <div className="p-3 space-y-3">
                {/* Quote Message - Special */}
                {selectedContact?.id?.startsWith('cmf') && (
                  <div className="flex gap-2 justify-end">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg px-3 py-2 max-w-[80%] border border-emerald-400/30">
                      <div className="text-sm font-medium">📋 Ofertă trimisă!</div>
                      <div className="text-sm mt-1">Am trimis o ofertă pentru acest cargo.</div>
                      <div className="text-xs text-emerald-100 mt-2">Acum {Math.floor(Math.random() * 10) + 1} min</div>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                      EU
                    </div>
                  </div>
                )}
                
                {/* Empty chat state */}
                {!selectedContact?.id?.startsWith('cmf') && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-white/40 text-sm mb-2">Chat gol</div>
                      <div className="text-white/30 text-xs">Conversația va începe aici</div>
                    </div>
                  </div>
                )}
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