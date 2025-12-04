import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

// Função para validar CPF
function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false

  // Valida primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false

  // Valida segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false

  return true
}

// Schema de validação Zod
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine(
      (value) => {
        // Remove espaços
        const trimmed = value.trim()
        // Verifica se é email válido
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        // Verifica se é CPF válido
        const isCPF = isValidCPF(trimmed)
        return isEmail || isCPF
      },
      {
        message: 'Digite um email válido ou CPF válido',
      }
    ),
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // Formata os dados para exibição
    const formattedData = {
      identifier: data.identifier.trim(),
      password: data.password,
      timestamp: new Date().toISOString(),
    }

    // Exibe alert com dados formatados em JSON
    window.alert(JSON.stringify(formattedData, null, 2))
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50">

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              bankard 2.0
            </h1>
            <p className="text-slate-600 mt-3 text-sm sm:text-base font-medium">
              Banco Digital Seguro e Confiável
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/CPF Input */}
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-slate-700"
              >
                Email ou CPF
              </label>
              <input
                id="identifier"
                type="text"
                {...register('identifier')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-slate-50',
                  'border-2',
                  errors.identifier
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                  'text-slate-900 placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2',
                  'transition-all duration-200'
                )}
                placeholder="Digite seu email ou CPF"
              />
              {errors.identifier && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-slate-50',
                  'border-2',
                  errors.password
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-purple-500 focus:border-purple-500',
                  'text-slate-900 placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2',
                  'transition-all duration-200'
                )}
                placeholder="Digite sua senha"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
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
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Não tem uma conta?{' '}
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
              >
                Criar conta
              </Link>
            </p>
          </div>
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
