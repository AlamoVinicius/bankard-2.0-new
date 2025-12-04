# Development Guidelines - Bankard 2.0

## Core Principles

### 1. Simplicity Over Complexity
- Avoid over-engineering solutions
- Keep code readable and maintainable
- Don't add features that aren't explicitly requested
- Prefer simple solutions over complex abstractions

### 2. Mobile-First Always
- Every component must work on mobile devices first
- Use Tailwind responsive breakpoints progressively
- Test on mobile viewport during development
- Consider touch interactions and thumb zones

### 3. Type Safety
- Leverage TypeScript throughout the codebase
- Define explicit types for all data structures
- Avoid `any` type unless absolutely necessary
- Use type inference where appropriate

### 4. Performance Consciousness
- Minimize re-renders with proper memoization
- Use TanStack Query caching effectively
- Lazy load routes and heavy components
- Optimize images and assets

## Code Style

### TypeScript Conventions

#### Naming Conventions

```typescript
// Interfaces and Types - PascalCase
interface User {
  id: string;
  name: string;
}

type CardStatus = 'active' | 'blocked' | 'expired';

// Variables and Functions - camelCase
const userBalance = 1000;
function calculateTotal(amount: number): number { }

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// React Components - PascalCase
function CardItem({ card }: CardItemProps) { }

// Custom Hooks - camelCase with 'use' prefix
function useCardService() { }

// Files - kebab-case or PascalCase
// card-item.tsx or CardItem.tsx (prefer PascalCase for components)
```

#### Type Definitions

```typescript
// ✅ Good - Explicit interface
interface Card {
  id: string;
  number: string;
  balance: number;
  status: CardStatus;
}

// ✅ Good - Type for unions
type CardStatus = 'active' | 'blocked' | 'expired';

// ❌ Bad - Using any
function processCard(card: any) { }

// ✅ Good - Proper typing
function processCard(card: Card): void { }

// ✅ Good - Inference when obvious
const cards = useCardService(); // Type inferred from hook return

// ✅ Good - Generic types
interface ApiResponse<T> {
  data: T;
  status: number;
}
```

### React Component Patterns

#### Component Structure

```typescript
// 1. Imports - grouped logically
import { useState } from 'react';
import { useCardService } from '@/services/cardService';
import { Card } from '@/models/Card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

// 2. Type definitions
interface CardItemProps {
  card: Card;
  onSelect?: (card: Card) => void;
}

// 3. Component definition
export function CardItem({ card, onSelect }: CardItemProps) {
  // 4. Hooks (always at top)
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Derived state
  const isActive = card.status === 'active';

  // 6. Event handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onSelect?.(card);
  };

  // 7. Early returns
  if (!card) return null;

  // 8. Main render
  return (
    <div onClick={handleClick}>
      {/* Component JSX */}
    </div>
  );
}
```

#### Props Patterns

```typescript
// ✅ Good - Destructure props
function CardItem({ card, onSelect }: CardItemProps) { }

// ❌ Bad - Don't use props object directly
function CardItem(props: CardItemProps) {
  return <div>{props.card.name}</div>
}

// ✅ Good - Optional props with ?
interface CardItemProps {
  card: Card;
  onSelect?: (card: Card) => void;
  className?: string;
}

// ✅ Good - Default props via destructuring
function CardItem({
  card,
  onSelect,
  className = ''
}: CardItemProps) { }
```

#### Component Export Patterns

```typescript
// ✅ Preferred - Named export
export function CardItem({ card }: CardItemProps) { }

// ✅ Also acceptable - Default export for page components
export default function CardsPage() { }

// ❌ Avoid - Mixed exports
export default CardItem;
export { CardItem };
```

### Custom Hooks

#### Hook Structure

```typescript
// useEntity.ts
import { useEntityService } from '@/services/entityService';
import { useToast } from '@/hooks/useToast';
import type { Entity, CreateEntityDTO } from '@/models/Entity';

export function useEntity() {
  // 1. Service hooks
  const { entities, isLoading, error, addEntity, updateEntity } = useEntityService();
  const { toast } = useToast();

  // 2. Business logic functions
  const handleAddEntity = async (data: CreateEntityDTO) => {
    try {
      await addEntity(data);
      toast({
        title: 'Sucesso',
        description: 'Item adicionado com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o item.',
        variant: 'destructive',
      });
    }
  };

  // 3. Return public API
  return {
    entities,
    isLoading,
    error,
    addEntity: handleAddEntity,
    updateEntity,
  };
}
```

#### Hook Rules

```typescript
// ✅ Good - Always prefix with 'use'
function useCardBalance() { }

// ❌ Bad - Missing 'use' prefix
function cardBalance() { }

// ✅ Good - Call hooks at top level
function useCard(id: string) {
  const { data } = useQuery(['card', id], () => fetchCard(id));
  return data;
}

// ❌ Bad - Conditional hook calls
function useCard(id: string) {
  if (id) {
    const { data } = useQuery(['card', id], () => fetchCard(id)); // ❌
  }
}
```

## Architecture Patterns

### Repository Layer

```typescript
// cardRepository.ts
import { apiClient } from '@/lib/api-client';
import type { Card, CreateCardDTO } from '@/models/Card';

class CardRepository {
  private basePath = '/cards';

  async getAll(): Promise<Card[]> {
    const response = await apiClient.get<Card[]>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<Card> {
    const response = await apiClient.get<Card>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateCardDTO): Promise<Card> {
    const response = await apiClient.post<Card>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<Card>): Promise<Card> {
    const response = await apiClient.put<Card>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const cardRepository = new CardRepository();
```

**Repository Rules:**
- One repository class per entity
- Export singleton instance
- Simple TypeScript classes (no interfaces)
- No business logic - just API calls
- Return typed data (no Zod validation)

### Service Layer

```typescript
// cardService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardRepository } from '@/repositories/cardRepository';
import type { Card, CreateCardDTO } from '@/models/Card';

const QUERY_KEY = 'cards';

export function useCardService() {
  const queryClient = useQueryClient();

  // Query: Get all cards
  const cardsQuery = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => cardRepository.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query: Get single card
  const useCard = (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => cardRepository.getById(id),
      enabled: !!id,
    });
  };

  // Mutation: Create card
  const createCardMutation = useMutation({
    mutationFn: (data: CreateCardDTO) => cardRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  // Mutation: Update card
  const updateCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Card> }) =>
      cardRepository.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });

  return {
    // Queries
    cards: cardsQuery.data,
    isLoading: cardsQuery.isLoading,
    error: cardsQuery.error,
    useCard,

    // Mutations
    createCard: createCardMutation.mutateAsync,
    updateCard: updateCardMutation.mutateAsync,
    isCreating: createCardMutation.isPending,
    isUpdating: updateCardMutation.isPending,
  };
}
```

**Service Rules:**
- Use TanStack Query hooks
- Define query keys as constants
- Invalidate queries after mutations
- Return clean API for components
- Handle loading and error states

### Model Layer

```typescript
// Card.ts
export interface Card {
  id: string;
  userId: string;
  number: string;
  holderName: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  limit: number;
  status: CardStatus;
  type: CardType;
  createdAt: string;
  updatedAt: string;
}

export type CardStatus = 'active' | 'blocked' | 'expired' | 'pending';
export type CardType = 'credit' | 'debit' | 'prepaid';

export interface CreateCardDTO {
  type: CardType;
  holderName: string;
  limit?: number;
}

export interface UpdateCardDTO {
  holderName?: string;
  status?: CardStatus;
  limit?: number;
}
```

**Model Rules:**
- Use interfaces for objects
- Use type aliases for unions
- Separate DTOs for create/update operations
- NO Zod schemas (just TypeScript)
- Document complex fields with comments

## Form Handling

### React Hook Form + Zod Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define Zod schema
const cardFormSchema = z.object({
  holderName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  type: z.enum(['credit', 'debit', 'prepaid'], {
    required_error: 'Selecione o tipo do cartão',
  }),
  limit: z.number().min(0).optional(),
});

type CardFormData = z.infer<typeof cardFormSchema>;

// 2. Use in component
function CreateCardForm() {
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      holderName: '',
      type: 'credit',
      limit: 1000,
    },
  });

  const onSubmit = async (data: CardFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

**Form Rules:**
- Zod ONLY for form validation (not API)
- Use `zodResolver` with React Hook Form
- Infer TypeScript types from Zod schema
- Provide helpful error messages in Portuguese
- Use `defaultValues` for form initialization

## Error Handling

### Repository Error Handling

```typescript
// Let errors propagate naturally
async getAll(): Promise<Card[]> {
  const response = await apiClient.get<Card[]>('/cards');
  return response.data; // Axios errors will throw automatically
}
```

### Service Error Handling

```typescript
// TanStack Query handles errors
const cardsQuery = useQuery({
  queryKey: ['cards'],
  queryFn: () => cardRepository.getAll(),
  // Error available in cardsQuery.error
});
```

### Hook/Component Error Handling

```typescript
// Display errors to users
function useCard() {
  const { cards, error } = useCardService();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erro ao carregar cartões',
        description: 'Não foi possível carregar seus cartões. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return { cards };
}
```

## File Organization

### Feature-Based Structure

```
/components
  /cards
    CardItem.tsx
    CardList.tsx
    CreateCardDialog.tsx

/hooks
  useCard.ts
  useCards.ts

/services
  cardService.ts

/repositories
  cardRepository.ts

/models
  Card.ts
```

### Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal modules (absolute imports)
import { Card } from '@/models/Card';
import { useCardService } from '@/services/cardService';

// 3. Components
import { Button } from '@/components/ui/button';
import { CardItem } from '@/components/cards/CardItem';

// 4. Utilities
import { cn, formatCurrency } from '@/lib/utils';

// 5. Types (if not imported with modules)
import type { CardStatus } from '@/models/Card';

// 6. Styles (if any)
import './styles.css';
```

## Testing Guidelines

While testing is not in initial scope, follow these patterns when adding tests:

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
  });
});
```

### Component Tests (React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { CardItem } from './CardItem';

describe('CardItem', () => {
  it('renders card number', () => {
    const card = { id: '1', number: '1234' };
    render(<CardItem card={card} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });
});
```

## Git Workflow

### Commit Messages

Follow conventional commits:

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(cards): add card creation dialog
fix(auth): resolve token refresh issue
refactor(hooks): simplify useCard hook
style(ui): update button spacing
docs(readme): add setup instructions
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `style` - Code style changes
- `docs` - Documentation
- `test` - Adding tests
- `chore` - Maintenance tasks

### Branch Naming

```bash
feature/card-creation
fix/balance-calculation
refactor/repository-layer
```

## Code Review Checklist

Before submitting code:

- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings
- [ ] Components are mobile-responsive
- [ ] Proper error handling implemented
- [ ] Loading states shown to users
- [ ] Toast notifications for user actions
- [ ] No console.log statements (use proper logging)
- [ ] Clean imports (no unused)
- [ ] Follows naming conventions
- [ ] Comments added for complex logic only

## Common Pitfalls to Avoid

### ❌ Don't: Over-engineer

```typescript
// ❌ Bad - Unnecessary abstraction
abstract class BaseRepository<T> {
  abstract getAll(): Promise<T[]>;
}

class CardRepository extends BaseRepository<Card> {
  getAll() { }
}
```

```typescript
// ✅ Good - Simple class
class CardRepository {
  async getAll(): Promise<Card[]> { }
}
```

### ❌ Don't: Use Zod for API

```typescript
// ❌ Bad - Validating API response
const CardSchema = z.object({ id: z.string() });
const response = await apiClient.get('/cards');
return CardSchema.parse(response.data); // NO!
```

```typescript
// ✅ Good - Simple typing
const response = await apiClient.get<Card[]>('/cards');
return response.data;
```

### ❌ Don't: Ignore Mobile

```typescript
// ❌ Bad - Desktop only
<div className="flex gap-6">

// ✅ Good - Mobile first
<div className="flex flex-col gap-2 md:flex-row md:gap-6">
```

### ❌ Don't: Forget Query Invalidation

```typescript
// ❌ Bad - Cache not updated
const createCard = useMutation({
  mutationFn: (data) => cardRepository.create(data),
});

// ✅ Good - Invalidate cache
const createCard = useMutation({
  mutationFn: (data) => cardRepository.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cards'] });
  },
});
```

## Performance Best Practices

### Memoization

```typescript
// ✅ Use React.memo for expensive components
export const CardItem = React.memo(({ card }: CardItemProps) => {
  return <div>{card.name}</div>;
});

// ✅ Use useMemo for expensive calculations
const sortedCards = useMemo(() => {
  return cards.sort((a, b) => b.balance - a.balance);
}, [cards]);

// ✅ Use useCallback for functions passed as props
const handleSelect = useCallback((card: Card) => {
  onSelect(card);
}, [onSelect]);
```

### Avoid Unnecessary Re-renders

```typescript
// ❌ Bad - Creates new object every render
<CardItem card={card} style={{ padding: 20 }} />

// ✅ Good - Use CSS classes
<CardItem card={card} className="p-5" />
```

## Accessibility

### ARIA Labels

```typescript
<button aria-label="Fechar diálogo">
  <X className="h-4 w-4" />
</button>
```

### Keyboard Navigation

```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Clicável
</div>
```

## Summary

- Keep it simple - avoid over-engineering
- Mobile-first always
- Type everything with TypeScript
- No Zod for API - only forms
- Use TanStack Query effectively
- Follow naming conventions
- Write clean, readable code
