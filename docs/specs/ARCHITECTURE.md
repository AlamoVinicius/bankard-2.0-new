# Architecture Specification - Bankard 2.0

## Architecture Overview

Bankard 2.0 follows a **Simplified Clean Architecture** pattern optimized for rapid development. Unlike traditional Clean Architecture, this implementation removes unnecessary layers to maintain development speed while preserving code organization.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    View Layer                           │
│              (React Components)                         │
│  - UI Components                                        │
│  - Layout Components                                    │
│  - Feature Components                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  Hooks Layer                            │
│            (ViewModel/Controller)                       │
│  - Custom Hooks                                         │
│  - Business Logic                                       │
│  - UI State Management                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                Services Layer                           │
│         (Data Fetching + Cache)                         │
│  - TanStack Query Wrappers                              │
│  - React Query Cache Management                         │
│  - Query/Mutation Logic                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Repositories Layer                         │
│              (API Access)                               │
│  - HTTP Requests (Axios)                                │
│  - API Endpoints                                        │
│  - TypeScript Types                                     │
└─────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. No UseCases Layer
**Decision:** Remove the traditional UseCases/Interactors layer.

**Rationale:**
- Simplifies architecture for rapid development
- Business logic lives in hooks or services
- Reduces boilerplate code
- Appropriate for frontend applications with simple business rules

### 2. No Zod Validation for API
**Decision:** Use simple TypeScript types for API responses instead of Zod schemas.

**Rationale:**
- Trust the backend API contract
- Reduces validation overhead
- Faster development
- TypeScript provides compile-time safety
- Zod reserved only for form validation (user input)

### 3. TanStack Query as Primary Cache
**Decision:** Use TanStack Query (React Query) for all data fetching and caching.

**Rationale:**
- Built-in caching, refetching, and background updates
- Reduces need for global state management
- Optimistic updates support
- Automatic stale data management

## Directory Structure

```
/src
├── /components              # View Layer
│   ├── /ui                  # shadcn/ui base components
│   ├── /custom              # Custom reusable components
│   ├── /layout              # Layout components (Header, Sidebar)
│   ├── /cards               # Card feature components
│   └── /accounts            # Account feature components
│
├── /hooks                   # Hooks Layer (ViewModel)
│   ├── useEntity.ts         # Feature-specific hooks
│   ├── useToast.ts          # UI utility hooks
│   └── useAuth.ts           # Authentication hooks
│
├── /services                # Services Layer (Data + Cache)
│   ├── entityService.ts     # TanStack Query wrappers
│   ├── cardService.ts       # Card data operations
│   └── accountService.ts    # Account data operations
│
├── /repositories            # Repository Layer (API)
│   ├── entityRepository.ts  # API calls with Axios
│   ├── cardRepository.ts    # Card API endpoints
│   └── accountRepository.ts # Account API endpoints
│
├── /models                  # Data Models (TypeScript only)
│   ├── Entity.ts            # Type definitions
│   ├── Card.ts              # Card types
│   └── Account.ts           # Account types
│
├── /stores                  # Global State (Zustand)
│   ├── authStore.ts         # Authentication state
│   └── appStore.ts          # General app state
│
├── /lib                     # Utilities & Config
│   ├── api-client.ts        # Axios instance
│   ├── utils.ts             # Helper functions (cn, formatters)
│   └── constants.ts         # App constants
│
└── /routes                  # TanStack Router (file-based)
    ├── __root.tsx           # Root layout
    ├── index.tsx            # Home/Dashboard
    ├── /cards/              # Card routes
    │   ├── index.tsx        # Card list
    │   └── $cardId.tsx      # Card detail
    └── /accounts/           # Account routes
        ├── index.tsx        # Account list
        └── $accountId.tsx   # Account detail
```

## Data Flow

### Standard Data Flow Pattern

```
1. Component renders
   └─> Calls custom hook

2. Hook manages UI logic
   └─> Calls service

3. Service wraps TanStack Query
   └─> Calls repository

4. Repository makes HTTP request
   └─> Returns typed data

5. Data flows back:
   Repository → Service (cached) → Hook → Component
```

### Example Flow: Fetching Cards

```typescript
// 1. Component
function CardList() {
  const { cards, isLoading } = useCards();

  if (isLoading) return <Spinner />;
  return cards.map(card => <CardItem key={card.id} card={card} />);
}

// 2. Hook (ViewModel)
function useCards() {
  const { cards, isLoading, error } = useCardService();
  return { cards, isLoading, error };
}

// 3. Service (TanStack Query)
function useCardService() {
  const query = useQuery({
    queryKey: ['cards'],
    queryFn: () => cardRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
  return { cards: query.data, isLoading: query.isLoading };
}

// 4. Repository (API)
class CardRepository {
  async getAll(): Promise<Card[]> {
    const response = await apiClient.get<Card[]>('/cards');
    return response.data; // Simple TypeScript typing
  }
}
```

## State Management Strategy

### TanStack Query (Server State)
- All server data fetching and caching
- Automatic background refetching
- Optimistic updates for mutations
- Cache invalidation strategies

### Zustand (Client State)
- Authentication state
- UI preferences (theme, language)
- Global app settings
- Non-server-related state

### Local Component State
- Form inputs
- UI toggles
- Temporary UI state
- Component-specific data

## Routing Architecture

### TanStack Router (File-Based)

File structure defines routes automatically:

```
/routes
  __root.tsx          → / (root layout)
  index.tsx           → / (home page)
  /cards
    index.tsx         → /cards (list)
    $cardId.tsx       → /cards/:cardId (detail)
  /accounts
    index.tsx         → /accounts (list)
    $accountId.tsx    → /accounts/:accountId (detail)
```

### Route Features
- Type-safe navigation
- Automatic code splitting
- Nested layouts
- Route-level data loading
- Search params validation

## Error Handling

### Layered Error Handling

```typescript
// Repository: Throw errors
async getAll(): Promise<Card[]> {
  const response = await apiClient.get<Card[]>('/cards');
  return response.data; // Let errors propagate
}

// Service: Expose errors via TanStack Query
const query = useQuery({
  queryKey: ['cards'],
  queryFn: () => cardRepository.getAll(),
  // Error available in query.error
});

// Hook: Handle errors with user feedback
const { cards, error } = useCardService();
if (error) {
  toast({
    title: 'Erro',
    description: 'Não foi possível carregar os cartões.',
    variant: 'destructive',
  });
}
```

## Performance Considerations

### Caching Strategy
- **Stale Time:** 5 minutes (adjustable per query)
- **Cache Time:** 10 minutes (after stale)
- **Refetch on Window Focus:** Enabled for critical data
- **Refetch on Reconnect:** Enabled

### Code Splitting
- Automatic route-based splitting via TanStack Router
- Lazy loading for heavy components
- Dynamic imports for large libraries

### Optimization Techniques
- Memoization with React.memo for expensive components
- useMemo/useCallback for computed values
- Virtual scrolling for long lists (if needed)
- Image lazy loading

## Security Considerations

- **API Client:** Axios interceptors for auth tokens
- **Protected Routes:** Authentication guards
- **Input Validation:** Zod schemas on forms
- **XSS Prevention:** React's built-in escaping
- **HTTPS Only:** All API calls over HTTPS

## Scalability Notes

While designed for rapid development, the architecture can scale:

1. **Add UseCases Layer:** If business logic grows complex
2. **Add Zod API Validation:** If API contract becomes unreliable
3. **Microservices:** Multiple repositories for different services
4. **State Machines:** XState for complex UI flows
5. **Feature Modules:** Group by feature instead of layer
