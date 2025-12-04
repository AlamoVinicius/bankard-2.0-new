import { useEffect } from 'react'
import { useCardService } from '@/services/cardService'
import { useCardStore } from '@/stores/cardStore'
import { isCardActive } from '@/models/Card'
import type { Card } from '@/models/Card'

/**
 * Custom hook for card management
 * Combines service layer (TanStack Query) with state management (Zustand)
 * Handles business logic and user feedback
 */
export function useCard(document?: string) {
  const { useCardsByDocument } = useCardService()

  // Zustand store
  const {
    selectedCard,
    selectedAccount,
    availableCards,
    userDocument,
    setSelectedCard,
    setAvailableCards,
    setUserDocument,
    clearCardData,
  } = useCardStore()

  // Use document from parameter or store
  const effectiveDocument = document || userDocument

  // Fetch cards by document - React Query handles automatic fetching
  const {
    data: cards,
    isLoading,
    error,
    refetch,
  } = useCardsByDocument(effectiveDocument || '', !!effectiveDocument)

  // Update available cards when data changes
  useEffect(() => {
    if (cards) {
      // Filter only active cards (status: NORMAL)
      const activeCards = cards.filter(isCardActive)
      setAvailableCards(activeCards)

      // Auto-select first card if none selected
      if (!selectedCard && activeCards.length > 0) {
        setSelectedCard(activeCards[0])
      }
    }
  }, [cards, selectedCard, setAvailableCards, setSelectedCard])

  /**
   * Select a card
   * Automatically updates the selected account (business rule)
   */
  const selectCard = (card: Card) => {
    setSelectedCard(card)
  }

  /**
   * Load cards by document (CPF)
   */
  const loadCardsByDocument = async (document: string) => {
    setUserDocument(document)
    await refetch()
  }

  /**
   * Clear all card data (logout/reset)
   */
  const resetCards = () => {
    clearCardData()
  }

  return {
    // State
    selectedCard,
    selectedAccount,
    availableCards,
    userDocument,

    // Loading & Error states
    isLoading,
    error,

    // Actions
    selectCard,
    loadCardsByDocument,
    resetCards,
    refetch,
  }
}
