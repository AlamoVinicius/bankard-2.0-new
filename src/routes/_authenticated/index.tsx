import { createFileRoute } from '@tanstack/react-router'
import { CreditCard, TrendingUp, DollarSign, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCard } from '@/hooks/useCard'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { CardList } from '@/components/cards'
import { TransactionList } from '@/components/transactions/TransactionList'
import { ActivateCardModal } from '@/components/cards/ActivateCardModal'
import { cardRepository } from '@/repositories/cardRepository'
import type { Card } from '@/models/Card'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})

function Dashboard() {
  // Default CPF for testing (same as bill payment)
  const DEFAULT_DOCUMENT = '12951904606'

  // React Query handles automatic fetching when document is provided
  const { availableCards, isLoading, error, refetch } = useCard(DEFAULT_DOCUMENT)

  // Modal state
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false)
  const [inactiveCards, setInactiveCards] = useState<Card[]>([])
  const [isLoadingInactiveCards, setIsLoadingInactiveCards] = useState(false)

  // Load inactive cards when modal opens
  useEffect(() => {
    const loadInactiveCards = async () => {
      if (isActivateModalOpen && DEFAULT_DOCUMENT) {
        setIsLoadingInactiveCards(true)
        try {
          const allCards = await cardRepository.getAllByDocument(DEFAULT_DOCUMENT)
          // Filter cards that are not NORMAL (inactive cards)
          const inactive = allCards.filter((card) => card.status !== 'NORMAL')
          setInactiveCards(inactive)
        } catch (error) {
          console.error('Error loading inactive cards:', error)
          setInactiveCards([])
        } finally {
          setIsLoadingInactiveCards(false)
        }
      }
    }

    loadInactiveCards()
  }, [isActivateModalOpen])

  const handleActivateSuccess = () => {
    // Refresh cards list after activation
    refetch()
  }

  // Calculate stats from real data
  const stats = [
    {
      title: 'Saldo Total',
      value: 'R$ 12.450,00', // TODO: Calculate from cards/accounts
      icon: DollarSign,
      change: '+12.5%',
      trend: 'up' as const,
    },
    {
      title: 'Cartões Ativos',
      value: isLoading ? '...' : String(availableCards?.length || 0),
      icon: CreditCard,
      change: '+1',
      trend: 'up' as const,
    },
    {
      title: 'Gastos do Mês',
      value: 'R$ 3.280,00', // TODO: Calculate from transactions
      icon: TrendingUp,
      change: '-5.2%',
      trend: 'down' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Bem-vindo de volta!
        </h2>
        <p className="text-purple-100 text-sm sm:text-base">
          Aqui está um resumo da sua conta
        </p>
      </div>

      {/* Error Alert */}
      {error && !isLoading && (
        <ErrorAlert
          error={error}
          title="Erro ao carregar cartões"
          onRetry={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      )}

      {/* Stats grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <stat.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === 'up'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : stat.trend === 'down'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => setIsActivateModalOpen(true)}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors text-center"
              >
                <div className="text-2xl mb-2">💳</div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ativar Cartão
                </span>
              </button>
              <button className="p-4 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">💰</div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transferir
                </span>
              </button>
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">📊</div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Relatórios
                </span>
              </button>
              <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Configurar
                </span>
              </button>
            </div>
          </div>

          {/* Cards Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardList showTitle title="Seus Cartões" limit={3} />
          </div>

          {/* Transactions/Statement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <TransactionList limit={5} />
          </div>
        </>
      )}

      {/* Activate Card Modal */}
      <ActivateCardModal
        open={isActivateModalOpen}
        onOpenChange={setIsActivateModalOpen}
        inactiveCards={isLoadingInactiveCards ? [] : inactiveCards}
        document={DEFAULT_DOCUMENT}
        onSuccess={handleActivateSuccess}
      />
    </div>
  )
}
