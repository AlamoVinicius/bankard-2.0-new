import { createFileRoute } from '@tanstack/react-router'
import { CreditCard, ArrowLeftRight, Building2 } from 'lucide-react'
import { useState } from 'react'
import { BillPaymentModal } from '@/components/services/BillPaymentModal'
import { BalanceTransferModal } from '@/components/services/BalanceTransferModal'
import { BankTransferModal } from '@/components/services/BankTransferModal'

export const Route = createFileRoute('/_authenticated/services/')({
  component: ServicesPage,
})

function ServicesPage() {
  const [billPaymentOpen, setBillPaymentOpen] = useState(false)
  const [balanceTransferOpen, setBalanceTransferOpen] = useState(false)
  const [bankTransferOpen, setBankTransferOpen] = useState(false)

  const services = [
    {
      id: 'bill-payment',
      title: 'Pagamento de contas',
      description: 'Pague suas contas de forma rápida e segura',
      icon: CreditCard,
      onClick: () => setBillPaymentOpen(true),
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'balance-transfer',
      title: 'Transferência de saldo',
      description: 'Transfira saldo entre suas contas',
      icon: ArrowLeftRight,
      onClick: () => setBalanceTransferOpen(true),
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      hoverColor: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      id: 'bank-transfer',
      title: 'Transferência entre bancos',
      description: 'Faça transferências para outros bancos',
      icon: Building2,
      onClick: () => setBankTransferOpen(true),
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Serviços</h1>
          <p className="text-purple-100 text-sm sm:text-base">
            Acesse todos os serviços bancários disponíveis
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={service.onClick}
              className={`
                ${service.bgColor} ${service.hoverColor}
                rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700
                transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                flex flex-col items-center text-center group
                cursor-pointer
              `}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                <service.icon className={`w-8 h-8 ${service.iconColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Precisa de ajuda?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Nossa equipe está disponível 24/7 para auxiliar você com qualquer serviço bancário.
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm font-medium">
            Falar com Suporte
          </button>
        </div>
      </div>

      {/* Modals */}
      <BillPaymentModal
        open={billPaymentOpen}
        onOpenChange={setBillPaymentOpen}
      />
      <BalanceTransferModal
        open={balanceTransferOpen}
        onOpenChange={setBalanceTransferOpen}
      />
      <BankTransferModal
        open={bankTransferOpen}
        onOpenChange={setBankTransferOpen}
      />
    </>
  )
}
