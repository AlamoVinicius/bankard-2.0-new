import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

// Schema de validação Zod (simplificado para aceitar qualquer username/password)
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Campo obrigatório'),
  password: z
    .string()
    .min(1, 'Campo obrigatório'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        username: data.identifier.trim(),
        password: data.password,
      })
      // Navigation is handled by useAuth hook
    } catch (error) {
      // Error is displayed via ErrorAlert below
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent tracking-tight">
              bankard 2.0
            </h1>
            <p className="text-white/70 mt-3 text-sm sm:text-base">
              Sua conta digital segura
            </p>
          </div>

          {/* Error Display */}
          {loginError && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-400/50 backdrop-blur-sm">
              <p className="text-red-300 text-sm">
                {loginError instanceof Error ? loginError.message : 'Erro ao fazer login. Tente novamente.'}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/CPF Input */}
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-white/90"
              >
                Email ou CPF
              </label>
              <input
                id="identifier"
                type="text"
                {...register('identifier')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-white/10 backdrop-blur-sm',
                  'border',
                  errors.identifier
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-white/20 focus:ring-purple-400',
                  'text-white placeholder:text-white/50',
                  'focus:outline-none focus:ring-2 focus:border-transparent',
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
                className="block text-sm font-medium text-white/90"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl',
                  'bg-white/10 backdrop-blur-sm',
                  'border',
                  errors.password
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-white/20 focus:ring-purple-400',
                  'text-white placeholder:text-white/50',
                  'focus:outline-none focus:ring-2 focus:border-transparent',
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

            {/* Forgot password link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-semibold',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                'text-white shadow-lg shadow-purple-500/50',
                'hover:shadow-xl hover:shadow-purple-500/60',
                'focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent',
                'transform transition-all duration-200',
                'hover:scale-[1.02] active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              )}
            >
              {isLoggingIn ? (
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
            <p className="text-white/70 text-sm">
              Não tem uma conta?{' '}
              <button
                type="button"
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-white/50 text-xs">
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
