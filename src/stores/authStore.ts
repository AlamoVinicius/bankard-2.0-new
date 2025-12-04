import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/models/Auth'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, login: string) => void
  clearAuth: () => void
}

/**
 * Auth Store
 * Manages authentication state with Zustand
 * Token and user are persisted in localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      /**
       * Set authentication token and user data
       */
      setAuth: (token: string, login: string) => {
        set({
          token,
          user: { login, token },
          isAuthenticated: true,
        })
      },

      /**
       * Clear authentication (logout)
       */
      clearAuth: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage', // Key in localStorage
    }
  )
)
