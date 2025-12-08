import { useQuery } from '@tanstack/react-query'
import { accountRepository } from '@/repositories/accountRepository'
import { useMockStore } from '@/stores/mockStore'

/**
 * Query key factory for accounts
 */
export const accountKeys = {
  all: ['accounts'] as const,
  balance: (accountId: number) => [...accountKeys.all, 'balance', accountId] as const,
  availables: ['accounts', 'availables'] as const,
}

/**
 * Account Service
 * TanStack Query wrappers for account-related operations
 * Supports mock mode for development
 */
export function useAccountService() {
  const { isMockEnabled } = useMockStore()

  /**
   * Query: Get all accounts
   */
  const useAccounts = (enabled = true) => {
    return useQuery({
      queryKey: accountKeys.all,
      queryFn: () => accountRepository.getAll(isMockEnabled),
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })
  }

  /**
   * Query: Get available balances
   */
  const useAccountAvailables = (
    params?: { account?: number; page?: number; pageSize?: number },
    enabled = true
  ) => {
    return useQuery({
      queryKey: [...accountKeys.availables, params],
      queryFn: () => accountRepository.getAvailables(params, isMockEnabled),
      enabled,
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 1,
    })
  }

  /**
   * Query: Get account balance by account ID (legacy endpoint)
   */
  const useAccountBalance = (accountId: number | undefined, enabled = true) => {
    return useQuery({
      queryKey: accountKeys.balance(accountId!),
      queryFn: () => accountRepository.getBalance(accountId!, isMockEnabled),
      enabled: !!accountId && enabled,
      staleTime: 2 * 60 * 1000, // 2 minutes - balance changes more frequently
      retry: 1,
    })
  }

  return {
    // Queries
    useAccounts,
    useAccountAvailables,
    useAccountBalance,
  }
}
