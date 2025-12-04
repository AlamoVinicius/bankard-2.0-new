/**
 * Status do cartão
 */
export type CardStatus = 'NORMAL' | 'BLOCKED' | 'CANCELLED' | 'EXPIRED'

/**
 * Estágio/Estado do cartão
 */
export type CardStage =
  | 'UNLOCKED_NOT_CODE'
  | 'UNLOCKED_CODE'
  | 'LOCKED'
  | 'BLOCKED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING_ACTIVATION'

/**
 * Tipo do cartão
 */
export type CardType = 'PLASTIC' | 'VIRTUAL'

/**
 * Modelo de dados do cartão - baseado na resposta da API
 */
export interface Card {
  account: number
  cardId: number
  programId: number
  status: CardStatus
  stage: CardStage
  printedName: string
  alias: string
  type: CardType
  issuingDate: string // ISO 8601 date string
  last4Digits: string
  contactlessEnabled: boolean
  expirationDate: string // ISO 8601 date string
}

/**
 * DTO para criação de cartão
 */
export interface CreateCardDTO {
  alias: string
  type: CardType
  printedName: string
}

/**
 * DTO para atualização de cartão
 */
export interface UpdateCardDTO {
  alias?: string
  contactlessEnabled?: boolean
}

/**
 * DTO para ativação de cartão
 */
export interface ActivateCardDTO {
  cardId: number
  alias: string
  password: string
}

/**
 * Helper: Verifica se o cartão está ativo (NORMAL)
 */
export function isCardActive(card: Card): boolean {
  return card.status === 'NORMAL'
}

/**
 * Helper: Formata o número do cartão para exibição
 */
export function formatCardNumber(last4Digits: string): string {
  return `**** **** **** ${last4Digits}`
}

/**
 * Helper: Formata a data de expiração (MM/YY)
 */
export function formatExpirationDate(expirationDate: string): string {
  const date = new Date(expirationDate)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${year}`
}
