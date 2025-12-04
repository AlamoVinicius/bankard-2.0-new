import { useCard } from '@/hooks/useCard'
import type { Card } from '@/models/Card'
import { formatCardNumber, formatExpirationDate } from '@/models/Card'
import { CreditCard, ChevronDown, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CardSelectorProps {
  className?: string
  onCardChange?: (card: Card) => void
}

/**
 * CardSelector Component
 * Dropdown selector for choosing between available cards
 * When a card is selected, the account is automatically updated in the store
 */
export function CardSelector({ className, onCardChange }: CardSelectorProps) {
  const { selectedCard, availableCards, selectCard } = useCard()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectCard = (card: Card) => {
    selectCard(card)
    setIsOpen(false)
    onCardChange?.(card)
  }

  if (!availableCards || availableCards.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-lg border border-dashed border-muted-foreground/50 bg-muted/30',
          className
        )}
      >
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Nenhum cart�o dispon�vel
          </p>
          <p className="text-xs text-muted-foreground/70">
            Adicione um cart�o para continuar
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Selected Card Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-4 p-4',
          'rounded-lg border border-border bg-card',
          'transition-colors hover:bg-accent/50',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isOpen && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground">
            <CreditCard className="h-6 w-6" />
          </div>

          {selectedCard ? (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold truncate">
                {selectedCard.printedName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">
                  {formatCardNumber(selectedCard.last4Digits)}
                </span>
                <span>"</span>
                <span>{formatExpirationDate(selectedCard.expirationDate)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Conta: {selectedCard.account}
              </p>
            </div>
          ) : (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-muted-foreground">
                Selecione um cart�o
              </p>
            </div>
          )}
        </div>

        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'rounded-lg border border-border bg-card shadow-lg',
              'max-h-[300px] overflow-y-auto',
              'animate-in fade-in-0 zoom-in-95 duration-200'
            )}
          >
            <div className="p-2 space-y-1">
              {availableCards.map((card) => {
                const isSelected = selectedCard?.cardId === card.cardId

                return (
                  <button
                    key={card.cardId}
                    onClick={() => handleSelectCard(card)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-md',
                      'transition-colors text-left',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                  >
                    <div
                      className={cn(
                        'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected
                          ? 'bg-primary-foreground/20'
                          : 'bg-gradient-to-br from-primary to-primary/80',
                        isSelected
                          ? 'text-primary-foreground'
                          : 'text-primary-foreground'
                      )}
                    >
                      <CreditCard className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {card.printedName}
                      </p>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <span className="font-mono">
                          {formatCardNumber(card.last4Digits)}
                        </span>
                        <span>"</span>
                        <span>{formatExpirationDate(card.expirationDate)}</span>
                      </div>
                      <p className="text-xs opacity-70 mt-0.5">
                        Conta: {card.account}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="h-5 w-5 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
