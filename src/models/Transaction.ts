/**
 * Transaction Models
 * Types for account statements and transactions
 */

/**
 * Transaction type
 */
export type TransactionType =
  | 'PURCHASE'           // Compra
  | 'WITHDRAWAL'         // Saque
  | 'TRANSFER_IN'        // Transferência recebida
  | 'TRANSFER_OUT'       // Transferência enviada
  | 'PAYMENT'            // Pagamento
  | 'REFUND'             // Estorno
  | 'FEE'                // Taxa

/**
 * Transaction status
 */
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED'

/**
 * Transaction data
 */
export interface Transaction {
  id: string
  accountId: number
  type: TransactionType
  amount: number
  description: string
  merchantName?: string
  date: string // ISO 8601 date string
  status: TransactionStatus
  category?: string
}

/**
 * Account statement response
 */
export interface StatementResponse {
  accountId: number
  balance: number
  transactions: Transaction[]
}
