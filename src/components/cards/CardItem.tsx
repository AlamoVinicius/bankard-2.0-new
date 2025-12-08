import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Card } from '@/models/Card'
import { Wifi, CreditCard as CreditCardIcon, Lock, RotateCcw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCardBalance } from '@/hooks/useCardBalance'
import { formatBalance } from '@/models/Account'

interface CardItemProps {
  card: Card
  className?: string
  isSelected?: boolean
  showBalance?: boolean
}

export function CardItem({ card, className, isSelected = false, showBalance = true }: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Busca o saldo do cartão usando o hook
  const { balance, isLoading: isLoadingBalance } = useCardBalance(card)

  // Define gradientes baseado no tipo de cartão
  const gradients: Record<string, string> = {
    PLASTIC: 'bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900',
    VIRTUAL: 'bg-gradient-to-br from-pink-600 via-rose-700 to-red-800',
    Credit: 'bg-gradient-to-br from-blue-600 via-blue-800 to-indigo-900',
    Debit: 'bg-gradient-to-br from-green-600 via-green-800 to-emerald-900',
    Unknown: 'bg-gradient-to-br from-gray-600 via-gray-800 to-slate-900',
  }

  // Pega o gradiente do cartão ou usa um padrão
  const cardGradient = gradients[card.type] || 'bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900'

  // Formata a data de expiração
  const expirationDate = new Date(card.expirationDate)
  const expMonth = String(expirationDate.getMonth() + 1).padStart(2, '0')
  const expYear = String(expirationDate.getFullYear()).slice(-2)

  // Define o status visual
  const isBlocked = card.status === 'BLOCKED' || card.stage === 'LOCKED'

  return (
    <div
      className={cn(
        'relative w-full aspect-[1.586/1] transition-all duration-200',
        isSelected && 'ring-4 ring-purple-500 ring-offset-2 ring-offset-background rounded-2xl',
        className
      )}
    >
      {/* Flip container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Frente do cartão */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-2xl shadow-2xl overflow-hidden cursor-pointer',
            cardGradient
          )}
          initial={false}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            duration: 0.6,
            type: 'spring',
            stiffness: 100,
          }}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Padrão de fundo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Conteúdo do cartão - FRENTE */}
          <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between text-white">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium opacity-90 mb-1">
                  {card.type === 'VIRTUAL' ? 'Cartão Virtual' : 'Cartão Físico'}
                </p>
                <p className="text-sm sm:text-base font-bold">{card.alias}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {card.contactlessEnabled && (
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Wifi className="w-4 h-4 sm:w-5 sm:h-5 rotate-90" />
                  </div>
                )}
                {isBlocked && (
                  <div className="p-1.5 bg-red-500/80 rounded-lg backdrop-blur-sm">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Saldo disponível */}
            {showBalance && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs opacity-80 mb-1">
                  Saldo disponível
                </p>
                {isLoadingBalance ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm sm:text-base">Carregando...</span>
                  </div>
                ) : balance !== undefined ? (
                  <p className="text-xl sm:text-2xl font-bold">
                    {formatBalance(balance)}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base opacity-70">
                    Não disponível
                  </p>
                )}
              </div>
            )}

            {/* Chip do cartão */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-10 sm:w-14 sm:h-12 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg shadow-lg flex items-center justify-center">
                <div className="w-8 h-6 sm:w-10 sm:h-8 border-2 border-yellow-600/40 rounded" />
              </div>
            </div>

            {/* Número do cartão */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 font-mono">
                <span className="text-base sm:text-xl tracking-wider">••••</span>
                <span className="text-base sm:text-xl tracking-wider">••••</span>
                <span className="text-base sm:text-xl tracking-wider">••••</span>
                <span className="text-xl sm:text-2xl font-bold tracking-wider">
                  {card.last4Digits}
                </span>
              </div>

              {/* Rodapé */}
              <div className="flex items-end justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs opacity-70 mb-1">
                    Nome do Titular
                  </p>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide break-words leading-tight">
                    {card.printedName}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] sm:text-xs opacity-70 mb-1">
                    Validade
                  </p>
                  <p className="text-xs sm:text-sm font-semibold font-mono whitespace-nowrap">
                    {expMonth}/{expYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Logo marca/bandeira */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 opacity-30">
              <CreditCardIcon className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            {/* Ícone de flip */}
            <div className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </motion.div>

        {/* Verso do cartão */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-2xl shadow-2xl overflow-hidden cursor-pointer',
            cardGradient
          )}
          initial={false}
          animate={{
            rotateY: isFlipped ? 0 : -180,
          }}
          transition={{
            duration: 0.6,
            type: 'spring',
            stiffness: 100,
          }}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(-180deg)',
          }}
        >
          {/* Padrão de fundo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Conteúdo do cartão - VERSO */}
          <div className="relative h-full flex flex-col text-white">
            {/* Tarja magnética */}
            <div className="w-full h-12 sm:h-16 bg-black mt-6 sm:mt-8" />

            {/* Área de assinatura e CVV */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Faixa de assinatura */}
                <div className="bg-white/90 h-10 sm:h-12 rounded flex items-center justify-end px-4">
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-600">CVV</div>
                    <div className="bg-white px-3 py-1 rounded border-2 border-dashed border-gray-300">
                      <span className="text-gray-900 font-bold font-mono text-sm sm:text-base">
                        •••
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informações de segurança */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs opacity-80 leading-relaxed">
                    Este cartão é propriedade do AnyPay e deve ser
                    devolvido se solicitado. O uso não autorizado é proibido por
                    lei.
                  </p>
                </div>
              </div>

              {/* Rodapé com informações */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm opacity-80">
                  <span>ID: {card.cardId}</span>
                  <span>Conta: {card.account}</span>
                </div>

                <div className="flex items-center justify-center gap-2 opacity-60">
                  <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-semibold">
                    AnyPay
                  </span>
                </div>
              </div>

              {/* Ícone de flip */}
              <div className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
