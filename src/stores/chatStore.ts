import { create } from 'zustand'

interface Contact {
  id: string
  name: string
  avatar: string
  color: string
}

interface ChatState {
  // UI State
  isChatOpen: boolean
  currentView: 'history' | 'chat'
  selectedContact: Contact | null
  activeCargoId: string | null
  
  // Actions
  openChat: (cargoId: string, cargoTitle: string) => void
  closeChat: () => void
  setCurrentView: (view: 'history' | 'chat') => void
  setSelectedContact: (contact: Contact | null) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  isChatOpen: false,
  currentView: 'history',
  selectedContact: null,
  activeCargoId: null,
  
  // Actions
  openChat: (cargoId: string, cargoTitle: string) => {
    const newContact: Contact = {
      id: cargoId,
      name: `Chat despre: ${cargoTitle}`,
      avatar: 'CG',
      color: 'bg-cyan-400/15 border-cyan-400/30 text-cyan-300'
    }
    
    set({
      isChatOpen: true,
      currentView: 'chat',
      selectedContact: newContact,
      activeCargoId: cargoId
    })
    
    console.log('🎯 Chat opened for cargo:', cargoId, cargoTitle)
  },
  
  closeChat: () => {
    set({
      isChatOpen: false,
      currentView: 'history',
      selectedContact: null,
      activeCargoId: null
    })
    
    console.log('📱 Chat closed')
  },
  
  setCurrentView: (view: 'history' | 'chat') => {
    set({ currentView: view })
  },
  
  setSelectedContact: (contact: Contact | null) => {
    set({ selectedContact: contact })
  },
  
  resetChat: () => {
    set({
      isChatOpen: false,
      currentView: 'history',
      selectedContact: null,
      activeCargoId: null
    })
  }
}))

// Selector hooks for performance
export const useChatOpen = () => useChatStore(state => state.isChatOpen)
export const useChatView = () => useChatStore(state => state.currentView)
export const useSelectedContact = () => useChatStore(state => state.selectedContact)
export const useActiveCargoId = () => useChatStore(state => state.activeCargoId)

// Action hooks
export const useChatActions = () => useChatStore(state => ({
  openChat: state.openChat,
  closeChat: state.closeChat,
  setCurrentView: state.setCurrentView,
  setSelectedContact: state.setSelectedContact,
  resetChat: state.resetChat
}))