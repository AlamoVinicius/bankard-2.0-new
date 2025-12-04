import { useCard } from '@/hooks/useCard'
import { CardItem } from './CardItem'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Loader2 } from 'lucide-react'

interface CardListProps {
  /**
   * Show title above the card list
   */
  showTitle?: boolean
  /**
   * Custom title text
   */
  title?: string
  /**
   * Custom CSS class
   */
  className?: string
  /**
   * Number of cards to display (undefined = show all)
   */
  limit?: number
}

/**
 * CardList Component
 *
 * Displays a list of user's cards with loading and error states.
 * Integrates with useCard hook (which uses cardService + TanStack Query).
 *
 * Features:
 * - Loading skeleton/spinner
 * - Error display with retry functionality
 * - Empty state
 * - Mobile-first responsive grid
 * - Reusable across multiple pages
 *
 * @example
 * // Show all cards with title
 * <CardList showTitle />
 *
 * @example
 * // Show limited cards for dashboard
 * <CardList limit={3} showTitle title="Seus Cartões" />
 */
export function CardList({
  showTitle = true,
  title = 'Meus Cartões',
  className = '',
  limit,
}: CardListProps) {
  const { availableCards, isLoading, error, refetch } = useCard()

  // Limit cards if specified
  const displayCards = limit ? availableCards.slice(0, limit) : availableCards

  return (
    <div className={className}>
      {/* Title */}
      {showTitle && (
        <h2 className="text-lg font-semibold mb-4 sm:text-xl md:text-2xl">
          {title}
        </h2>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando cartões...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorAlert
          error={error}
          title="Erro ao carregar cartões"
          onRetry={() => refetch()}
          className="mb-4"
        />
      )}

      {/* Empty State (no error, not loading, but no cards) */}
      {!isLoading && !error && displayCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h3 className="text-base font-medium mb-2 sm:text-lg">
            Nenhum cartão encontrado
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Você ainda não possui cartões cadastrados ou não há cartões ativos
            disponíveis.
          </p>
        </div>
      )}

      {/* Card Grid */}
      {!isLoading && !error && displayCards.length > 0 && (
        <div
          className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {displayCards.map((card) => (
            <CardItem key={card.cardId} card={card} />
          ))}
        </div>
      )}

      {/* "Show More" indicator if limited */}
      {!isLoading &&
        !error &&
        limit &&
        availableCards.length > limit && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Mostrando {limit} de {availableCards.length} cartões
            </p>
          </div>
        )}
    </div>
  )
}