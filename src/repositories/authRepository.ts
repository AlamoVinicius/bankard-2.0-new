import type { LoginCredentials, AuthResponse } from '@/models/Auth'

/**
 * AuthRepository
 * Handles authentication API calls
 *
 * TODO: Replace simulated login with real API endpoint when available
 */
class AuthRepository {
  /**
   * Simulated login with 2 second delay
   * Returns hardcoded valid token for development
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate validation (you can add your own logic here)
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required')
    }

    // TODO: Replace with real API call
    // const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    // return response.data

    // Return token from environment variable for development
    return {
      token: import.meta.env.VITE_API_TOKEN || '',
    }
  }

  /**
   * Logout (clear session)
   * TODO: Implement real logout API call if needed
   */
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // TODO: Call API to invalidate token if needed
    // await apiClient.post('/auth/logout')
  }
}

export const authRepository = new AuthRepository()
