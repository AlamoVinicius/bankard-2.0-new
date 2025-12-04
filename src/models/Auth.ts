/**
 * Auth Models
 * Types and interfaces for authentication
 */

/**
 * Login request - based on API endpoint
 * POST /v1/Auth/Login
 */
export interface LoginRequest {
  login: string // CPF do usuário
  password: string
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  token: string
  expiresAt?: string // Optional expiration date
}

/**
 * Authenticated user data
 */
export interface AuthUser {
  login: string // CPF
  token: string
}

/**
 * Auth state
 */
export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: AuthUser | null
}
