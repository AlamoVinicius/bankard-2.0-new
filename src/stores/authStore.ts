import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  clearAuth: () => void
}

/**
 * Auth Store
 * Manages authentication state with Zustand
 * Persists token to localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      /**
       * Set authentication token
       */
      setToken: (token: string) => {
        set({ token, isAuthenticated: true })
      },

      /**
       * Clear authentication (logout)
       */
      clearAuth: () => {
        set({ token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'bankard-auth', // localStorage key
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
)
