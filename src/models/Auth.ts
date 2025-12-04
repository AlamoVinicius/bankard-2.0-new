/**
 * Auth Models
 * Types and interfaces for authentication
 */

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  token: string
}

/**
 * Auth state
 */
export interface AuthState {
  isAuthenticated: boolean
  token: string | null
}
