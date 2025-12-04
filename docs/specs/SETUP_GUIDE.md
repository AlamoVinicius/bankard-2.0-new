# Setup Guide - Bankard 2.0

## Prerequisites

### Required Software

- **Node.js:** v18.0.0 or higher (v20 LTS recommended)
- **npm:** v9.0.0 or higher (comes with Node.js)
- **Git:** Latest version
- **Code Editor:** VS Code (recommended) or any modern editor

### Optional Tools

- **pnpm** or **yarn** - Alternative package managers
- **nvm** (Node Version Manager) - Manage multiple Node versions
- **React DevTools** - Browser extension for debugging

## Installation Methods

### Option 1: Quick Start (Recommended)

This method uses the TanStack Router CLI for faster setup:

```bash
# Create project using TanStack Router template
npx create-tsrouter-app@latest bankard-2.0

# Navigate to project directory
cd bankard-2.0

# Install shadcn/ui
npx shadcn@latest init

# Follow prompts:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install additional dependencies
npm install @tanstack/react-query zustand axios
npm install react-hook-form zod @hookform/resolvers
npm install next-themes

# Start development server
npm run dev
```

### Option 2: Manual Setup

Complete setup from scratch:

```bash
# 1. Create Vite project with React + TypeScript
npm create vite@latest bankard-2.0 -- --template react-ts
cd bankard-2.0

# 2. Install TanStack Router
npm install @tanstack/react-router
npm install -D @tanstack/router-plugin @tanstack/router-devtools

# 3. Install TanStack Query
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools

# 4. Install state management
npm install zustand

# 5. Install HTTP client
npm install axios

# 6. Install form libraries
npm install react-hook-form zod @hookform/resolvers

# 7. Install and configure shadcn/ui
npx shadcn@latest init

# 8. Install theme support
npm install next-themes

# 9. Start development server
npm run dev
```

## Project Configuration

### 1. Vite Configuration

Create/update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 2. TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. Tailwind Configuration

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 4. Create Directory Structure

```bash
# Create all required directories
mkdir -p src/components/ui
mkdir -p src/components/custom
mkdir -p src/components/layout
mkdir -p src/components/cards
mkdir -p src/components/accounts
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/repositories
mkdir -p src/models
mkdir -p src/stores
mkdir -p src/lib
mkdir -p src/routes/cards
mkdir -p src/routes/accounts
```

### 5. Setup Axios Client

Create `src/lib/api-client.ts`:

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("auth_token");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 6. Setup TanStack Query Provider

Create `src/lib/query-client.ts`:

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});
```

### 7. Setup Root App

Update `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { router } from './routes/__root'
import { queryClient } from './lib/query-client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
```

### 8. Create Environment File

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Bankard 2.0
```

Add to `.gitignore`:

```
.env.local
.env.*.local
```

## Development Commands

### Start Development Server

```bash
npm run dev
```

Access the app at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Run Linter

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Installing shadcn/ui Components

### Add Individual Components

```bash
# Button component
npx shadcn@latest add button

# Card component
npx shadcn@latest add card

# Form components
npx shadcn@latest add form input label

# Dialog
npx shadcn@latest add dialog

# Toast
npx shadcn@latest add toast

# Select
npx shadcn@latest add select

# Multiple at once
npx shadcn@latest add button card form input label dialog toast select
```

## Verify Installation

### Check All Dependencies

```bash
npm list --depth=0
```

Expected packages:

- react, react-dom
- @tanstack/react-router, @tanstack/react-query
- zustand
- axios
- react-hook-form, zod, @hookform/resolvers
- next-themes
- And more...

### Run Development Server

```bash
npm run dev
```

Should start without errors at `http://localhost:5173`

### Check TypeScript Compilation

```bash
npx tsc --noEmit
```

Should complete without errors.

## Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Path Alias Not Working

1. Check `tsconfig.json` has correct `paths` config
2. Check `vite.config.ts` has correct `resolve.alias`
3. Restart TypeScript server in VS Code (Cmd+Shift+P → Reload Window)

### Tailwind Styles Not Applied

1. Verify `tailwind.config.js` content paths include your components
2. Check `src/index.css` imports Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server

## VS Code Setup (Recommended)

### Install Extensions

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**
- **Auto Rename Tag**

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Next Steps

After setup is complete:

1. Review [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure
3. Read [API_PATTERNS.md](./API_PATTERNS.md) for data fetching patterns
4. Study [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md) for design standards
5. Start building features!

## Getting Help

- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **TanStack Router:** https://tanstack.com/router
- **TanStack Query:** https://tanstack.com/query
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
