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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Receipt className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Pagamento de Contas</h1>
        </div>
        <p className="text-purple-100 text-sm sm:text-base">
          Pague suas contas de forma rápida e segura
        </p>
      </div>

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
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Carregando cartões...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                Erro ao carregar cartões
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {getErrorMessage(error)}
              </p>
              <button
                onClick={() => loadCardsByDocument(DEFAULT_DOCUMENT)}
                className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Selecione o Cartão</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Escolha o cartão que deseja utilizar para o pagamento
                    </p>
                  </div>
                </div>

                <CardSelector
                  onCardChange={() => setStep('bill-consultation')}
                />

                {selectedAccount && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-gray-900 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">Conta selecionada:</span>{' '}
                      {selectedAccount}
                    </p>
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCard.printedName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Conta: {selectedAccount}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('card-selection')}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Trocar
                  </button>
                </div>
              </div>

              {/* Bill Payment Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <Banknote className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Consultar Boleto</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4">
                  <Receipt className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Boleto Consultado</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Próximos passos: implementar confirmação e processamento do pagamento
                </p>
                <button
                  onClick={() => setStep('bill-consultation')}
                  className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-shadow"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </>
      )}
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
          active && 'bg-purple-600 text-white ring-4 ring-purple-600/20',
          completed && 'bg-purple-600 text-white',
          !active && !completed && 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        )}
      >
        {step}
      </div>
      <span
        className={cn(
          'text-xs sm:text-sm font-medium transition-colors',
          (active || completed) && 'text-gray-900 dark:text-white',
          !active && !completed && 'text-gray-600 dark:text-gray-400'
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
        active ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
      )}
    />
  )
}
