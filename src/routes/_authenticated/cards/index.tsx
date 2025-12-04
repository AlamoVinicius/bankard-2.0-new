import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Lock, Unlock, Eye, Loader2 } from 'lucide-react'
import { CardItem } from '@/components/cards/CardItem'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { useCard } from '@/hooks/useCard'
import { cn } from '@/lib/utils'
import type { Card } from '@/models/Card'

export const Route = createFileRoute('/_authenticated/cards/')({
  component: CardsPage,
})

function CardsPage() {
  // Default CPF for testing
  const DEFAULT_DOCUMENT = '12951904606'

  // React Query handles automatic fetching when document is provided
  const { availableCards, isLoading, error, refetch } = useCard(DEFAULT_DOCUMENT)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Reset active index when cards change
  useEffect(() => {
    if (availableCards && availableCards.length > 0 && activeIndex >= availableCards.length) {
      setActiveIndex(0)
    }
  }, [availableCards, activeIndex])

  const activeCard = availableCards?.[activeIndex]

  const handlePrevious = () => {
    if (!availableCards || availableCards.length <= 1) return
    setDirection(-1)
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : availableCards.length - 1))
  }

  const handleNext = () => {
    if (!availableCards || availableCards.length <= 1) return
    setDirection(1)
    setActiveIndex((prev) => (prev < availableCards.length - 1 ? prev + 1 : 0))
  }

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      handlePrevious()
    } else if (info.offset.x < -swipeThreshold) {
      handleNext()
    }
  }

  const getCardStatusInfo = (card: Card) => {
    if (card.status === 'BLOCKED' || card.stage === 'LOCKED') {
      return {
        label: 'Bloqueado',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
      }
    }
    if (card.stage === 'UNLOCKED_NOT_CODE') {
      return {
        label: 'Pendente Ativação',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      }
    }
    return {
      label: 'Ativo',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    }
  }

  const statusInfo = activeCard ? getCardStatusInfo(activeCard) : null

  // Variantes de animação para o slide
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Meus Cartões
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie seus cartões físicos e virtuais
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105">
          <Plus size={20} />
          <span className="hidden sm:inline">Novo Cartão</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && !isLoading && (
        <ErrorAlert
          error={error}
          title="Erro ao carregar cartões"
          onRetry={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando cartões...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!availableCards || availableCards.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Nenhum cartão ativo</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Você não possui cartões ativos no momento. Solicite um novo cartão para começar.
            </p>
          </div>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Solicitar Cartão
          </button>
        </div>
      )}

      {/* Cards Display */}
      {!isLoading && !error && availableCards && availableCards.length > 0 && (
        <>
          {/* Carousel de cartões */}
          <div className="space-y-6">
            {/* Navegação e contador */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={availableCards.length <= 1}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeIndex + 1} de {availableCards.length}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Deslize para navegar
                </p>
              </div>

              <button
                onClick={handleNext}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={availableCards.length <= 1}
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Cartão ativo com animação de slide */}
            <div className="relative flex justify-center px-4 sm:px-0 overflow-hidden">
              <div className="w-full max-w-md">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <CardItem card={activeCard} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Indicadores de paginação (dots) */}
            <div className="flex items-center justify-center gap-2">
              {availableCards.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                  }}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === activeIndex
                      ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  )}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Ir para cartão ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Detalhes do cartão ativo */}
          {activeCard && statusInfo && (
            <motion.div
              key={`details-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detalhes do Cartão
              </h3>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <motion.span
                    key={`status-${activeIndex}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      statusInfo.bgColor,
                      statusInfo.color
                    )}
                  >
                    {statusInfo.label}
                  </motion.span>
                </div>

                {/* Tipo */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeCard.type === 'VIRTUAL' ? 'Virtual' : 'Físico'}
                  </span>
                </div>

                {/* Contactless */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Contactless
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeCard.contactlessEnabled ? 'Ativado' : 'Desativado'}
                  </span>
                </div>

                {/* Conta */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Conta
                  </span>
                  <span className="text-sm font-medium font-mono text-gray-900 dark:text-white">
                    {activeCard.account}
                  </span>
                </div>

                {/* ID do Cartão */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ID do Cartão
                  </span>
                  <span className="text-sm font-medium font-mono text-gray-900 dark:text-white">
                    {activeCard.cardId}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Ações rápidas */}
          {activeCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md flex flex-col items-center gap-2"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ver Detalhes
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md flex flex-col items-center gap-2"
                disabled={
                  activeCard.status === 'BLOCKED' || activeCard.stage === 'LOCKED'
                }
              >
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bloquear
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md flex flex-col items-center gap-2"
                disabled={
                  activeCard.status !== 'BLOCKED' && activeCard.stage !== 'LOCKED'
                }
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Unlock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Desbloquear
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md flex flex-col items-center gap-2"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ativar
                </span>
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
