import { apiClient } from '@/lib/api-client'
import { ApiError } from '@/lib/errors'
import type { Account } from '@/models/Account'

/**
 * Account Repository
 * Handles all API calls related to accounts and balances
 */
class AccountRepository {
  private readonly basePath = '/discovery/v2/Account'

  /**
   * Get account balance by account ID
   * @param accountId - Account ID from card
   * @returns Account details with balance
   * @throws ApiError with user-friendly message
   */
  async getBalance(accountId: number): Promise<Account> {
    try {
      const response = await apiClient.get<Account>(
        `${this.basePath}/${accountId}`
      )
      return response.data
    } catch (error) {
      // If it's already an ApiError, just rethrow
      if (error instanceof ApiError) {
        throw error
      }

      // Otherwise, wrap in ApiError with user-friendly message
      throw new ApiError(
        'Não foi possível carregar o saldo. Tente novamente.',
        500,
        error
      )
    }
  }
}

export const accountRepository = new AccountRepository()
