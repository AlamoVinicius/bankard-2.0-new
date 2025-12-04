import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authRepository } from '@/repositories/authRepository'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest } from '@/models/Auth'

/**
 * Custom hook for authentication
 * Handles login, logout, and auth state
 */
export function useAuth() {
  const navigate = useNavigate()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<Error | null>(null)

  // Zustand store
  const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthStore()

  /**
   * Login user
   * Uses local fixed token instead of API call
   */
  const login = async (credentials: LoginRequest) => {
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Fixed token for local development
      const fixedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOiJBQ0ciLCJjbGllbnRLZXkiOiJjNThlMmEyZi0yN2YyLTQ5NzEtOTU1OS02YWIyZTEyMWVmNzAiLCJpbnRlcm5hbCI6ImZhbHNlIiwidHlwZSI6IkFwcFRva2VuIiwiaXYiOiJtcEwxb3V6UVhxOElZYWNWIiwieC1jb3JyZWxhdGlvbi1pZCI6IjMyZGRkNWJhZDA5MzRmNWE5YTYxMTg1OTI3ZGMwZTcxLTIwMjUxMjA0MTk1ODE2MDY2IiwiYWNjb3VudHMiOiIxMjYxOTg5Mjg7MTI2MTk3NDc0OzEyNjE5NzUwODsxMjYxOTc2NTYiLCJwcm9ncmFtcyI6IjEzOTgxOzEzOTgyOzEzOTc5OzY4NzsxNTQyIiwiZG9jdW1lbnQiOiIxMjk1MTkwNDYwNiIsIm5iZiI6MTc2NDg3ODU4MiwiZXhwIjoxNzY0ODgyMTgyLCJpYXQiOjE3NjQ4Nzg1ODIsImlzcyI6IkFDRy5EZWZpYW50LkhtbCIsImF1ZCI6IkFDRy5EZWZpYW50LkhtbCJ9.trb6BGJWf_FC84G3OiYd70tDJLpiIALmafJ6EHAew0k'

      // Save token and user to store (which persists to localStorage)
      setAuth(fixedToken, credentials.login)

      // Navigate to home page after successful login
      navigate({ to: '/' })

      return { token: fixedToken }
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
