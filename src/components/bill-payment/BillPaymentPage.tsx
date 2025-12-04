import { useState, useEffect } from 'react'
import { useCard } from '@/hooks/useCard'
import { CardSelector } from '@/components/cards/CardSelector'
import { BillPaymentForm } from './BillPaymentForm'
import { getErrorMessage } from '@/lib/errors'
import {
  Receipt,
  AlertCircle,
  Loader2,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Bill Payment Page
 * Main page for bill payment operations
 * First step: Consult the bill barcode
 */
export function BillPaymentPage() {
  const { selectedCard, selectedAccount, availableCards, isLoading, error, loadCardsByDocument } = useCard()
  const [step, setStep] = useState<'card-selection' | 'bill-consultation' | 'payment-confirmation'>('card-selection')

  // Default CPF for testing - replace with auth user document
  const DEFAULT_DOCUMENT = '12951904606'

  // Load cards on mount
  useEffect(() => {
    if (!availableCards || availableCards.length === 0) {
      loadCardsByDocument(DEFAULT_DOCUMENT)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance to bill consultation when card is selected
  useEffect(() => {
    if (selectedCard && step === 'card-selection') {
      setStep('bill-consultation')
    }
  }, [selectedCard, step])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Pagamento de Contas</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Pague suas contas de forma rápida e segura
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 sm:px-6 sm:py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <StepIndicator
              step={1}
              label="Cartão"
              active={step === 'card-selection'}
              completed={step !== 'card-selection'}
            />
            <Connector active={step !== 'card-selection'} />
            <StepIndicator
              step={2}
              label="Consultar Boleto"
              active={step === 'bill-consultation'}
              completed={step === 'payment-confirmation'}
            />
            <Connector active={step === 'payment-confirmation'} />
            <StepIndicator
              step={3}
              label="Confirmar"
              active={step === 'payment-confirmation'}
              completed={false}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando cartões...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-destructive mb-1">
                    Erro ao carregar cartões
                  </h3>
                  <p className="text-sm text-destructive/80">
                    {getErrorMessage(error)}
                  </p>
                  <button
                    onClick={() => loadCardsByDocument(DEFAULT_DOCUMENT)}
                    className="mt-3 text-sm font-medium text-destructive hover:underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <>
              {/* Step 1: Card Selection */}
              {step === 'card-selection' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Selecione o Cartão</h2>
                        <p className="text-sm text-muted-foreground">
                          Escolha o cartão que deseja utilizar para o pagamento
                        </p>
                      </div>
                    </div>

                    <CardSelector
                      onCardChange={() => setStep('bill-consultation')}
                    />

                    {selectedAccount && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Conta selecionada:</span>{' '}
                          {selectedAccount}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Info Card */}
                  <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">Importante</p>
                        <p className="text-blue-700 dark:text-blue-300">
                          Ao selecionar um cartão, a conta associada será automaticamente
                          utilizada para o pagamento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Bill Consultation */}
              {step === 'bill-consultation' && selectedCard && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Selected Card Info */}
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{selectedCard.printedName}</p>
                          <p className="text-xs text-muted-foreground">
                            Conta: {selectedAccount}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setStep('card-selection')}
                        className="text-sm text-primary hover:underline"
                      >
                        Trocar
                      </button>
                    </div>
                  </div>

                  {/* Bill Payment Form */}
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Banknote className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Consultar Boleto</h2>
                        <p className="text-sm text-muted-foreground">
                          Digite o código de barras para consultar o boleto
                        </p>
                      </div>
                    </div>

                    <BillPaymentForm
                      selectedCard={selectedCard}
                      onSuccess={() => setStep('payment-confirmation')}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment Confirmation */}
              {step === 'payment-confirmation' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="rounded-lg border bg-card p-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mb-4">
                      <Receipt className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Boleto Consultado</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Próximos passos: implementar confirmação e processamento do pagamento
                    </p>
                    <button
                      onClick={() => setStep('bill-consultation')}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

/**
 * Step Indicator Component
 */
interface StepIndicatorProps {
  step: number
  label: string
  active: boolean
  completed: boolean
}

function StepIndicator({ step, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all',
          active && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
          completed && 'bg-primary text-primary-foreground',
          !active && !completed && 'bg-muted text-muted-foreground'
        )}
      >
        {step}
      </div>
      <span
        className={cn(
          'text-xs sm:text-sm font-medium transition-colors',
          (active || completed) && 'text-foreground',
          !active && !completed && 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </div>
  )
}

/**
 * Step Connector Component
 */
function Connector({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        'h-0.5 w-12 sm:w-16 -mt-6 transition-colors',
        active ? 'bg-primary' : 'bg-muted'
      )}
    />
  )
}
