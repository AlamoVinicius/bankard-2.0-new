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
 * Conta simples retornada pelo endpoint /v1/account
 * GET /v1/account
 */
export interface AccountListItem {
  account: number // Número da conta COM dígito verificador
  programId: number
  lastFourDigits: string // Últimos 4 dígitos do cartão
}

/**
 * Saldo disponível de uma conta
 * GET /v1/account/availables
 */
export interface AccountAvailable {
  account: number // Número da conta COM dígito verificador
  available: number // Saldo disponível em decimal
  updatedAt: string | null // Data/hora da última atualização (ISO 8601)
}

/**
 * Response paginado de saldos disponíveis
 * GET /v1/account/availables
 */
export interface AccountAvailablesResponse {
  totalAvailable: number // Soma total dos saldos
  accounts: AccountAvailable[]
  totalCount: number // Total de registros (para paginação)
  page: number // Página atual
  pageSize: number // Itens por página
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
