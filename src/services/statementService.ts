import { useQuery } from '@tanstack/react-query'
import { statementRepository } from '@/repositories/statementRepository'

/**
 * Query key factory for statements
 */
export const statementKeys = {
  all: ['statements'] as const,
  byAccount: (accountId: number) => [...statementKeys.all, 'account', accountId] as const,
}

/**
 * Statement Service
 * TanStack Query wrappers for statement/transaction operations
 */
export function useStatementService() {
  /**
   * Query: Get statement by account ID
   */
  const useStatementByAccount = (accountId: number | undefined, enabled = true) => {
    return useQuery({
      queryKey: statementKeys.byAccount(accountId!),
      queryFn: () => statementRepository.getStatement(accountId!),
      enabled: !!accountId && enabled,
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 1,
    })
  }

  return {
    useStatementByAccount,
  }
}
