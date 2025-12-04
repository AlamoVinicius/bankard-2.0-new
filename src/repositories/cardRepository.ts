import { apiClient } from '@/lib/api-client'
import { ApiError } from '@/lib/errors'
import type { Card } from '@/models/Card'

/**
 * Card Repository
 * Handles all API calls related to cards
 */
class CardRepository {
  private readonly basePath = '/discovery/v2/Card'

  /**
   * Get cards by document number (CPF)
   * @param document - CPF number (only digits)
   * @returns Array of cards associated with the document
   * @throws ApiError with user-friendly message
   */
  async getByDocument(document: string): Promise<Card[]> {
    try {
      const response = await apiClient.get<Card[]>(
        `${this.basePath}/Document/${document}`
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
   * @returns Card details
   * @throws ApiError with user-friendly message
   */
  async getById(cardId: number): Promise<Card> {
    try {
      const response = await apiClient.get<Card>(`${this.basePath}/${cardId}`)
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
   * @throws ApiError with user-friendly message
   */
  async blockCard(cardId: number): Promise<void> {
    try {
      await apiClient.post(`${this.basePath}/${cardId}/block`)
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
   * @throws ApiError with user-friendly message
   */
  async unblockCard(cardId: number): Promise<void> {
    try {
      await apiClient.post(`${this.basePath}/${cardId}/unblock`)
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
}

export const cardRepository = new CardRepository()
