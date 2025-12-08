import { apiClient } from '@/lib/api-client'
import { ApiError } from '@/lib/errors'
import type { Account, AccountListItem, AccountAvailablesResponse } from '@/models/Account'
import { mockAccountsList, mockAccountAvailables, mockAccountDetails, simulateDelay } from '@/lib/mockData'

/**
 * Account Repository
 * Handles all API calls related to accounts and balances
 *
 * Supports mock mode for development
 */
class AccountRepository {
  private readonly basePath = '/v1/account'
  private readonly legacyBasePath = '/discovery/v2/Account'

  /**
   * Get all accounts for authenticated user
   * GET /v1/account
   *
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Array of accounts
   * @throws ApiError with user-friendly message
   */
  async getAll(useMock: boolean = false): Promise<AccountListItem[]> {
    // Mock mode
    if (useMock) {
      await simulateDelay(600)
      return mockAccountsList
    }

    // Real API call
    try {
      const response = await apiClient.get<AccountListItem[]>(this.basePath)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível carregar as contas. Tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Get available balances with pagination
   * GET /v1/account/availables
   *
   * @param params - Query parameters (account, page, pageSize)
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Paginated response with available balances
   * @throws ApiError with user-friendly message
   */
  async getAvailables(
    params?: {
      account?: number
      page?: number
      pageSize?: number
    },
    useMock: boolean = false
  ): Promise<AccountAvailablesResponse> {
    // Mock mode
    if (useMock) {
      await simulateDelay(700)

      // Filter by account if specified
      if (params?.account) {
        const filtered = mockAccountAvailables.accounts.filter(
          acc => acc.account === params.account
        )
        return {
          ...mockAccountAvailables,
          accounts: filtered,
          totalCount: filtered.length,
          totalAvailable: filtered.reduce((sum, acc) => sum + acc.available, 0),
        }
      }

      return mockAccountAvailables
    }

    // Real API call
    try {
      const response = await apiClient.get<AccountAvailablesResponse>(
        `${this.basePath}/availables`,
        { params }
      )
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível carregar os saldos. Tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Get account balance by account ID (legacy endpoint)
   * GET /discovery/v2/Account/{accountId}
   *
   * @param accountId - Account ID from card
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Account details with balance
   * @throws ApiError with user-friendly message
   */
  async getBalance(accountId: number, useMock: boolean = false): Promise<Account> {
    // Mock mode
    if (useMock) {
      await simulateDelay(600)

      // Get mock account details by account ID
      const mockAccount = mockAccountDetails[accountId]

      if (!mockAccount) {
        throw new ApiError(
          `Conta ${accountId} não encontrada nos dados mockados.`,
          404,
          null
        )
      }

      return mockAccount
    }

    // Real API call
    try {
      const response = await apiClient.get<Account>(
        `${this.legacyBasePath}/${accountId}`
      )
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível carregar o saldo. Tente novamente.',
        500,
        error
      )
    }
  }
}

export const accountRepository = new AccountRepository()
