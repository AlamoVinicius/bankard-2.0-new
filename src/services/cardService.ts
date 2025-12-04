import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardRepository } from '@/repositories/cardRepository'
import type { Card } from '@/models/Card'

/**
 * Query key factory for cards
 */
export const cardKeys = {
  all: ['cards'] as const,
  byDocument: (document: string) => [...cardKeys.all, 'document', document] as const,
  detail: (cardId: number) => [...cardKeys.all, 'detail', cardId] as const,
}

/**
 * Card Service
 * TanStack Query wrappers for card-related operations
 */
export function useCardService() {
  const queryClient = useQueryClient()

  /**
   * Query: Get cards by document (CPF)
   * Returns only active cards (status: NORMAL)
   */
  const useCardsByDocument = (document: string, enabled = true) => {
    return useQuery({
      queryKey: cardKeys.byDocument(document),
      queryFn: () => cardRepository.getByDocument(document),
      enabled: !!document && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    })
  }

  /**
   * Query: Get card by ID
   */
  const useCardById = (cardId: number, enabled = true) => {
    return useQuery({
      queryKey: cardKeys.detail(cardId),
      queryFn: () => cardRepository.getById(cardId),
      enabled: !!cardId && enabled,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })
  }

  /**
   * Mutation: Block card
   */
  const blockCardMutation = useMutation({
    mutationFn: (cardId: number) => cardRepository.blockCard(cardId),
    onSuccess: (_, cardId) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(cardId) })
      queryClient.invalidateQueries({ queryKey: cardKeys.all })
    },
  })

  /**
   * Mutation: Unblock card
   */
  const unblockCardMutation = useMutation({
    mutationFn: (cardId: number) => cardRepository.unblockCard(cardId),
    onSuccess: (_, cardId) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(cardId) })
      queryClient.invalidateQueries({ queryKey: cardKeys.all })
    },
  })

  return {
    // Queries
    useCardsByDocument,
    useCardById,

    // Mutations
    blockCard: blockCardMutation.mutateAsync,
    unblockCard: unblockCardMutation.mutateAsync,

    // Mutation states
    isBlocking: blockCardMutation.isPending,
    isUnblocking: unblockCardMutation.isPending,
  }
}
