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

    // Return hardcoded valid token for development
    return {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOiJBQ0ciLCJjbGllbnRLZXkiOiJjNThlMmEyZi0yN2YyLTQ5NzEtOTU1OS02YWIyZTEyMWVmNzAiLCJpbnRlcm5hbCI6ImZhbHNlIiwidHlwZSI6IkFwcFRva2VuIiwiaXYiOiJtVGY2ejdtUCt2bklZUXRxIiwieC1jb3JyZWxhdGlvbi1pZCI6IjIyZDAzMzcwMmNjNDQzZjRiZGY2ZDY3NzcwNTYxYTUwLTIwMjUxMjA0MTYyODUxNzE3IiwiYWNjb3VudHMiOiIxMjYxOTc0NzQ7MTI2MTk3NTA4OzEyNjE5NzY1NiIsInByb2dyYW1zIjoiMTM5ODE7MTM5ODI7MTM5Nzk7Njg3IiwiZG9jdW1lbnQiOiIxMjk1MTkwNDYwNiIsIm5iZiI6MTc2NDg2Njk2MCwiZXhwIjoxNzY0ODcwNTYwLCJpYXQiOjE3NjQ4NjY5NjAsImlzcyI6IkFDRy5EZWZpYW50LkhtbCIsImF1ZCI6IkFDRy5EZWZpYW50LkhtbCJ9._drJ35ANbRYb1zIWVX9FHizLo_xLvtqCGT8CFHvzdRM',
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
