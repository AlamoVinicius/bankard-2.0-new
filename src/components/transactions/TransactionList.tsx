import { useStatement } from '@/hooks/useStatement'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Loader2, ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react'
import type { Transaction } from '@/models/Transaction'
import { cn } from '@/lib/utils'

interface TransactionListProps {
  limit?: number
  showTitle?: boolean
  className?: string
}

export function TransactionList({ limit, showTitle = true, className }: TransactionListProps) {
  const { transactions, isLoading, error, refetch } = useStatement()

  // Limit transactions if specified
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount))
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `Há ${diffMins} min${diffMins !== 1 ? 's' : ''}`
    } else if (diffHours < 24) {
      return `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
    } else if (diffDays === 1) {
      return 'Ontem'
    } else if (diffDays < 7) {
      return `Há ${diffDays} dias`
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }

  // Get transaction icon and color
  const getTransactionStyle = (transaction: Transaction) => {
    const isPositive = transaction.amount > 0

    return {
      icon: isPositive ? ArrowDown : ArrowUp,
      iconBg: isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconColor: isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      amountColor: isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      sign: isPositive ? '+' : '-',
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Atividades Recentes
        </h3>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando extrato...</p>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <ErrorAlert
          error={error}
          title="Erro ao carregar extrato"
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && displayTransactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <RefreshCcw className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Nenhuma transação
          </p>
          <p className="text-xs text-muted-foreground">
            Selecione um cartão para ver o extrato
          </p>
        </div>
      )}

      {/* Transaction List */}
      {!isLoading && !error && displayTransactions.length > 0 && (
        <div className="space-y-3">
          {displayTransactions.map((transaction) => {
            const style = getTransactionStyle(transaction)
            const Icon = style.icon

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                {/* Icon */}
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', style.iconBg)}>
                  <Icon className={cn('h-5 w-5', style.iconColor)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                    {transaction.category && ` • ${transaction.category}`}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className={cn('text-sm font-semibold', style.amountColor)}>
                    {style.sign} {formatCurrency(transaction.amount)}
                  </p>
                  {transaction.status === 'PENDING' && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Pendente
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Show more indicator */}
      {!isLoading && !error && limit && transactions.length > limit && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando {limit} de {transactions.length} transações
          </p>
        </div>
      )}
    </div>
  )
}
