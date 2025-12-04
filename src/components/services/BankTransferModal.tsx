import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Building2, AlertCircle } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

const bankTransferSchema = z.object({
  fromAccount: z.string().min(1, 'Selecione uma conta'),
  toAccount: z.string().min(1, 'Selecione uma conta'),
  amount: z
    .string()
    .min(1, 'Digite o valor')
    .refine((val) => {
      const numValue = parseFloat(val.replace(/\./g, '').replace(',', '.'))
      return numValue >= 10 && numValue <= 50000
    }, 'Valor deve estar entre R$ 10,00 e R$ 50.000,00'),
})

type BankTransferFormData = z.infer<typeof bankTransferSchema>

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

interface BankTransferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BankTransferModal({ open, onOpenChange }: BankTransferModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<BankTransferFormData>({
    resolver: zodResolver(bankTransferSchema),
  })

  // Mock accounts
  const accounts = [
    { id: '126197474', name: 'PLAS', balance: 8520.0 },
    { id: '126197475', name: 'Conta Poupança', balance: 12300.0 },
  ]

  const selectedFromAccount = watch('fromAccount')
  const selectedToAccount = watch('toAccount')
  const amount = watch('amount')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId)
    return account ? account.balance : 0
  }

  const calculateTransferAmount = () => {
    if (!amount) return 0
    return parseFloat(amount.replace(/\./g, '').replace(',', '.'))
  }

  const onSubmit = async (data: BankTransferFormData) => {
    console.log('Transfer data:', data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

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
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <Dialog.Title className="text-2xl font-bold">
                    Transferência entre Bancos
                  </Dialog.Title>
                  <Dialog.Description className="text-purple-100 text-sm mt-1">
                    Transfira valores para contas em outros bancos
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
                      Transferência agendada com sucesso!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      A transferência será processada em até 2 dias úteis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                • A transferência somente será realizada para uma conta bancária da mesma titularidade.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                • Limite diário de transferência de R$ 10,00 a R$ 50.000,00
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                • <span className="font-semibold">Tarifa de 0,5%</span> sobre o valor da transferência com tarifa mínima de R$ 9,00 e máxima de R$ 250,00
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                • A transferência será realizada em até 2 dias úteis.
              </p>
            </div>

            {/* Transfer Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados bancários */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Dados bancários
                  </h3>
                  <button
                    type="button"
                    className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <span className="text-lg">+</span> Adicionar Conta
                  </button>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="fromAccount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Selecione uma conta
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
                    <option value="">Selecione uma conta</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.id} - {account.name}
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
              </div>

              {/* Dados conta transferência */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Dados conta transferência
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Conta */}
                  <div className="space-y-2">
                    <label
                      htmlFor="toAccount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Conta
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
                      <option value="">Selecione</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.id} - {account.name}
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

                  {/* Saldo */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Saldo
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white">
                      {selectedFromAccount
                        ? formatCurrency(getAccountBalance(selectedFromAccount))
                        : 'R$ 0,00'}
                    </div>
                  </div>

                  {/* Valor transferência */}
                  <div className="space-y-2">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Valor transferê...
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
                          'transition-all duration-200'
                        )}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full py-3 px-4 rounded-xl font-semibold uppercase',
                  'bg-gray-300 dark:bg-gray-700',
                  'text-gray-800 dark:text-gray-300',
                  'hover:bg-gray-400 dark:hover:bg-gray-600',
                  'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                  'transform transition-all duration-200',
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
                    Processando...
                  </span>
                ) : (
                  'Salvar Solicitação'
                )}
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
