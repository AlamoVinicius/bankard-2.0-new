import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authRepository } from '@/repositories/authRepository'
import { useAuthStore } from '@/stores/authStore'
import { useMockStore } from '@/stores/mockStore'
import type { LoginRequest } from '@/models/Auth'

/**
 * Custom hook for authentication
 * Handles login, logout, and auth state
 * Supports mock mode for development
 */
export function useAuth() {
  const navigate = useNavigate()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<Error | null>(null)

  // Zustand stores
  const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const { isMockEnabled } = useMockStore()

  /**
   * Login user
   * Uses mock data or real API based on mock mode
   */
  const login = async (credentials: LoginRequest) => {
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      // Call repository with mock mode flag
      const response = await authRepository.login(credentials, isMockEnabled)

      // Save token and user to store (which persists to localStorage)
      setAuth(response.token, credentials.login)

      // Navigate to home page after successful login
      navigate({ to: '/' })

      return response
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erro ao fazer login')
      setLoginError(err)
      throw err
    } finally {
      setIsLoggingIn(false)
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authRepository.logout()

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
    user,
    isAuthenticated,

    // Actions
    login,
    logout,

    // Loading states
    isLoggingIn,

    // Errors
    loginError,
  }
}
