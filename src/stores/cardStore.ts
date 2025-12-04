import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card } from '@/models/Card'

/**
 * Card Store State
 */
interface CardState {
  // Selected card (current active card)
  selectedCard: Card | null

  // Selected account (derived from selected card)
  selectedAccount: number | null

  // All available cards
  availableCards: Card[]

  // User document (CPF) for fetching cards
  userDocument: string | null

  // Actions
  setSelectedCard: (card: Card | null) => void
  setAvailableCards: (cards: Card[]) => void
  setUserDocument: (document: string) => void
  clearCardData: () => void
}

/**
 * Zustand store for card and account management
 *
 * Business Rule: When a card is selected, the account is automatically updated
 * since accounts are defined by cards (card.account)
 */
export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      // Initial state
      selectedCard: null,
      selectedAccount: null,
      availableCards: [],
      userDocument: null,

      // Set selected card and automatically update the selected account
      setSelectedCard: (card) =>
        set({
          selectedCard: card,
          selectedAccount: card?.account ?? null,
        }),

      // Set all available cards
      setAvailableCards: (cards) =>
        set({ availableCards: cards }),

      // Set user document (CPF)
      setUserDocument: (document) =>
        set({ userDocument: document }),

      // Clear all card data
      clearCardData: () =>
        set({
          selectedCard: null,
          selectedAccount: null,
          availableCards: [],
          userDocument: null,
        }),
    }),
    {
      name: 'bankard-card-storage', // LocalStorage key
      partialize: (state) => ({
        // Only persist selected card and user document
        selectedCard: state.selectedCard,
        selectedAccount: state.selectedAccount,
        userDocument: state.userDocument,
      }),
    }
  )
)

/**
 * Selector hooks for better performance
 */
export const useSelectedCard = () => useCardStore((state) => state.selectedCard)
export const useSelectedAccount = () => useCardStore((state) => state.selectedAccount)
export const useAvailableCards = () => useCardStore((state) => state.availableCards)
export const useUserDocument = () => useCardStore((state) => state.userDocument)
