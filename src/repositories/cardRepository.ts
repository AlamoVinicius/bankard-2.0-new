import { apiClient } from '@/lib/api-client'
import { ApiError } from '@/lib/errors'
import type { Card, ActivateCardDTO, CardListResponse } from '@/models/Card'
import { mockCardsListResponse, simulateDelay } from '@/lib/mockData'

/**
 * Card Repository
 * Handles all API calls related to cards
 *
 * Supports mock mode for development
 */
class CardRepository {
  private readonly basePath = '/v1/card'
  private readonly legacyBasePath = '/discovery/v2/Card'

  /**
   * Get all cards for authenticated user with pagination
   * GET /v1/card
   *
   * @param params - Query parameters (status, page, pageSize)
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Paginated response with cards
   * @throws ApiError with user-friendly message
   */
  async getAll(
    params?: {
      status?: number
      page?: number
      pageSize?: number
    },
    useMock: boolean = false
  ): Promise<CardListResponse> {
    // Mock mode
    if (useMock) {
      await simulateDelay(800)

      // Filter by status if specified
      if (params?.status !== undefined) {
        const statusMap: Record<number, string> = {
          1: 'Active',
          2: 'Blocked',
          3: 'Cancelled',
          4: 'Expired',
        }
        const statusName = statusMap[params.status]
        const filtered = mockCardsListResponse.items.filter(
          card => card.status === statusName
        )
        return {
          ...mockCardsListResponse,
          items: filtered,
          totalCount: filtered.length,
        }
      }

      return mockCardsListResponse
    }

    // Real API call
    try {
      const response = await apiClient.get<CardListResponse>(
        this.basePath,
        { params }
      )
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível carregar os cartões. Tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Get cards by document number (CPF) - Legacy endpoint
   * GET /discovery/v2/Card/Document/{document}
   *
   * @param document - CPF number (only digits)
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Array of cards associated with the document
   * @throws ApiError with user-friendly message
   */
  async getByDocument(document: string, useMock: boolean = false): Promise<Card[]> {
    // Mock mode
    if (useMock) {
      await simulateDelay(800)
      // Return only active cards (legacy behavior)
      return mockCardsListResponse.items.filter(
        (card) => card.status === 'Active' || card.status === 'NORMAL'
      )
    }

    // Real API call
    try {
      const response = await apiClient.get<Card[]>(
        `${this.legacyBasePath}/Document/${document}`
      )

      // Return only cards with NORMAL status (active cards)
      return response.data.filter((card) => card.status === 'NORMAL')
    } catch (error) {
      // If it's already an ApiError, just rethrow
      if (error instanceof ApiError) {
        throw error
      }

      // Otherwise, wrap in ApiError with user-friendly message
      throw new ApiError(
        'Não foi possível carregar os cartões. Tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Get card by ID
   * @param cardId - Card ID
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Card details
   * @throws ApiError with user-friendly message
   */
  async getById(cardId: number, useMock: boolean = false): Promise<Card> {
    // Mock mode
    if (useMock) {
      await simulateDelay(500)
      const card = mockCardsListResponse.items.find(c => c.cardId === cardId)
      if (!card) {
        throw new ApiError('Cartão não encontrado', 404, null)
      }
      return card
    }

    // Real API call
    try {
      const response = await apiClient.get<Card>(`${this.legacyBasePath}/${cardId}`)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível carregar os detalhes do cartão.',
        500,
        error
      )
    }
  }

  /**
   * Block a card
   * @param cardId - Card ID to block
   * @param useMock - If true, simulates operation instead of calling API
   * @throws ApiError with user-friendly message
   */
  async blockCard(cardId: number, useMock: boolean = false): Promise<void> {
    // Mock mode
    if (useMock) {
      await simulateDelay(600)
      // In mock mode, just simulate success
      return
    }

    // Real API call
    try {
      await apiClient.post(`${this.legacyBasePath}/${cardId}/block`)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível bloquear o cartão. Tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Unblock a card
   * @param cardId - Card ID to unblock
   * @param useMock - If true, simulates operation instead of calling API
   * @throws ApiError with user-friendly message
   */
  async unblockCard(cardId: number, useMock: boolean = false): Promise<void> {
    // Mock mode
    if (useMock) {
      await simulateDelay(600)
      // In mock mode, just simulate success
      return
    }

    // Real API call
    try {
      await apiClient.post(`${this.legacyBasePath}/${cardId}/unblock`)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível desbloquear o cartão. Tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Activate a card
   * @param data - Activation data (cardId, alias, password)
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Activated card
   * @throws ApiError with user-friendly message
   */
  async activateCard(data: ActivateCardDTO, useMock: boolean = false): Promise<Card> {
    // Mock mode
    if (useMock) {
      await simulateDelay(1000)
      const card = mockCardsListResponse.items.find(c => c.cardId === data.cardId)
      if (!card) {
        throw new ApiError('Cartão não encontrado', 404, null)
      }
      // Return card with updated alias and Active status
      return {
        ...card,
        alias: data.alias,
        status: 'Active',
        stage: 'Normal',
      }
    }

    // Real API call
    try {
      const response = await apiClient.post<Card>(
        `${this.legacyBasePath}/${data.cardId}/activate`,
        {
          alias: data.alias,
          password: data.password,
        }
      )
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível ativar o cartão. Verifique os dados e tente novamente.',
        500,
        error
      )
    }
  }

  /**
   * Get all cards by document (including inactive ones) - Legacy endpoint
   * GET /discovery/v2/Card/Document/{document}
   *
   * @param document - CPF number (only digits)
   * @param useMock - If true, returns mock data instead of calling API
   * @returns Array of all cards (active and inactive)
   * @throws ApiError with user-friendly message
   */
  async getAllByDocument(document: string, useMock: boolean = false): Promise<Card[]> {
    // Mock mode
    if (useMock) {
      await simulateDelay(800)
      // Return all cards (no filtering)
      return mockCardsListResponse.items
    }

    // Real API call
    try {
      const response = await apiClient.get<Card[]>(
        `${this.legacyBasePath}/Document/${document}`
      )
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        'Não foi possível carregar os cartões. Tente novamente.',
        500,
        error
      )
    }
  }
}

export const cardRepository = new CardRepository()
