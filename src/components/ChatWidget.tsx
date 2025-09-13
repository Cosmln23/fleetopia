'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime'
import { useUser } from '@clerk/nextjs'
import { 
  useChatOpen, 
  useChatView, 
  useSelectedContact, 
  useActiveCargoId,
  useChatActions 
} from '@/stores/chatStore'

export default function ChatWidget() {
  const { user } = useUser()
  const { 
    isConnected, 
    messages,
    joinCargoChat, 
    leaveCargoChat, 
    sendMessage
  } = useSupabaseRealtime()
  
  // Zustand store state
  const isChatOpen = useChatOpen()
  const currentView = useChatView()
  const selectedContact = useSelectedContact()
  const activeCargoId = useActiveCargoId()
  const { closeChat, setCurrentView } = useChatActions()
  
  const [messageInput, setMessageInput] = useState('')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const isInsideChatWidget = target.closest('[data-chat-widget]')
      
      if (!isInsideChatWidget && isChatOpen) {
        closeChat()
      }
    }

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isChatOpen, closeChat])
  
  // Handle cargo chat joining when activeCargoId changes
  useEffect(() => {
    if (activeCargoId && selectedContact) {
      console.log('🔗 Joining cargo chat:', activeCargoId)
      joinCargoChat(activeCargoId)
    }
    
    return () => {
      if (activeCargoId) {
        leaveCargoChat(activeCargoId)
      }
    }
  }, [activeCargoId, selectedContact, joinCargoChat, leaveCargoChat])

  // Handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageInput.trim() || !activeCargoId) return
    
    // Send message via Supabase (DB-first approach)
    sendMessage(activeCargoId, messageInput.trim())
    
    // Clear input
    setMessageInput('')
  }

  return (
    <>
      {/* Sticky Chat Icon */}
      <button 
        data-chat-widget
        onClick={() => {
          if (!isChatOpen) {
            setCurrentView('history')
          } else {
            closeChat()
          }
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
              onClick={closeChat}
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
                {/* Connection Status */}
                {!isConnected && (
                  <div className="flex items-center justify-center py-2">
                    <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-lg px-3 py-2">
                      <div className="text-yellow-400 text-xs">Se conectează la chat...</div>
                    </div>
                  </div>
                )}
                
                {/* Real Chat Messages */}
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className={`flex gap-2 ${message.senderId === user?.id ? 'justify-end' : ''}`}>
                      {message.senderId !== user?.id && (
                        <div className={`h-6 w-6 rounded-full ${selectedContact?.color || 'bg-emerald-500'} flex items-center justify-center text-xs text-white font-medium flex-shrink-0`}>
                          {message.senderRole?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                      )}
                      <div className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        message.senderId === user?.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white/10 border border-white/10 text-white'
                      }`}>
                        <div className="text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-emerald-100' : 'text-white/50'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString('ro-RO', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      {message.senderId === user?.id && (
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                          EU
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  /* Empty chat state */
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-white/40 text-sm mb-2">Chat gol</div>
                      <div className="text-white/30 text-xs">
                        {isConnected ? 'Trimite primul mesaj' : 'Se conectează...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input - Only show in chat view */}
          {currentView === 'chat' && (
            <div className="p-3 border-t border-white/10 bg-black/20">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={isConnected ? "Scrieți un mesaj..." : "Se conectează..."}
                  disabled={!isConnected}
                  className="flex-1 px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-white placeholder-white/40 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!isConnected || !messageInput.trim()}
                  className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  )
}