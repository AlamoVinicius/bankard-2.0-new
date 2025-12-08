import axios from 'axios'
import type { LoginRequest, AuthResponse } from '@/models/Auth'
import { mockAuthResponse, simulateDelay } from '@/lib/mockData'
import { getApiBaseUrl } from '@/lib/api-client'

/**
 * AuthRepository
 * Handles authentication API calls
 *
 * Supports mock mode for development
 * Uses dynamic API URL from configuration
 */
class AuthRepository {
  /**
   * Get base URL dynamically from configuration
   */
  private getBaseUrl(): string {
    return getApiBaseUrl()
  }

  /**
   * Login user with CPF/email and password
   * POST /v1/auth/login
   *
   * @param credentials - Login credentials (login and password)
   * @param useMock - If true, returns mock data instead of calling API
   */
  async login(credentials: LoginRequest, useMock: boolean = false): Promise<AuthResponse> {
    // Mock mode
    if (useMock) {
      await simulateDelay(1000)
      return mockAuthResponse
    }

    // Real API call
    try {
      const response = await axios.post<AuthResponse>(
        `${this.getBaseUrl()}/v1/auth/login`,
        credentials,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data

        // Handle specific error codes from API
        if (errorData?.errorCode) {
          switch (errorData.errorCode) {
            case 40001:
              throw new Error('Usuário não encontrado')
            case 40002:
              throw new Error('CPF inválido')
            case 40003:
              throw new Error('Usuário inativo')
            case 40004:
              throw new Error('Usuário bloqueado por excesso de tentativas')
            case 40005:
              throw new Error('Email não confirmado')
            case 40006:
              throw new Error('Cliente não associado ao usuário')
            default:
              throw new Error(errorData.error || 'Erro ao fazer login')
          }
        }

        throw new Error(
          errorData?.error ||
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
