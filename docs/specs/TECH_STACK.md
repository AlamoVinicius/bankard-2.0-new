# Technology Stack - Bankard 2.0

## Core Technologies

### Framework & Build Tool
- **React 18** - UI library
  - Latest stable version
  - Hooks-based architecture
  - Concurrent features support

- **Vite** - Build tool and dev server
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support
  - Plugin ecosystem

### Language
- **TypeScript** - Primary language
  - Type safety throughout the codebase
  - Enhanced IDE support
  - Better refactoring capabilities
  - Compile-time error detection

## Routing

### TanStack Router
- **Version:** Latest stable
- **Features:**
  - File-based routing
  - Type-safe navigation
  - Automatic code splitting
  - Nested routes and layouts
  - Search params validation
  - Route-level data loading

**Why TanStack Router?**
- Best TypeScript integration
- Modern API design
- Built for React 18+
- Better DX than React Router

## State Management

### TanStack Query (React Query)
- **Version:** Latest v5
- **Purpose:** Server state management
- **Features:**
  - Data fetching and caching
  - Background refetching
  - Optimistic updates
  - Query invalidation
  - Automatic retries
  - Pagination and infinite queries

**Why TanStack Query?**
- Reduces need for global state
- Built-in caching strategies
- Excellent DevTools
- Industry standard for data fetching

### Zustand
- **Version:** Latest stable
- **Purpose:** Client-side global state
- **Features:**
  - Lightweight (< 1KB)
  - Simple API
  - No boilerplate
  - TypeScript first
  - React 18 compatible

**Usage:**
- Authentication state
- Theme preferences
- Global UI state
- User preferences

**Why Zustand?**
- Much simpler than Redux
- No Context Provider hell
- Better performance
- Minimal learning curve

## HTTP Client

### Axios
- **Version:** Latest stable
- **Features:**
  - Promise-based API
  - Request/response interceptors
  - Automatic JSON transformation
  - Request cancellation
  - Timeout handling
  - CSRF protection

**Configuration:**
- Base URL configuration
- Auth token interceptors
- Error handling middleware
- Request/response logging (dev mode)

## UI Framework

### shadcn/ui
- **Version:** Latest
- **Based on:** Radix UI primitives
- **Features:**
  - Copy-paste component library
  - Fully customizable
  - Accessible by default (ARIA)
  - Headless UI components
  - No runtime dependencies

**Components Used:**
- Button, Input, Select, Dialog
- Card, Sheet, Dropdown
- Toast, Alert, Badge
- Form, Label, Checkbox
- And more as needed

**Why shadcn/ui?**
- Not a package dependency (copy components)
- Full control over code
- Excellent accessibility
- Beautiful default styles
- Active development

### Radix UI
- **Version:** Latest (via shadcn/ui)
- **Purpose:** Unstyled, accessible UI primitives
- **Features:**
  - WAI-ARIA compliant
  - Keyboard navigation
  - Focus management
  - Screen reader support

## Styling

### Tailwind CSS
- **Version:** Latest v3+
- **Features:**
  - Utility-first CSS
  - JIT (Just-In-Time) compiler
  - Custom design system
  - Responsive design utilities
  - Dark mode support

**Configuration:**
- Custom color palette
- Custom spacing scale
- Component layer utilities
- Mobile-first breakpoints

**Breakpoints:**
```
sm:  640px  (tablet portrait)
md:  768px  (tablet landscape)
lg:  1024px (desktop)
xl:  1280px (large desktop)
2xl: 1536px (extra large)
```

### PostCSS
- **Version:** Latest
- **Plugins:**
  - Tailwind CSS
  - Autoprefixer
  - CSS nesting (if needed)

## Theme Management

### next-themes
- **Version:** Latest
- **Features:**
  - Dark/light mode toggle
  - System preference detection
  - No flash on load
  - localStorage persistence
  - SSR compatible

**Implementation:**
- CSS variables for colors
- Automatic class switching
- Theme provider wrapper
- useTheme hook

## Form Management

### React Hook Form
- **Version:** Latest v7
- **Features:**
  - Performance-focused (uncontrolled)
  - Minimal re-renders
  - Easy integration with UI libraries
  - Built-in validation
  - TypeScript support

**Why React Hook Form?**
- Best performance for forms
- Simple API
- Less boilerplate than Formik
- Excellent TypeScript support

### Zod
- **Version:** Latest v3
- **Purpose:** Form validation only
- **Features:**
  - TypeScript-first schema validation
  - Type inference
  - Composable schemas
  - Custom error messages

**Important:** Used ONLY for form validation, NOT for API response validation.

### @hookform/resolvers
- **Version:** Latest
- **Purpose:** Connect Zod with React Hook Form
- **Usage:** `zodResolver(schema)`

## Development Tools

### TypeScript ESLint
- **Version:** Latest v6+
- **Purpose:** Code linting
- **Rules:**
  - React best practices
  - TypeScript strict mode
  - Import ordering
  - Unused variables detection

### Vite Plugins

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(), // Auto-generate route types
  ],
})
```

### DevTools

- **TanStack Query DevTools** - Debug queries and cache
- **TanStack Router DevTools** - Visualize routes
- **React DevTools** - Component inspection
- **Vite DevTools** - Build analysis

## Package Versions

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@tanstack/react-router": "^1.x.x",
    "@tanstack/react-query": "^5.x.x",
    "zustand": "^4.x.x",
    "axios": "^1.x.x",
    "react-hook-form": "^7.x.x",
    "zod": "^3.x.x",
    "@hookform/resolvers": "^3.x.x",
    "next-themes": "^0.x.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x.x",
    "@tanstack/router-vite-plugin": "^1.x.x",
    "@tanstack/router-devtools": "^1.x.x",
    "@tanstack/react-query-devtools": "^5.x.x",
    "typescript": "^5.x.x",
    "vite": "^5.x.x",
    "tailwindcss": "^3.x.x",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x",
    "eslint": "^8.x.x"
  }
}
```

## Browser Support

### Target Browsers
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- iOS Safari: 14+
- Chrome Android: Last 2 versions

### Polyfills
- Not required (modern browsers only)
- Vite handles ES6+ transpilation

## Node.js Requirements

- **Minimum Version:** Node 18+
- **Recommended:** Node 20 LTS
- **Package Manager:** npm, yarn, or pnpm

## Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** > 90
- **Bundle Size:** < 200KB (gzipped)

## Security

### Dependencies
- Regular security audits with `npm audit`
- Automated updates via Dependabot
- No known vulnerabilities in production

### Best Practices
- HTTPS only
- Content Security Policy headers
- XSS protection (React built-in)
- CSRF tokens for mutations
- Secure authentication flows

## Future Considerations

Technologies that may be added later:
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Storybook** - Component documentation
- **XState** - Complex state machines
- **Socket.io** - Real-time features
- **React Hook Form DevTools** - Form debugging
