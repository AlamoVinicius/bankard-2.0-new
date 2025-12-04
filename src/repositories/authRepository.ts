import axios from 'axios'
import type { LoginRequest, AuthResponse } from '@/models/Auth'

/**
 * AuthRepository
 * Handles authentication API calls
 *
 * Login endpoint uses localhost, other endpoints use the base URL from env
 */
class AuthRepository {
  private readonly loginBaseUrl = 'https://localhost:7162'

  /**
   * Login user with CPF and password
   * POST /v1/Auth/Login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.loginBaseUrl}/v1/Auth/Login`,
        credentials,
        {
          headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
          'Erro ao fazer login. Verifique suas credenciais.'
        )
      }
      throw new Error('Erro ao fazer login.')
    }
  }

  /**
   * Logout (clear session)
   * Currently only clears local state
   */
  async logout(): Promise<void> {
    // Just clear local state for now
    // If API has logout endpoint, implement here
    return Promise.resolve()
  }
}

export const authRepository = new AuthRepository()
