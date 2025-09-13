'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useUser } from '@clerk/nextjs'

interface ChatMessage {
  id: string
  content: string
  senderId: string
  senderRole?: string
  threadId: string
  cargoId?: string
  createdAt: string
  messageType: string
}

interface UseSupabaseRealtimeOptions {
  autoConnect?: boolean
}

export function useSupabaseRealtime(options: UseSupabaseRealtimeOptions = {}) {
  const { user } = useUser()
  const { autoConnect = true } = options
  
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const channelRef = useRef<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [activeCargoId, setActiveCargoId] = useState<string | null>(null)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  
  // Initialize Supabase client
  useEffect(() => {
    if (!autoConnect || !user) return
    
    const initializeSupabase = async () => {
      try {
        // Get JWT token for Realtime auth
        const tokenResponse = await fetch('/api/realtime/token')
        if (!tokenResponse.ok) {
          throw new Error('Failed to get realtime token')
        }
        
        const { token } = await tokenResponse.json()
        
        // Create Supabase client
        supabaseRef.current = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false
            },
            realtime: {
              params: {
                eventsPerSecond: 10
              }
            }
          }
        )
        
        // Set auth token for Realtime
        supabaseRef.current.realtime.setAuth(token)
        
        setIsConnected(true)
        console.log('🔌 Connected to Supabase Realtime')
        
      } catch (error) {
        console.error('Failed to initialize Supabase Realtime:', error)
        setIsConnected(false)
      }
    }
    
    initializeSupabase()
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
      if (supabaseRef.current) {
        supabaseRef.current.removeAllChannels()
      }
    }
  }, [autoConnect, user])
  
  // Join cargo chat room
  const joinCargoChat = async (cargoId: string) => {
    if (!supabaseRef.current || !user) {
      console.error('Supabase not initialized or user not authenticated')
      return
    }
    
    try {
      console.log(`🏠 Joining cargo chat: ${cargoId}`)
      
      // Load existing messages from database
      const response = await fetch(`/api/chat/${cargoId}/messages`)
      if (response.ok) {
        const result = await response.json()
        const dbMessages: ChatMessage[] = result.data.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderRole: msg.senderRole,
          threadId: result.data.threadId,
          cargoId: cargoId,
          createdAt: msg.createdAt,
          messageType: msg.messageType || 'text'
        }))
        
        // Set thread ID and messages
        setActiveThreadId(result.data.threadId)
        setMessages(prev => [
          ...prev.filter(msg => msg.cargoId !== cargoId),
          ...dbMessages
        ])
        
        // Unsubscribe from previous channel
        if (channelRef.current) {
          channelRef.current.unsubscribe()
        }
        
        // Subscribe to realtime updates for this thread
        channelRef.current = supabaseRef.current
          .channel(`cargo-${cargoId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'ChatMessage',
              filter: `threadId=eq.${result.data.threadId}`
            },
            (payload) => {
              console.log('📨 New message received:', payload.new)
              const newMessage: ChatMessage = {
                id: payload.new.id,
                content: payload.new.content,
                senderId: payload.new.senderId,
                threadId: payload.new.threadId,
                cargoId: cargoId,
                createdAt: payload.new.createdAt,
                messageType: payload.new.messageType || 'text'
              }
              
              setMessages(prev => {
                // Avoid duplicates
                const exists = prev.some(msg => msg.id === newMessage.id)
                if (exists) return prev
                return [...prev, newMessage]
              })
            }
          )
          .subscribe((status) => {
            console.log('📡 Subscription status:', status)
          })
        
        setActiveCargoId(cargoId)
      } else {
        console.error('Failed to load messages:', response.status)
      }
      
    } catch (error) {
      console.error('Error joining cargo chat:', error)
    }
  }
  
  // Leave cargo chat room
  const leaveCargoChat = (cargoId: string) => {
    console.log(`🚪 Leaving cargo chat: ${cargoId}`)
    
    if (channelRef.current) {
      channelRef.current.unsubscribe()
      channelRef.current = null
    }
    
    if (activeCargoId === cargoId) {
      setActiveCargoId(null)
      setActiveThreadId(null)
    }
  }
  
  // Send chat message (DB-first approach)
  const sendMessage = async (cargoId: string, content: string) => {
    if (!user) return
    
    try {
      console.log('💬 Sending message:', { cargoId, content })
      
      // Save to database - Realtime will notify all subscribers
      const response = await fetch(`/api/chat/${cargoId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content,
          messageType: 'text'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const result = await response.json()
      console.log('✅ Message sent successfully:', result.data.message.id)
      
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
  
  // Get messages for current cargo
  const getCurrentCargoMessages = () => {
    return activeCargoId 
      ? messages.filter(msg => msg.cargoId === activeCargoId)
      : []
  }
  
  // Clear messages for specific cargo
  const clearCargoMessages = (cargoId: string) => {
    setMessages(prev => prev.filter(msg => msg.cargoId !== cargoId))
  }
  
  return {
    isConnected,
    messages: getCurrentCargoMessages(),
    allMessages: messages,
    activeCargoId,
    activeThreadId,
    joinCargoChat,
    leaveCargoChat,
    sendMessage,
    clearCargoMessages
  }
}