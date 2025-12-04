import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { ArrowLeftRight, AlertCircle } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

const transferSchema = z.object({
  fromAccount: z.string().min(1, 'Selecione a conta de origem'),
  toAccount: z.string().min(1, 'Selecione a conta de destino'),
  amount: z
    .string()
    .min(1, 'Digite o valor')
    .refine((val) => {
      const numValue = parseFloat(val.replace(/\./g, '').replace(',', '.'))
      return numValue > 0
    }, 'Valor deve ser maior que zero'),
})

type TransferFormData = z.infer<typeof transferSchema>

// Função para formatar valor monetário
function formatCurrencyInput(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (!numbers) return ''
  const amount = parseFloat(numbers) / 100
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface BalanceTransferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BalanceTransferModal({ open, onOpenChange }: BalanceTransferModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  })

  // Mock accounts
  const accounts = [
    { id: '1', name: 'Conta Corrente', balance: 5420.5, number: '12345-6' },
    { id: '2', name: 'Conta Poupança', balance: 12300.0, number: '67890-1' },
    { id: '3', name: 'Conta Salário', balance: 3200.0, number: '11223-4' },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const onSubmit = async (data: TransferFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setShowSuccess(true)

    // Reset after 3 seconds and close modal
    setTimeout(() => {
      setShowSuccess(false)
      reset()
      onOpenChange(false)
    }, 3000)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 z-50">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl p-6 text-white z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <div>
                  <Dialog.Title className="text-2xl font-bold">
                    Transferência de Saldo
                  </Dialog.Title>
                  <Dialog.Description className="text-purple-100 text-sm mt-1">
                    Transfira valores entre suas contas de forma rápida e gratuita
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close className="text-white/80 hover:text-white transition-colors">
                <X size={24} />
              </Dialog.Close>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                      Transferência realizada com sucesso!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      O valor foi transferido entre suas contas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* From Account */}
              <div className="space-y-2">
                <label
                  htmlFor="fromAccount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  De qual conta? <span className="text-red-400">*</span>
                </label>
                <select
                  id="fromAccount"
                  {...register('fromAccount')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50 dark:bg-gray-900',
                    'border-2',
                    errors.fromAccount
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 dark:text-white',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">Selecione a conta de origem</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.number} - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
                {errors.fromAccount && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.fromAccount.message}
                  </p>
                )}
              </div>

              {/* To Account */}
              <div className="space-y-2">
                <label
                  htmlFor="toAccount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Para qual conta? <span className="text-red-400">*</span>
                </label>
                <select
                  id="toAccount"
                  {...register('toAccount')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50 dark:bg-gray-900',
                    'border-2',
                    errors.toAccount
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 dark:text-white',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">Selecione a conta de destino</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.number} - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
                {errors.toAccount && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.toAccount.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Valor <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    R$
                  </span>
                  <input
                    id="amount"
                    type="text"
                    {...register('amount')}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value)
                      e.target.value = formatted
                      setValue('amount', formatted)
                    }}
                    placeholder="0,00"
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-xl',
                      'bg-slate-50 dark:bg-gray-900',
                      'border-2',
                      errors.amount
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                      'text-slate-900 dark:text-white placeholder:text-slate-400',
                      'focus:outline-none focus:ring-2',
                      'transition-all duration-200',
                      'text-lg font-medium'
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Transferências internas são gratuitas</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      As transferências entre suas contas no AnyPay são realizadas instantaneamente e sem
                      custo adicional.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full py-3 px-4 rounded-xl font-semibold',
                  'bg-gradient-to-r from-purple-600 to-pink-600',
                  'text-white shadow-lg shadow-purple-500/30',
                  'hover:shadow-xl hover:shadow-purple-500/40',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                  'transform transition-all duration-200',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Transferindo...
                  </span>
                ) : (
                  'Confirmar Transferência'
                )}
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
