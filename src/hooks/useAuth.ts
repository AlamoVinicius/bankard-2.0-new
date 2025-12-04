import { useNavigate } from '@tanstack/react-router'
import { useAuthService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/models/Auth'

/**
 * Custom hook for authentication
 * Combines service layer (TanStack Query) with state management (Zustand)
 * Handles login, logout, and auth state
 */
export function useAuth() {
  const navigate = useNavigate()
  const { login: loginMutation, logout: logoutMutation, isLoggingIn, isLoggingOut, loginError } = useAuthService()

  // Zustand store
  const { token, isAuthenticated, setToken, clearAuth } = useAuthStore()

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginMutation(credentials)

      // Save token to store (which persists to localStorage)
      setToken(response.token)

      // Navigate to home page after successful login
      navigate({ to: '/' })

      return response
    } catch (error) {
      // Error is already handled by TanStack Query
      throw error
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await logoutMutation()

      // Clear auth state
      clearAuth()

      // Navigate to login page
      navigate({ to: '/login' })
    } catch (error) {
      // Even if API call fails, clear local state
      clearAuth()
      navigate({ to: '/login' })
    }
  }

  return {
    // State
    token,
    isAuthenticated,

    // Actions
    login,
    logout,

    // Loading states
    isLoggingIn,
    isLoggingOut,

    // Errors
    loginError,
  }
}
