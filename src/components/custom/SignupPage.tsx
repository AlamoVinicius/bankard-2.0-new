import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

// Função para validar CPF
function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

// Função para validar CNPJ
function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '')
  if (cnpj.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpj)) return false

  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  const digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  length = length + 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

// Função para formatar CPF
function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
}

// Função para formatar CNPJ
function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 14)
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
}

// Função para formatar CPF/CNPJ automaticamente
function formatDocument(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return formatCPF(value)
  }
  return formatCNPJ(value)
}

// Função para formatar telefone
function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

// Função para formatar data (DD/MM/AAAA)
function formatDate(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 8)
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`
}

// Schema para Step 1
const step1Schema = z.object({
  document: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine(
      (value) => {
        const trimmed = value.trim()
        return isValidCPF(trimmed) || isValidCNPJ(trimmed)
      },
      {
        message: 'Digite um CPF ou CNPJ válido',
      }
    ),
  email: z
    .string()
    .min(1, 'Campo obrigatório')
    .email('Digite um email válido'),
  accountNumber: z
    .string()
    .min(1, 'Campo obrigatório')
    .regex(/^\d+$/, 'Deve conter apenas números'),
})

// Schema para Step 2
const step2Schema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome completo deve ter no mínimo 3 caracteres')
    .max(100, 'Nome completo deve ter no máximo 100 caracteres'),
  phone: z
    .string()
    .min(1, 'Campo obrigatório')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Formato inválido. Use (XX) XXXXX-XXXX'),
  cpf: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((value) => isValidCPF(value.trim()), {
      message: 'CPF inválido',
    }),
  birthDate: z
    .string()
    .min(1, 'Campo obrigatório')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato inválido. Use DD/MM/AAAA'),
  gender: z
    .string()
    .min(1, 'Campo obrigatório'),
})

type Step1FormData = z.infer<typeof step1Schema>
type Step2FormData = z.infer<typeof step2Schema>

export function SignupPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null)

  // Form para Step 1
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
  })

  // Form para Step 2
  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
  })

  const onStep1Submit = (data: Step1FormData) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const onStep2Submit = async (data: Step2FormData) => {
    // Combina dados dos dois steps
    const completeData = {
      ...step1Data,
      ...data,
      timestamp: new Date().toISOString(),
    }

    // Exibe alert com dados formatados
    window.alert(JSON.stringify(completeData, null, 2))

    // Aqui você implementaria a lógica de cadastro real
    // Por exemplo: await authRepository.signup(completeData)
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      navigate({ to: '/login' })
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50">

      {/* Signup card */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-12">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>

          {/* Header */}
          <div className="text-left mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Cadastrar usuário
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Para ativar o seu cartão, faça já o seu cadastro
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                currentStep >= 1 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-200'
              )}
            />
            <div
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                currentStep >= 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-200'
              )}
            />
          </div>

          {/* Step 1: Criar login */}
          {currentStep === 1 && (
            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Criar login</h2>

              {/* CPF/CNPJ Input */}
              <div className="space-y-2">
                <label
                  htmlFor="document"
                  className="block text-sm font-medium text-slate-700"
                >
                  Digite o seu CPF/CNPJ
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="document"
                  type="text"
                  {...step1Form.register('document')}
                  onChange={(e) => {
                    const formatted = formatDocument(e.target.value)
                    e.target.value = formatted
                    step1Form.setValue('document', formatted)
                  }}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step1Form.formState.errors.document
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="Digite aqui"
                />
                {step1Form.formState.errors.document && (
                  <p className="text-red-400 text-sm mt-1">
                    {step1Form.formState.errors.document.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Digite o seu e-mail
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...step1Form.register('email')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step1Form.formState.errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="ex: exemplo@exemplo.com.br"
                />
                {step1Form.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {step1Form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Account Number Input */}
              <div className="space-y-2">
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-slate-700"
                >
                  Número da conta
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  {...step1Form.register('accountNumber')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step1Form.formState.errors.accountNumber
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="Digite aqui..."
                />
                {step1Form.formState.errors.accountNumber && (
                  <p className="text-red-400 text-sm mt-1">
                    {step1Form.formState.errors.accountNumber.message}
                  </p>
                )}
              </div>

              {/* Continue button */}
              <button
                type="submit"
                disabled={step1Form.formState.isSubmitting}
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
                CONTINUAR
              </button>
            </form>
          )}

          {/* Step 2: Dados pessoais */}
          {currentStep === 2 && (
            <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Dados pessoais</h2>

              {/* Full Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Nome completo
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...step2Form.register('fullName')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step2Form.formState.errors.fullName
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="Digite aqui..."
                />
                {step2Form.formState.errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">
                    {step2Form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Número de celular
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...step2Form.register('phone')}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value)
                    e.target.value = formatted
                    step2Form.setValue('phone', formatted)
                  }}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step2Form.formState.errors.phone
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="ex: (00) 00000-0000"
                />
                {step2Form.formState.errors.phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {step2Form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {/* CPF Input */}
              <div className="space-y-2">
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-slate-700"
                >
                  CPF
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="cpf"
                  type="text"
                  {...step2Form.register('cpf')}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value)
                    e.target.value = formatted
                    step2Form.setValue('cpf', formatted)
                  }}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step2Form.formState.errors.cpf
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="000.000.000-00"
                  defaultValue={step1Data?.document && isValidCPF(step1Data.document) ? step1Data.document : ''}
                />
                {step2Form.formState.errors.cpf && (
                  <p className="text-red-400 text-sm mt-1">
                    {step2Form.formState.errors.cpf.message}
                  </p>
                )}
              </div>

              {/* Birth Date Input */}
              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-slate-700"
                >
                  Data de nascimento
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="birthDate"
                  type="text"
                  {...step2Form.register('birthDate')}
                  onChange={(e) => {
                    const formatted = formatDate(e.target.value)
                    e.target.value = formatted
                    step2Form.setValue('birthDate', formatted)
                  }}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step2Form.formState.errors.birthDate
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200'
                  )}
                  placeholder="ex: 00/00/0000"
                />
                {step2Form.formState.errors.birthDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {step2Form.formState.errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* Gender Select */}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-slate-700"
                >
                  Gênero
                  <span className="text-red-400">*</span>
                </label>
                <select
                  id="gender"
                  {...step2Form.register('gender')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-slate-50',
                    'border-2',
                    step2Form.formState.errors.gender
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                    'text-slate-900',
                    'focus:outline-none focus:ring-2',
                    'transition-all duration-200',
                    '[&>option]:bg-slate-800 [&>option]:text-white'
                  )}
                >
                  <option value="" className="text-white/50">Selecionar uma opção</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro-nao-informar">Prefiro não informar</option>
                </select>
                {step2Form.formState.errors.gender && (
                  <p className="text-red-400 text-sm mt-1">
                    {step2Form.formState.errors.gender.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={step2Form.formState.isSubmitting}
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
                {step2Form.formState.isSubmitting ? (
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
                    Cadastrando...
                  </span>
                ) : (
                  'CONTINUAR'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Seus dados estão protegidos e criptografados</span>
        </div>
      </div>
    </div>
  )
}
