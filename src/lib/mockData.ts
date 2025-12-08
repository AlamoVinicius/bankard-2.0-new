import type { AuthResponse } from '@/models/Auth'
import type { Account, AccountListItem, AccountAvailablesResponse } from '@/models/Account'
import type { Card, CardListResponse } from '@/models/Card'

/**
 * Mock Data for Development
 * Used when mock mode is enabled
 */

/**
 * Mock Login Response
 * POST /v1/auth/login
 */
export const mockAuthResponse: AuthResponse = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwMCIsIm5hbWUiOiJBbGFtbyBWaW5pY2l1cyBTb3V6YSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
}

/**
 * Mock Accounts List
 * GET /v1/account
 */
export const mockAccountsList: AccountListItem[] = [
  {
    account: 12619892,
    programId: 1,
    lastFourDigits: '2234',
  },
  {
    account: 98765431,
    programId: 2,
    lastFourDigits: '8891',
  },
  {
    account: 45678901,
    programId: 1,
    lastFourDigits: '5567',
  },
]

/**
 * Mock Account Availables Response
 * GET /v1/account/availables
 */
export const mockAccountAvailables: AccountAvailablesResponse = {
  totalAvailable: 18520.75,
  accounts: [
    {
      account: 12619892,
      available: 10250.50,
      updatedAt: '2025-12-07T14:47:03.090Z',
    },
    {
      account: 98765431,
      available: 5270.25,
      updatedAt: '2025-12-07T12:30:15.123Z',
    },
    {
      account: 45678901,
      available: 3000.00,
      updatedAt: '2025-12-07T10:15:00.000Z',
    },
  ],
  totalCount: 3,
  page: 1,
  pageSize: 10,
}

/**
 * Mock Account Details (Legacy endpoint)
 * GET /discovery/v2/Account/{accountId}
 * Map of account ID to full account details with balance
 */
export const mockAccountDetails: Record<number, Account> = {
  12619892: {
    document: '12345678900',
    name: 'ALAMO VINICIUS SOUZA',
    programId: 1,
    programName: 'Programa Premium',
    programType: 'POS-PAGO',
    status: 'NORMAL',
    available: 10250.50,
    creationDate: '2023-06-13T10:00:00.000Z',
    customerId: 1001,
  },
  98765431: {
    document: '12345678900',
    name: 'ALAMO VINICIUS SOUZA',
    programId: 2,
    programName: 'Programa Standard',
    programType: 'PRE-PAGO',
    status: 'NORMAL',
    available: 5270.25,
    creationDate: '2024-01-15T08:30:00.000Z',
    customerId: 1001,
  },
  45678901: {
    document: '12345678900',
    name: 'ALAMO VINICIUS SOUZA',
    programId: 1,
    programName: 'Programa Premium',
    programType: 'POS-PAGO',
    status: 'NORMAL',
    available: 3000.00,
    creationDate: '2024-03-20T14:15:00.000Z',
    customerId: 1001,
  },
}

/**
 * Mock Cards List - Legacy format (mantido para compatibilidade)
 */
export const mockCards: Card[] = [
  {
    account: 12619892,
    cardId: 45500675,
    programId: 1,
    status: 'Active',
    stage: 'Active',
    printedName: 'ALAMO VINICIUS SOUZA',
    alias: 'Cartão Principal',
    type: 'Credit',
    issuingDate: '2023-06-13',
    last4Digits: '2234',
    contactlessEnabled: true,
    expirationDate: '2028-06-30',
  },
  {
    account: 98765431,
    cardId: 45500676,
    programId: 2,
    status: 'Active',
    stage: 'Active',
    printedName: 'ALAMO VINICIUS SOUZA',
    alias: 'Compras Online',
    type: 'Debit',
    issuingDate: '2024-01-15',
    last4Digits: '8891',
    contactlessEnabled: true,
    expirationDate: '2029-01-31',
  },
  {
    account: 45678901,
    cardId: 45500677,
    programId: 1,
    status: 'Active',
    stage: 'Active',
    printedName: 'ALAMO VINICIUS SOUZA',
    alias: 'Viagens',
    type: 'Credit',
    issuingDate: '2024-03-20',
    last4Digits: '5567',
    contactlessEnabled: true,
    expirationDate: '2029-03-31',
  },
]

/**
 * Mock Cards List Response with Pagination
 * GET /v1/card
 */
export const mockCardsListResponse: CardListResponse = {
  items: mockCards,
  totalCount: mockCards.length,
  page: 1,
  pageSize: 10,
}

/**
 * Helper function to simulate API delay
 * @param ms - Delay in milliseconds (default: 800ms)
 */
export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
