/**
 * Custom error class for API/Repository errors
 * Provides user-friendly messages and original error details
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly userMessage: string
  public readonly originalError: unknown

  constructor(
    userMessage: string,
    statusCode: number = 500,
    originalError?: unknown
  ) {
    super(userMessage)
    this.name = 'ApiError'
    this.userMessage = userMessage
    this.statusCode = statusCode
    this.originalError = originalError

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  /**
   * Get a JSON representation of the error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      userMessage: this.userMessage,
      statusCode: this.statusCode,
      stack: this.stack,
    }
  }
}

/**
 * Error factory for common HTTP errors
 */
export const ApiErrors = {
  notFound: (resource: string) =>
    new ApiError(
      `${resource} não encontrado(a). Verifique os dados e tente novamente.`,
      404
    ),

  unauthorized: () =>
    new ApiError(
      'Sessão expirada. Por favor, faça login novamente.',
      401
    ),

  forbidden: () =>
    new ApiError(
      'Você não tem permissão para realizar esta ação.',
      403
    ),

  badRequest: (message?: string) =>
    new ApiError(
      message || 'Requisição inválida. Verifique os dados enviados.',
      400
    ),

  serverError: () =>
    new ApiError(
      'Erro no servidor. Tente novamente mais tarde.',
      500
    ),

  networkError: () =>
    new ApiError(
      'Erro de conexão. Verifique sua internet e tente novamente.',
      0
    ),

  timeout: () =>
    new ApiError(
      'A requisição demorou muito para responder. Tente novamente.',
      408
    ),
}

/**
 * Helper to extract user-friendly message from error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.userMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro inesperado. Tente novamente.'
}

/**
 * Helper to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
