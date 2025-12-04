# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bankard 2.0 is a simplified banking application frontend built with React (Vite) and TypeScript. The project focuses on card and account management with a mobile-first, fully responsive design. This is a simplified version designed for rapid development (approximately 1 day timeline).

**Core Features:**
- Card listing and management
- Account listing and management
- Balance tracking
- Banking services similar to banking apps

## Technology Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Router:** TanStack Router (file-based routing)
- **State Management:** Zustand (lightweight)
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui (Radix UI primitives) - latest version
- **Styling:** Tailwind CSS - latest version
- **Forms:** React Hook Form + Zod (validation ONLY for forms, not API responses)
- **Theme:** next-themes (dark/light mode support)

## Project Initialization

**Option 1: Quick Start (Recommended)**
```bash
# Using TanStack Router CLI (if available)
npx create-tsrouter-app@latest bankard-2.0

# Then add shadcn/ui
npx shadcn@latest init
```

**Option 2: Manual Setup**
```bash
# 1. Create Vite project
npm create vite@latest bankard-2.0 -- --template react-ts
cd bankard-2.0

# 2. Install TanStack Router
npm install @tanstack/react-router
npm install -D @tanstack/router-plugin @tanstack/router-devtools

# 3. Install other dependencies
npm install @tanstack/react-query zustand axios
npm install react-hook-form zod @hookform/resolvers

# 4. Install shadcn/ui + Tailwind
npx shadcn@latest init

# 5. Add theme support
npm install next-themes
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Generate TanStack Router routes (if using plugin)
npm run generate-routes

# Watch routes for changes
npm run watch-routes
```

## Architecture Overview

The codebase follows a **simplified Clean Architecture** with these distinct layers:

### Layer Structure

```
View (Components) → Hooks (ViewModel) → Services (Data + Cache) → Repositories (API Access)
                        ↓                      ↓                         ↓
                   UI State                TanStack Query           Simple TypeScript
                                           + Cache                  Types (no Zod)
```

**Key differences from traditional Clean Architecture:**
- **No UseCases layer** - Business logic lives in hooks or services (simplified for speed)
- **No Zod validation for API** - Simple TypeScript interfaces/types only
- **Zod only for forms** - Validation happens at form input level, not API level

### Directory Structure

```
/src
  /components
    /ui                 - shadcn/ui base components
    /custom             - Custom reusable components
    /layout             - Layout components (Header, Sidebar, etc.)
    /cards              - Card management feature components
    /accounts           - Account management feature components

  /hooks                - Custom hooks (ViewModels/Controllers)
                        - Business logic and state management

  /services             - TanStack Query services
                        - React Query wrappers for data fetching

  /repositories         - Data access layer (API calls)
                        - API endpoint implementations

  /models               - TypeScript types/interfaces ONLY
                        - Type definitions for domain entities

  /stores               - Zustand global state
    - authStore.ts      - Authentication state
    - appStore.ts       - General app state

  /lib                  - Utilities and configurations
    - api-client.ts     - Axios instance configuration
    - utils.ts          - General utilities (cn, formatters, etc.)
    - constants.ts      - App constants

  /routes               - TanStack Router file-based routes
    - __root.tsx        - Root layout
    - index.tsx         - Home/Dashboard
    - /cards/*          - Card routes
    - /accounts/*       - Account routes
```

## Important Patterns

### Data Flow Example

1. **Component** renders UI
2. Calls **hook** to get data and actions
3. **Hook** uses **service** which wraps TanStack Query
4. **Service** calls **repository** methods
5. **Repository** makes Axios call, returns data with TypeScript typing
6. Data flows back up: Repository → Service (cached) → Hook → Component

### No Zod Validation for API Responses

**Important:** Unlike the previous project, we do NOT validate API responses with Zod schemas. We trust the API and use simple TypeScript types.

```typescript
// ❌ Don't do this (no Zod parsing for API)
const response = await apiClient.get('/cards');
return CardSchema.parse(response.data); // NO!

// ✅ Do this instead (simple type assertion)
const response = await apiClient.get<Card[]>('/cards');
return response.data; // Just return typed data
```

### Zod Only for Form Validation

```typescript
// ✅ Use Zod for form schemas
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

// Use with React Hook Form
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
});
```

### Mobile-First Responsive Design

**Critical:** All components MUST be built with mobile-first approach using Tailwind breakpoints.

```tsx
// ✅ Mobile-first pattern
<div className="
  flex flex-col gap-2          /* Mobile: vertical stack */
  sm:flex-row sm:gap-4         /* Tablet: horizontal */
  md:gap-6                     /* Desktop: larger gaps */
">
  <CardItem />
</div>

// ✅ Responsive grid
<div className="
  grid grid-cols-1             /* Mobile: 1 column */
  sm:grid-cols-2               /* Tablet: 2 columns */
  lg:grid-cols-3               /* Desktop: 3 columns */
  gap-4
">
  {cards.map(card => <CardItem key={card.id} card={card} />)}
</div>
```

**Tailwind Breakpoints:**
- `sm:` - 640px (tablet portrait)
- `md:` - 768px (tablet landscape)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (large desktop)

### TanStack Query Pattern

```typescript
// In service file
export const useEntityService = () => {
  const queryClient = useQueryClient();

  const entityQuery = useQuery({
    queryKey: ['entities'],
    queryFn: () => entityRepository.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addEntityMutation = useMutation({
    mutationFn: (entity: CreateEntityDTO) => entityRepository.create(entity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });

  return {
    entities: entityQuery.data,
    isLoading: entityQuery.isLoading,
    error: entityQuery.error,
    addEntity: addEntityMutation.mutate,
  };
};
```

### Repository Pattern (Simplified)

```typescript
// entityRepository.ts
import { apiClient } from '@/lib/api-client';
import type { Entity, CreateEntityDTO } from '@/models/Entity';

class EntityRepository {
  async getAll(): Promise<Entity[]> {
    const response = await apiClient.get<Entity[]>('/entities');
    return response.data;
  }

  async getById(id: string): Promise<Entity> {
    const response = await apiClient.get<Entity>(`/entities/${id}`);
    return response.data;
  }

  async create(data: CreateEntityDTO): Promise<Entity> {
    const response = await apiClient.post<Entity>('/entities', data);
    return response.data;
  }

  async update(id: string, data: Partial<Entity>): Promise<Entity> {
    const response = await apiClient.put<Entity>(`/entities/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/entities/${id}`);
  }
}

export const entityRepository = new EntityRepository();
```

**Note:** No Zod validation, no interfaces, just simple classes with TypeScript types.

### Zustand Store Pattern

```typescript
// authStore.ts
import { create } from 'zustand';
import type { User } from '@/models/User';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Custom Hook Pattern

```typescript
// useEntity.ts
import { useEntityService } from '@/services/entityService';
import { useToast } from '@/hooks/useToast';

export const useEntity = () => {
  const { entities, isLoading, error, addEntity } = useEntityService();
  const { toast } = useToast();

  const handleAddEntity = async (data: CreateEntityDTO) => {
    try {
      await addEntity(data);
      toast({
        title: 'Item adicionado',
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

  return {
    entities,
    isLoading,
    error,
    addEntity: handleAddEntity,
  };
};
```

## Code Guidelines

### When Creating New Features

1. **Define Model:** Create TypeScript interface in `/models` (no Zod schema)
2. **Create Repository:** Implement API calls with typed responses
3. **Create Service:** Wrap repository with TanStack Query for caching
4. **Create Hook:** Add UI logic and connect service to components
5. **Build Components:** Create mobile-first responsive UI

### Simplified Rules

- **No Zod for API:** Only use TypeScript types for API responses
- **Zod only for forms:** Validate user input with Zod + React Hook Form
- **No UseCases:** Keep business logic in hooks or services
- **Mobile-first always:** Start with mobile layout, then add breakpoints
- **Keep it simple:** We have ~1 day, avoid over-engineering

## Path Aliasing

TypeScript and Vite configured with `@/` alias pointing to `/src`:

```typescript
import { useEntity } from "@/hooks/useEntity";
import type { Entity } from "@/models/Entity";
import { Button } from "@/components/ui/button";
```

## Styling

- Tailwind CSS with custom theme configuration
- CSS variables for theming (dark/light mode)
- `cn()` utility from `lib/utils.ts` for conditional classes
- shadcn/ui components are pre-styled and customizable
- **100% responsive, mobile-first design required**

## Common Pitfalls

- **Don't use Zod for API validation** - Only TypeScript types
- **Don't skip mobile breakpoints** - Always design mobile-first
- **Don't over-engineer** - Keep it simple, we have limited time
- **Don't forget query invalidation** - After mutations, invalidate queries
- **Don't manually edit route tree files** - TanStack Router auto-generates them

## Application Domain

**Banking App Features:**
- **Cards:** Display, create, update card information and balances
- **Accounts:** Manage bank accounts and view balances
- **Services:** Banking operations (transfers, payments, etc. - to be defined)
- **Responsive:** Must work perfectly on mobile devices (primary focus)

Additional business rules will be provided during development.
