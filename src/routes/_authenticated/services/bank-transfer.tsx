import { createFileRoute, Link } from '@tanstack/react-router'
import { Building2, ArrowLeft, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/services/bank-transfer')({
  component: BankTransferPage,
})

const bankTransferSchema = z.object({
  fromAccount: z.string().min(1, 'Selecione a conta de origem'),
  bankCode: z.string().min(1, 'Digite o código do banco'),
  agency: z.string().min(1, 'Digite a agência'),
  accountNumber: z.string().min(1, 'Digite o número da conta'),
  accountType: z.string().min(1, 'Selecione o tipo de conta'),
  documentNumber: z.string().min(1, 'Digite o CPF/CNPJ do destinatário'),
  beneficiaryName: z.string().min(3, 'Digite o nome do destinatário'),
  amount: z
    .string()
    .min(1, 'Digite o valor')
    .refine((val) => {
      const numValue = parseFloat(val.replace(/\./g, '').replace(',', '.'))
      return numValue > 0
    }, 'Valor deve ser maior que zero'),
  transferType: z.string().min(1, 'Selecione o tipo de transferência'),
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

function BankTransferPage() {
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<BankTransferFormData>({
    resolver: zodResolver(bankTransferSchema),
  })

  // Mock accounts
  const accounts = [
    { id: '1', name: 'Conta Corrente', balance: 5420.5, number: '12345-6' },
    { id: '2', name: 'Conta Poupança', balance: 12300.0, number: '67890-1' },
  ]

  const onSubmit = async (data: BankTransferFormData) => {
    console.log('Transfer data:', data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setShowSuccess(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      reset()
    }, 3000)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Voltar para Serviços</span>
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Transferência entre Bancos</h1>
        </div>
        <p className="text-purple-100 text-sm sm:text-base">
          Transfira valores para contas em outros bancos via TED ou PIX
        </p>
      </div>

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
                A transferência será processada em alguns instantes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados da Origem */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dados da Conta de Origem
            </h3>

            <div className="space-y-2">
              <label
                htmlFor="fromAccount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sua conta <span className="text-red-400">*</span>
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
                <option value="">Selecione sua conta</option>
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
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Dados do Destinatário */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dados do Destinatário
            </h3>

            {/* Bank Code and Agency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="bankCode"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Código do Banco <span className="text-red-400">*</span>
                </label>
                <input
                  id="bankCode"
                  type="text"
                  {...register('bankCode')}
                  placeholder="Ex: 001, 237, 341..."
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50 dark:bg-gray-900',
                    'border-2',
                    errors.bankCode
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 dark:text-white placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                />
                {errors.bankCode && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.bankCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="agency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Agência <span className="text-red-400">*</span>
                </label>
                <input
                  id="agency"
                  type="text"
                  {...register('agency')}
                  placeholder="Ex: 1234"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50 dark:bg-gray-900',
                    'border-2',
                    errors.agency
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 dark:text-white placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                />
                {errors.agency && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.agency.message}
                  </p>
                )}
              </div>
            </div>

            {/* Account Number and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Número da Conta <span className="text-red-400">*</span>
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  {...register('accountNumber')}
                  placeholder="Ex: 12345-6"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50 dark:bg-gray-900',
                    'border-2',
                    errors.accountNumber
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 dark:text-white placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                />
                {errors.accountNumber && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="accountType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tipo de Conta <span className="text-red-400">*</span>
                </label>
                <select
                  id="accountType"
                  {...register('accountType')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50 dark:bg-gray-900',
                    'border-2',
                    errors.accountType
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 dark:text-white',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                >
                  <option value="">Selecione</option>
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
                {errors.accountType && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.accountType.message}
                  </p>
                )}
              </div>
            </div>

            {/* Beneficiary Name */}
            <div className="space-y-2">
              <label
                htmlFor="beneficiaryName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nome do Destinatário <span className="text-red-400">*</span>
              </label>
              <input
                id="beneficiaryName"
                type="text"
                {...register('beneficiaryName')}
                placeholder="Digite o nome completo"
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-slate-50 dark:bg-gray-900',
                  'border-2',
                  errors.beneficiaryName
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                  'text-slate-900 dark:text-white placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2',
                  'transition-all duration-200'
                )}
              />
              {errors.beneficiaryName && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.beneficiaryName.message}
                </p>
              )}
            </div>

            {/* Document Number */}
            <div className="space-y-2">
              <label
                htmlFor="documentNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                CPF/CNPJ do Destinatário <span className="text-red-400">*</span>
              </label>
              <input
                id="documentNumber"
                type="text"
                {...register('documentNumber')}
                placeholder="000.000.000-00"
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-slate-50 dark:bg-gray-900',
                  'border-2',
                  errors.documentNumber
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                  'text-slate-900 dark:text-white placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2',
                  'transition-all duration-200'
                )}
              />
              {errors.documentNumber && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.documentNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Dados da Transferência */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dados da Transferência
            </h3>

            {/* Transfer Type */}
            <div className="space-y-2">
              <label
                htmlFor="transferType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tipo de Transferência <span className="text-red-400">*</span>
              </label>
              <select
                id="transferType"
                {...register('transferType')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-slate-50 dark:bg-gray-900',
                  'border-2',
                  errors.transferType
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500',
                  'text-slate-900 dark:text-white',
                  'focus:outline-none focus:ring-2',
                  'transition-all duration-200'
                )}
              >
                <option value="">Selecione o tipo</option>
                <option value="pix">PIX - Instantâneo</option>
                <option value="ted">TED - Mesmo dia útil</option>
                <option value="doc">DOC - 1 dia útil</option>
              </select>
              {errors.transferType && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.transferType.message}
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
                Processando...
              </span>
            ) : (
              'Confirmar Transferência'
            )}
          </button>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Atenção às tarifas</p>
            <ul className="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
              <li>PIX: Gratuito</li>
              <li>TED: R$ 10,00</li>
              <li>DOC: R$ 8,00</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
