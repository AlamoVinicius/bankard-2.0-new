# Card Balance API - Guia de Uso

## Visão Geral

A API de saldo de cartão foi implementada seguindo a arquitetura do projeto Bankard 2.0. O sistema busca automaticamente o saldo da conta associada ao cartão usando o endpoint:

```
GET https://api-bifrost-hml.acgsa.com.br/discovery/v2/Account/{accountId}
```

## Estrutura Implementada

### 1. Model - Account.ts

Define a interface de retorno da API de saldo:

```typescript
import type { Account } from '@/models/Account'

// Estrutura do retorno
interface Account {
  document: string
  name: string
  programId: number
  programName: string
  programType: 'PRE-PAGO' | 'POS-PAGO'
  status: 'NORMAL' | 'BLOCKED' | 'CANCELLED'
  available: number // Saldo em centavos
  creationDate: string
  customerId: number
}

// Helper para formatar o saldo
import { formatBalance } from '@/models/Account'
const formatted = formatBalance(8520) // R$ 85,20
```

### 2. Repository - accountRepository.ts

Gerencia as chamadas à API:

```typescript
import { accountRepository } from '@/repositories/accountRepository'

// Buscar saldo por ID da conta
const account = await accountRepository.getBalance(126197474)
console.log(account.available) // 8520 (em centavos)
```

### 3. Service - accountService.ts

TanStack Query wrapper para cache e gerenciamento de estado:

```typescript
import { useAccountService } from '@/services/accountService'

function MyComponent() {
  const { useAccountBalance } = useAccountService()

  const {
    data: account,
    isLoading,
    error
  } = useAccountBalance(accountId, true)

  return (
    <div>
      {isLoading && <p>Carregando...</p>}
      {account && <p>Saldo: {account.available}</p>}
    </div>
  )
}
```

### 4. Hook - useCardBalance.ts

Hook customizado que busca o saldo usando o número da conta do cartão:

```typescript
import { useCardBalance } from '@/hooks/useCardBalance'
import type { Card } from '@/models/Card'

function CardDetails({ card }: { card: Card }) {
  const {
    balance,           // Saldo em centavos
    isLoading,         // Estado de carregamento
    accountData,       // Dados completos da conta
    cardWithBalance,   // Cartão enriquecido com saldo
    refetchBalance     // Função para recarregar
  } = useCardBalance(card)

  return (
    <div>
      {isLoading ? (
        <p>Carregando saldo...</p>
      ) : (
        <p>Saldo: R$ {(balance || 0) / 100}</p>
      )}
    </div>
  )
}
```

## Exemplos de Uso

### Exemplo 1: Card Item com Saldo (Implementado)

O componente `CardItem` já está integrado com o saldo:

```typescript
import { CardItem } from '@/components/cards/CardItem'

function MyCards() {
  return (
    <div>
      {/* Exibe o cartão COM saldo */}
      <CardItem card={card} showBalance={true} />

      {/* Exibe o cartão SEM saldo */}
      <CardItem card={card} showBalance={false} />
    </div>
  )
}
```

### Exemplo 2: Tela Inicial - Dashboard com Saldo

```typescript
import { useCard } from '@/hooks/useCard'
import { useCardBalance } from '@/hooks/useCardBalance'
import { formatBalance } from '@/models/Account'

function Dashboard() {
  // Busca o cartão selecionado
  const { selectedCard } = useCard()

  // Busca o saldo do cartão selecionado
  const { balance, isLoading } = useCardBalance(selectedCard)

  return (
    <div>
      <h1>Olá, {selectedCard?.printedName}</h1>

      <div className="balance-card">
        <p>Saldo disponível</p>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <h2>{formatBalance(balance || 0)}</h2>
        )}
      </div>

      <CardItem card={selectedCard} showBalance={true} />
    </div>
  )
}
```

### Exemplo 3: Lista de Cartões com Saldo

```typescript
import { useCard } from '@/hooks/useCard'
import { useCardBalance } from '@/hooks/useCardBalance'
import { formatBalance } from '@/models/Account'

function CardListWithBalance() {
  const { availableCards } = useCard()

  return (
    <div className="grid gap-4">
      {availableCards.map((card) => (
        <CardWithBalance key={card.cardId} card={card} />
      ))}
    </div>
  )
}

function CardWithBalance({ card }: { card: Card }) {
  const { balance, isLoading } = useCardBalance(card)

  return (
    <div className="card-item">
      <h3>{card.alias}</h3>
      <p>**** **** **** {card.last4Digits}</p>
      {isLoading ? (
        <span>Carregando saldo...</span>
      ) : (
        <span className="balance">{formatBalance(balance || 0)}</span>
      )}
    </div>
  )
}
```

### Exemplo 4: Seleção de Cartão com Atualização de Saldo

```typescript
import { useCard } from '@/hooks/useCard'
import { useCardBalance } from '@/hooks/useCardBalance'

function CardSelector() {
  const { selectedCard, availableCards, selectCard } = useCard()
  const { balance, isLoading, refetchBalance } = useCardBalance(selectedCard)

  const handleCardChange = (newCard: Card) => {
    selectCard(newCard)
    // O saldo será automaticamente buscado para o novo cartão
  }

  return (
    <div>
      <select onChange={(e) => {
        const card = availableCards.find(c => c.cardId === Number(e.target.value))
        if (card) handleCardChange(card)
      }}>
        {availableCards.map(card => (
          <option key={card.cardId} value={card.cardId}>
            {card.alias} - {card.last4Digits}
          </option>
        ))}
      </select>

      {selectedCard && (
        <div className="balance-display">
          <h3>Saldo do Cartão Selecionado</h3>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <>
              <p className="balance">{formatBalance(balance || 0)}</p>
              <button onClick={() => refetchBalance()}>
                Atualizar Saldo
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
```

## Fluxo de Dados

```
1. Componente usa useCard() para obter o cartão selecionado
   ↓
2. Componente usa useCardBalance(card) passando o cartão
   ↓
3. useCardBalance extrai card.account e busca o saldo
   ↓
4. useAccountService faz cache com TanStack Query
   ↓
5. accountRepository chama a API
   ↓
6. API retorna dados da conta com saldo (available)
   ↓
7. Dados são cacheados por 2 minutos
   ↓
8. Componente recebe o balance e pode formatar/exibir
```

## Cache e Performance

- **Stale Time**: 2 minutos (saldo pode mudar com frequência)
- **Retry**: 1 tentativa em caso de erro
- **Enabled**: Só busca se houver accountId válido
- **Invalidação**: Use `refetchBalance()` para forçar atualização

## Tratamento de Erros

```typescript
function SafeBalance({ card }: { card: Card }) {
  const { balance, isLoading, error } = useCardBalance(card)

  if (error) {
    return <div className="error">Erro ao carregar saldo</div>
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (balance === undefined) {
    return <div>Saldo não disponível</div>
  }

  return <div>Saldo: {formatBalance(balance)}</div>
}
```

## Notas Importantes

1. **Relação Card ↔ Account**: Cada cartão tem um `account` (número da conta)
2. **Saldo em Centavos**: A API retorna `available` em centavos (8520 = R$ 85,20)
3. **Formatação**: Use `formatBalance()` para exibir em formato BRL
4. **Cache**: O saldo é cacheado por 2 minutos para melhor performance
5. **Mobile-First**: O CardItem é totalmente responsivo e mobile-first
6. **Prop `showBalance`**: Controla se o saldo deve ser exibido no CardItem

## Próximos Passos (Sugestões)

- [ ] Adicionar pull-to-refresh para atualizar saldos
- [ ] Implementar notificações de saldo baixo
- [ ] Adicionar gráfico de evolução do saldo
- [ ] Implementar cache local com persistência
- [ ] Adicionar animações de transição no saldo
