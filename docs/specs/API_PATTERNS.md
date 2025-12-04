# API Patterns - Bankard 2.0

## Overview

This document describes the data flow patterns, API integration strategies, and TanStack Query usage patterns for Bankard 2.0.

## Data Flow Architecture

### Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Component Layer                         │
│  - Renders UI                                                │
│  - Handles user interactions                                 │
│  - Displays loading/error states                             │
└────────────────────┬─────────────────────────────────────────┘
                     │ calls
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      Custom Hook Layer                       │
│  - Business logic                                            │
│  - User feedback (toasts)                                    │
│  - Data transformation                                       │
└────────────────────┬─────────────────────────────────────────┘
                     │ uses
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  - TanStack Query (useQuery/useMutation)                     │
│  - Cache management                                          │
│  - Query invalidation                                        │
└────────────────────┬─────────────────────────────────────────┘
                     │ calls
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      Repository Layer                        │
│  - Axios HTTP calls                                          │
│  - Endpoint definitions                                      │
│  - Response typing                                           │
└────────────────────┬─────────────────────────────────────────┘
                     │ requests
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│  - REST endpoints                                            │
│  - Business logic                                            │
│  - Database access                                           │
└──────────────────────────────────────────────────────────────┘
```

## Layer-by-Layer Patterns

### 1. Repository Layer Pattern

**Purpose:** Handle HTTP requests and responses

#### Basic Repository Template

```typescript
// entityRepository.ts
import { apiClient } from '@/lib/api-client';
import type { Entity, CreateEntityDTO, UpdateEntityDTO } from '@/models/Entity';

class EntityRepository {
  private readonly basePath = '/entities';

  async getAll(): Promise<Entity[]> {
    const response = await apiClient.get<Entity[]>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<Entity> {
    const response = await apiClient.get<Entity>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateEntityDTO): Promise<Entity> {
    const response = await apiClient.post<Entity>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateEntityDTO): Promise<Entity> {
    const response = await apiClient.put<Entity>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async patch(id: string, data: Partial<Entity>): Promise<Entity> {
    const response = await apiClient.patch<Entity>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const entityRepository = new EntityRepository();
```

#### Repository with Query Parameters

```typescript
interface GetCardsParams {
  status?: CardStatus;
  type?: CardType;
  limit?: number;
  offset?: number;
}

class CardRepository {
  async getAll(params?: GetCardsParams): Promise<Card[]> {
    const response = await apiClient.get<Card[]>('/cards', { params });
    return response.data;
  }

  async search(query: string): Promise<Card[]> {
    const response = await apiClient.get<Card[]>('/cards/search', {
      params: { q: query },
    });
    return response.data;
  }
}
```

#### Repository with Custom Endpoints

```typescript
class CardRepository {
  async blockCard(id: string): Promise<Card> {
    const response = await apiClient.post<Card>(`/cards/${id}/block`);
    return response.data;
  }

  async unblockCard(id: string): Promise<Card> {
    const response = await apiClient.post<Card>(`/cards/${id}/unblock`);
    return response.data;
  }

  async getTransactions(cardId: string, limit = 10): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>(
      `/cards/${cardId}/transactions`,
      { params: { limit } }
    );
    return response.data;
  }
}
```

### 2. Service Layer Pattern

**Purpose:** Wrap repositories with TanStack Query for caching and state management

#### Basic Service Template

```typescript
// entityService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entityRepository } from '@/repositories/entityRepository';
import type { Entity, CreateEntityDTO, UpdateEntityDTO } from '@/models/Entity';

// Query key factory
const entityKeys = {
  all: ['entities'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  list: (filters: string) => [...entityKeys.lists(), { filters }] as const,
  details: () => [...entityKeys.all, 'detail'] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
};

export function useEntityService() {
  const queryClient = useQueryClient();

  // Query: Get all entities
  const entitiesQuery = useQuery({
    queryKey: entityKeys.lists(),
    queryFn: () => entityRepository.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query: Get single entity
  const useEntity = (id: string) => {
    return useQuery({
      queryKey: entityKeys.detail(id),
      queryFn: () => entityRepository.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Mutation: Create entity
  const createMutation = useMutation({
    mutationFn: (data: CreateEntityDTO) => entityRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.lists() });
    },
  });

  // Mutation: Update entity
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntityDTO }) =>
      entityRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: entityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entityKeys.detail(variables.id) });
    },
  });

  // Mutation: Delete entity
  const deleteMutation = useMutation({
    mutationFn: (id: string) => entityRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.lists() });
    },
  });

  return {
    // Queries
    entities: entitiesQuery.data,
    isLoading: entitiesQuery.isLoading,
    error: entitiesQuery.error,
    refetch: entitiesQuery.refetch,
    useEntity,

    // Mutations
    createEntity: createMutation.mutateAsync,
    updateEntity: updateMutation.mutateAsync,
    deleteEntity: deleteMutation.mutateAsync,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

#### Service with Optimistic Updates

```typescript
export function useCardService() {
  const queryClient = useQueryClient();

  const updateCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Card> }) =>
      cardRepository.update(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cards', id] });

      // Snapshot previous value
      const previousCard = queryClient.getQueryData<Card>(['cards', id]);

      // Optimistically update to the new value
      if (previousCard) {
        queryClient.setQueryData<Card>(['cards', id], {
          ...previousCard,
          ...data,
        });
      }

      // Return context with previous value
      return { previousCard };
    },

    // If mutation fails, rollback
    onError: (err, variables, context) => {
      if (context?.previousCard) {
        queryClient.setQueryData(['cards', variables.id], context.previousCard);
      }
    },

    // Always refetch after error or success
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.id] });
    },
  });

  return {
    updateCard: updateCardMutation.mutateAsync,
  };
}
```

#### Service with Pagination

```typescript
export function useCardService() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const cardsQuery = useQuery({
    queryKey: ['cards', { page, pageSize }],
    queryFn: () => cardRepository.getAll({
      limit: pageSize,
      offset: (page - 1) * pageSize
    }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  return {
    cards: cardsQuery.data,
    isLoading: cardsQuery.isLoading,
    page,
    setPage,
    hasMore: cardsQuery.data?.length === pageSize,
  };
}
```

#### Service with Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function useCardService() {
  const cardsQuery = useInfiniteQuery({
    queryKey: ['cards', 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      cardRepository.getAll({ limit: 10, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length * 10;
    },
    initialPageParam: 0,
  });

  return {
    cards: cardsQuery.data?.pages.flat(),
    isLoading: cardsQuery.isLoading,
    fetchNextPage: cardsQuery.fetchNextPage,
    hasNextPage: cardsQuery.hasNextPage,
    isFetchingNextPage: cardsQuery.isFetchingNextPage,
  };
}
```

### 3. Custom Hook Layer Pattern

**Purpose:** Add business logic and user feedback

#### Basic Custom Hook

```typescript
// useCard.ts
import { useCardService } from '@/services/cardService';
import { useToast } from '@/hooks/useToast';
import type { CreateCardDTO } from '@/models/Card';

export function useCard() {
  const { cards, isLoading, error, createCard, updateCard } = useCardService();
  const { toast } = useToast();

  const handleCreateCard = async (data: CreateCardDTO) => {
    try {
      await createCard(data);
      toast({
        title: 'Cartão criado',
        description: 'Seu cartão foi criado com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar cartão',
        description: 'Não foi possível criar o cartão. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleBlockCard = async (id: string) => {
    try {
      await updateCard({ id, data: { status: 'blocked' } });
      toast({
        title: 'Cartão bloqueado',
        description: 'Seu cartão foi bloqueado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao bloquear cartão',
        description: 'Não foi possível bloquear o cartão.',
        variant: 'destructive',
      });
    }
  };

  return {
    cards,
    isLoading,
    error,
    createCard: handleCreateCard,
    blockCard: handleBlockCard,
  };
}
```

#### Hook with Data Transformation

```typescript
export function useCard() {
  const { cards, isLoading } = useCardService();

  // Transform/filter data
  const activeCards = useMemo(
    () => cards?.filter((card) => card.status === 'active') ?? [],
    [cards]
  );

  const blockedCards = useMemo(
    () => cards?.filter((card) => card.status === 'blocked') ?? [],
    [cards]
  );

  const totalBalance = useMemo(
    () => cards?.reduce((sum, card) => sum + card.balance, 0) ?? 0,
    [cards]
  );

  return {
    activeCards,
    blockedCards,
    totalBalance,
    isLoading,
  };
}
```

### 4. Component Usage Pattern

```typescript
// CardList.tsx
import { useCard } from '@/hooks/useCard';
import { CardItem } from './CardItem';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';

export function CardList() {
  const { cards, isLoading, error } = useCard();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar seus cartões.
        </AlertDescription>
      </Alert>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Você ainda não tem cartões cadastrados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
```

## Query Key Management

### Query Key Factory Pattern

```typescript
// cardKeys.ts
export const cardKeys = {
  all: ['cards'] as const,
  lists: () => [...cardKeys.all, 'list'] as const,
  list: (filters: CardFilters) => [...cardKeys.lists(), filters] as const,
  details: () => [...cardKeys.all, 'detail'] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
  transactions: (id: string) => [...cardKeys.detail(id), 'transactions'] as const,
};

// Usage in service
const cardsQuery = useQuery({
  queryKey: cardKeys.lists(),
  queryFn: () => cardRepository.getAll(),
});

const cardQuery = useQuery({
  queryKey: cardKeys.detail(id),
  queryFn: () => cardRepository.getById(id),
});
```

**Benefits:**
- Type-safe query keys
- Centralized key management
- Easy invalidation patterns
- Prevents typos

### Invalidation Patterns

```typescript
// Invalidate all cards
queryClient.invalidateQueries({ queryKey: cardKeys.all });

// Invalidate all card lists
queryClient.invalidateQueries({ queryKey: cardKeys.lists() });

// Invalidate specific card
queryClient.invalidateQueries({ queryKey: cardKeys.detail(cardId) });

// Invalidate card and its transactions
queryClient.invalidateQueries({ queryKey: cardKeys.detail(cardId) });
queryClient.invalidateQueries({ queryKey: cardKeys.transactions(cardId) });
```

## Caching Strategies

### Default Strategy (5-minute stale time)

```typescript
const query = useQuery({
  queryKey: ['cards'],
  queryFn: () => cardRepository.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});
```

### Real-time Data (Always fresh)

```typescript
const query = useQuery({
  queryKey: ['account', 'balance'],
  queryFn: () => accountRepository.getBalance(),
  staleTime: 0, // Always stale
  refetchInterval: 30 * 1000, // Refetch every 30 seconds
});
```

### Rarely Changes (Long cache)

```typescript
const query = useQuery({
  queryKey: ['user', 'profile'],
  queryFn: () => userRepository.getProfile(),
  staleTime: 60 * 60 * 1000, // 1 hour
  gcTime: 24 * 60 * 60 * 1000, // 24 hours
});
```

### Conditional Fetching

```typescript
const query = useQuery({
  queryKey: ['card', cardId],
  queryFn: () => cardRepository.getById(cardId),
  enabled: !!cardId && isAuthenticated,
});
```

## Error Handling Patterns

### Global Error Handler (Axios Interceptor)

```typescript
// lib/api-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Show permission error
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para realizar esta ação.',
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);
```

### Service-Level Error Handling

```typescript
const mutation = useMutation({
  mutationFn: (data) => cardRepository.create(data),
  onError: (error) => {
    console.error('Failed to create card:', error);
    // Error available to consumer
  },
});
```

### Component-Level Error Display

```typescript
function CardList() {
  const { cards, error } = useCardService();

  if (error) {
    return <ErrorMessage message="Não foi possível carregar os cartões" />;
  }

  return <div>{/* Render cards */}</div>;
}
```

## Loading States

### Skeleton Loading

```typescript
function CardList() {
  const { cards, isLoading } = useCardService();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <div>{/* Render cards */}</div>;
}
```

### Inline Loading (Mutations)

```typescript
function CreateCardButton() {
  const { createCard, isCreating } = useCardService();

  return (
    <Button onClick={handleCreate} disabled={isCreating}>
      {isCreating ? 'Criando...' : 'Criar Cartão'}
    </Button>
  );
}
```

## Dependent Queries

### Sequential Queries

```typescript
function CardTransactions({ cardId }: { cardId: string }) {
  // First query
  const { data: card } = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => cardRepository.getById(cardId),
  });

  // Second query depends on first
  const { data: transactions } = useQuery({
    queryKey: ['transactions', cardId],
    queryFn: () => transactionRepository.getByCardId(cardId),
    enabled: !!card, // Only run if card exists
  });

  return <div>{/* Render */}</div>;
}
```

## Prefetching Data

### Prefetch on Hover

```typescript
function CardItem({ card }: { card: Card }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['card', card.id],
      queryFn: () => cardRepository.getById(card.id),
    });
  };

  return <div onMouseEnter={handleMouseEnter}>{/* Card */}</div>;
}
```

### Prefetch on Route Change

```typescript
function CardsPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch related data
    queryClient.prefetchQuery({
      queryKey: ['accounts'],
      queryFn: () => accountRepository.getAll(),
    });
  }, [queryClient]);

  return <div>{/* Page content */}</div>;
}
```

## Summary

- **Repository:** Simple API calls with TypeScript types
- **Service:** TanStack Query wrappers with caching
- **Hook:** Business logic + user feedback
- **Component:** UI rendering + interaction
- **Query Keys:** Centralized with factory pattern
- **Caching:** 5-minute default, adjustable per query
- **Errors:** Handled at multiple levels with user feedback
- **Loading:** Skeleton screens and inline states
