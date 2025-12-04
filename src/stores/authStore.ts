import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  clearAuth: () => void
}

/**
 * Auth Store
 * Manages authentication state with Zustand
 * Token is stored only in memory (not persisted)
 */
export const useAuthStore = create<AuthState>((set) => ({
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
}))
