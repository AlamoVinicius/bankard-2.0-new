import axios, { AxiosError } from 'axios'
import { ApiError, ApiErrors } from './errors'
import { useAuthStore } from '@/stores/authStore'

/**
 * Axios instance configured for the Bankard API
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api-bifrost-hml.acgsa.com.br',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor - Add auth token from Zustand store
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(ApiErrors.timeout())
      }
      return Promise.reject(ApiErrors.networkError())
    }

    // HTTP error responses
    const status = error.response.status

    switch (status) {
      case 400:
        return Promise.reject(
          new ApiError(
            'Dados inv�lidos. Verifique as informa��es e tente novamente.',
            400,
            error
          )
        )

      case 401:
        // Clear token from store and redirect to login
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(ApiErrors.unauthorized())

      case 403:
        return Promise.reject(ApiErrors.forbidden())

      case 404:
        return Promise.reject(
          new ApiError(
            'Recurso n�o encontrado. Verifique os dados e tente novamente.',
            404,
            error
          )
        )

      case 422:
        return Promise.reject(
          new ApiError(
            'Dados inv�lidos. Verifique as informa��es fornecidas.',
            422,
            error
          )
        )

      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject(ApiErrors.serverError())

      default:
        return Promise.reject(
          new ApiError(
            'Ocorreu um erro inesperado. Tente novamente.',
            status,
            error
          )
        )
    }
  }
)
