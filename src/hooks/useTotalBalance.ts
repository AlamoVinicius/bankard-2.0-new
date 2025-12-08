import { useQueries } from '@tanstack/react-query'
import { accountRepository } from '@/repositories/accountRepository'
import { accountKeys } from '@/services/accountService'
import { useMockStore } from '@/stores/mockStore'
import type { Card } from '@/models/Card'

/**
 * Hook para calcular o saldo total de múltiplos cartões
 * Faz queries paralelas para cada cartão e soma os saldos
 * Supports mock mode for development
 */
export function useTotalBalance(cards: Card[] | undefined) {
  const { isMockEnabled } = useMockStore()

  // Criar queries para cada cartão
  const balanceQueries = useQueries({
    queries: (cards || []).map((card) => ({
      queryKey: accountKeys.balance(card.account),
      queryFn: () => accountRepository.getBalance(card.account, isMockEnabled),
      enabled: !!card.account,
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: 1,
    })),
  })

  // Verificar se alguma query está carregando
  const isLoading = balanceQueries.some((query) => query.isLoading)

  // Verificar se houve erro em alguma query
  const hasError = balanceQueries.some((query) => query.error)

  // Calcular saldo total somando todos os saldos disponíveis
  const totalBalance = balanceQueries.reduce((sum, query) => {
    if (query.data?.available) {
      return sum + query.data.available
    }
    return sum
  }, 0)

  // Contar quantos cartões têm saldo carregado
  const cardsWithBalance = balanceQueries.filter(
    (query) => query.data?.available !== undefined
  ).length

  return {
    totalBalance, // Saldo total em reais (soma de todos os cartões)
    isLoading, // Indica se está carregando algum saldo
    hasError, // Indica se houve erro em alguma requisição
    cardsWithBalance, // Quantidade de cartões com saldo carregado
    totalCards: cards?.length || 0, // Total de cartões
  }
}
