import type { StatementResponse, Transaction } from '@/models/Transaction'

/**
 * StatementRepository
 * Handles account statement API calls
 *
 * TODO: Replace mocked data with real API endpoint when available
 */
class StatementRepository {
  /**
   * Get account statement with transactions
   * Mocked with different data for each account
   */
  async getStatement(accountId: number): Promise<StatementResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock different transactions for each account
    const mockTransactions: Record<number, Transaction[]> = {
      126197474: [
        {
          id: 'tx-001',
          accountId: 126197474,
          type: 'PURCHASE',
          amount: -125.50,
          description: 'Supermercado Pão de Açúcar',
          merchantName: 'Pão de Açúcar',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Alimentação',
        },
        {
          id: 'tx-002',
          accountId: 126197474,
          type: 'TRANSFER_IN',
          amount: 500.00,
          description: 'Transferência recebida - PIX',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Transferência',
        },
        {
          id: 'tx-003',
          accountId: 126197474,
          type: 'PURCHASE',
          amount: -45.90,
          description: 'Uber - Corrida',
          merchantName: 'Uber',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Transporte',
        },
        {
          id: 'tx-004',
          accountId: 126197474,
          type: 'PURCHASE',
          amount: -89.90,
          description: 'iFood - Pedido',
          merchantName: 'iFood',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Alimentação',
        },
        {
          id: 'tx-005',
          accountId: 126197474,
          type: 'PAYMENT',
          amount: -150.00,
          description: 'Pagamento de conta de luz',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Contas',
        },
      ],
      126197508: [
        {
          id: 'tx-101',
          accountId: 126197508,
          type: 'PURCHASE',
          amount: -250.00,
          description: 'Magazine Luiza - Eletrônicos',
          merchantName: 'Magazine Luiza',
          date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Compras',
        },
        {
          id: 'tx-102',
          accountId: 126197508,
          type: 'PURCHASE',
          amount: -75.50,
          description: 'Farmácia São Paulo',
          merchantName: 'Farmácia',
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Saúde',
        },
        {
          id: 'tx-103',
          accountId: 126197508,
          type: 'TRANSFER_OUT',
          amount: -200.00,
          description: 'Transferência enviada - PIX',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Transferência',
        },
      ],
      126197656: [
        {
          id: 'tx-201',
          accountId: 126197656,
          type: 'PURCHASE',
          amount: -199.90,
          description: 'Netflix - Assinatura',
          merchantName: 'Netflix',
          date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Entretenimento',
        },
        {
          id: 'tx-202',
          accountId: 126197656,
          type: 'PURCHASE',
          amount: -49.90,
          description: 'Spotify - Assinatura',
          merchantName: 'Spotify',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Entretenimento',
        },
        {
          id: 'tx-203',
          accountId: 126197656,
          type: 'PURCHASE',
          amount: -320.00,
          description: 'Shopping Iguatemi',
          merchantName: 'Shopping',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Compras',
        },
        {
          id: 'tx-204',
          accountId: 126197656,
          type: 'REFUND',
          amount: 50.00,
          description: 'Estorno - Devolução de produto',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          category: 'Estorno',
        },
      ],
    }

    // Get transactions for this account, or empty array if not found
    const transactions = mockTransactions[accountId] || []

    // Calculate balance
    const balance = transactions.reduce((acc, tx) => acc + tx.amount, 5000)

    // TODO: Replace with real API call
    // const response = await apiClient.get<StatementResponse>(`/accounts/${accountId}/statement`)
    // return response.data

    return {
      accountId,
      balance,
      transactions,
    }
  }
}

export const statementRepository = new StatementRepository()
