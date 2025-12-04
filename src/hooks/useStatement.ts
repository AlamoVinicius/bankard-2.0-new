import { useStatementService } from '@/services/statementService'
import { useSelectedAccount } from '@/stores/cardStore'

/**
 * Custom hook for statement/transactions
 * Automatically fetches statement for selected account
 */
export function useStatement() {
  const selectedAccount = useSelectedAccount()
  const { useStatementByAccount } = useStatementService()

  // Fetch statement for selected account
  const {
    data: statement,
    isLoading,
    error,
    refetch,
  } = useStatementByAccount(selectedAccount ?? undefined)

  return {
    // Data
    statement,
    transactions: statement?.transactions || [],
    balance: statement?.balance || 0,

    // States
    isLoading,
    error,
    hasStatement: !!statement,

    // Actions
    refetch,
  }
}
