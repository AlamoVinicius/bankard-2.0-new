import { createFileRoute } from '@tanstack/react-router'
import { Gift, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/benefits/')({
  component: BenefitsPage,
})

function BenefitsPage() {
  const benefits = [
    {
      id: 'mastercard-surpreenda',
      title: 'Mastercard Surpreenda',
      description:
        'Programa de benefícios exclusivo que oferece descontos e vantagens em restaurantes, cinema, teatro, eventos, viagens e muito mais. Aproveite ofertas especiais em milhares de estabelecimentos parceiros.',
      icon: Gift,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      actionLabel: 'Acessar portal',
      disabled: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Benefícios</h1>
        <p className="text-purple-100 text-sm sm:text-base">
          Descubra vantagens exclusivas do seu cartão
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className={`
              ${benefit.bgColor}
              rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700
              transition-all duration-200
              ${benefit.disabled ? 'opacity-60' : 'hover:shadow-md hover:scale-[1.02]'}
              flex flex-col
              relative
            `}
          >
            {/* Disabled Badge */}
            {benefit.disabled && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-900/80 dark:bg-gray-700/80 text-white text-xs rounded-full font-medium">
                Em breve
              </div>
            )}

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-md">
              <benefit.icon className={`w-8 h-8 ${benefit.iconColor}`} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {benefit.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
              {benefit.description}
            </p>

            {/* Action Button */}
            {!benefit.disabled && (
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center gap-2 group">
                {benefit.actionLabel}
                <ExternalLink
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Aproveite ao máximo seus benefícios
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Os benefícios disponíveis variam de acordo com a categoria do seu
          cartão. Acesse os portais dos parceiros para conhecer todas as
          vantagens exclusivas.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
            Descontos exclusivos
          </span>
          <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-medium rounded-full">
            Cashback
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
            Experiências
          </span>
        </div>
      </div>
    </div>
  )
}
