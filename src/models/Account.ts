/**
 * Tipo de programa do cartão
 */
export type ProgramType = 'PRE-PAGO' | 'POS-PAGO'

/**
 * Status da conta
 */
export type AccountStatus = 'NORMAL' | 'BLOCKED' | 'CANCELLED'

/**
 * Modelo de dados da conta/saldo - baseado na resposta da API
 * Endpoint: GET /discovery/v2/Account/{accountId}
 */
export interface Account {
  document: string
  name: string
  programId: number
  programName: string
  programType: ProgramType
  status: AccountStatus
  available: number // Saldo disponível em reais (ex: 8520 = R$ 8.520,00)
  creationDate: string // ISO 8601 date string
  customerId: number
}

/**
 * Helper: Formata o saldo para exibição em reais
 * @param balance - Valor em reais (ex: 8520 = R$ 8.520,00)
 */
export function formatBalance(balance: number): string {
  return balance.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Helper: Verifica se a conta está ativa
 */
export function isAccountActive(account: Account): boolean {
  return account.status === 'NORMAL'
}
