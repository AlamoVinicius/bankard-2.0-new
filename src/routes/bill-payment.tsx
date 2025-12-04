import { createFileRoute } from '@tanstack/react-router'
import { BillPaymentPage } from '@/components/bill-payment/BillPaymentPage'

export const Route = createFileRoute('/bill-payment')({
  component: BillPaymentPage,
})
