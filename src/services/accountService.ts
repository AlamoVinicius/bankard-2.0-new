import { useQuery } from '@tanstack/react-query'
import { accountRepository } from '@/repositories/accountRepository'

/**
 * Query key factory for accounts
 */
export const accountKeys = {
  all: ['accounts'] as const,
  balance: (accountId: number) => [...accountKeys.all, 'balance', accountId] as const,
}

/**
 * Account Service
 * TanStack Query wrappers for account-related operations
 */
export function useAccountService() {
  /**
   * Query: Get account balance by account ID
   */
  const useAccountBalance = (accountId: number | undefined, enabled = true) => {
    return useQuery({
      queryKey: accountKeys.balance(accountId!),
      queryFn: () => accountRepository.getBalance(accountId!),
      enabled: !!accountId && enabled,
      staleTime: 2 * 60 * 1000, // 2 minutes - balance changes more frequently
      retry: 1,
    })
  }

  return {
    // Queries
    useAccountBalance,
  }
}
