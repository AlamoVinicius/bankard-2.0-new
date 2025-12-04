import { useAccountService } from '@/services/accountService'
import type { Card, CardWithBalance } from '@/models/Card'

/**
 * Custom hook for fetching card balance
 * Gets the account balance for a specific card using the card's account number
 */
export function useCardBalance(card: Card | undefined | null) {
  const { useAccountBalance } = useAccountService()

  // Fetch balance using the card's account number
  const {
    data: accountData,
    isLoading,
    error,
    refetch,
  } = useAccountBalance(card?.account, !!card)

  // Enrich card with balance information
  const cardWithBalance: CardWithBalance | undefined = card
    ? {
        ...card,
        balance: accountData?.available,
        balanceLoading: isLoading,
      }
    : undefined

  return {
    // Enriched card data
    cardWithBalance,

    // Account data (if needed separately)
    accountData,

    // Loading & Error states
    isLoading,
    error,

    // Balance value (convenience)
    balance: accountData?.available,

    // Actions
    refetchBalance: refetch,
  }
}
