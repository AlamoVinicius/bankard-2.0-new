import { useState } from 'react'
import { AlertCircle, ChevronDown, ChevronUp, Copy, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getErrorMessage, isApiError, ApiError } from '@/lib/errors'

interface ErrorAlertProps {
  error: unknown
  title?: string
  onRetry?: () => void
  className?: string
  showDetails?: boolean
}

/**
 * ErrorAlert Component
 * Displays user-friendly error messages with expandable technical details
 *
 * Features:
 * - User-friendly message display
 * - Expandable section with original error details
 * - Copy error details to clipboard
 * - Optional retry button
 * - Mobile-first responsive design
 */
export function ErrorAlert({
  error,
  title = 'Erro',
  onRetry,
  className,
  showDetails = true,
}: ErrorAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  // Extract user-friendly message
  const userMessage = getErrorMessage(error)

  // Extract technical details
  const getTechnicalDetails = () => {
    if (isApiError(error)) {
      return {
        message: userMessage,
        statusCode: error.statusCode,
        originalError: error.originalError,
        stack: error.stack,
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        name: error.name,
        stack: error.stack,
      }
    }

    return {
      message: String(error),
      type: typeof error,
    }
  }

  const technicalDetails = getTechnicalDetails()

  // Copy error details to clipboard
  const handleCopyError = async () => {
    try {
      const errorText = JSON.stringify(technicalDetails, null, 2)
      await navigator.clipboard.writeText(errorText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-destructive/50 bg-destructive/10',
        className
      )}
    >
      {/* Main Error Message */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-sm font-semibold text-destructive mb-1">
              {title}
            </h3>

            {/* User Message */}
            <p className="text-sm text-destructive/90 mb-3">
              {userMessage}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-md',
                    'text-xs font-medium',
                    'bg-destructive/20 text-destructive',
                    'hover:bg-destructive/30 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1'
                  )}
                >
                  <RefreshCw className="h-3 w-3" />
                  Tentar novamente
                </button>
              )}

              {showDetails && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-md',
                    'text-xs font-medium',
                    'text-destructive/80 hover:text-destructive',
                    'hover:bg-destructive/10 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1'
                  )}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Ocultar detalhes
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Ver detalhes técnicos
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Technical Details */}
      {showDetails && isExpanded && (
        <div className="border-t border-destructive/30">
          <div className="p-4 space-y-3">
            {/* Details Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-destructive/80">
                Detalhes Técnicos
              </h4>
              <button
                onClick={handleCopyError}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded',
                  'text-xs font-medium',
                  'text-destructive/70 hover:text-destructive',
                  'hover:bg-destructive/10 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-1'
                )}
              >
                <Copy className="h-3 w-3" />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            {/* Error Details Card */}
            <div
              className={cn(
                'rounded-md bg-destructive/5 border border-destructive/20 p-3',
                'overflow-x-auto'
              )}
            >
              <pre className="text-xs font-mono text-destructive/80 whitespace-pre-wrap break-all">
                {JSON.stringify(technicalDetails, null, 2)}
              </pre>
            </div>

            {/* Additional Info for ApiError */}
            {isApiError(error) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-destructive/70">Status Code:</span>
                  <span className="font-mono font-medium text-destructive">
                    {error.statusCode}
                  </span>
                </div>
                {error.originalError && (
                  <div className="text-xs text-destructive/70">
                    <span className="font-medium">Original Error:</span>
                    <div className="mt-1 p-2 rounded bg-destructive/5 border border-destructive/20">
                      <pre className="font-mono text-[10px] whitespace-pre-wrap break-all">
                        {JSON.stringify(error.originalError, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Help Text */}
            <p className="text-[10px] text-destructive/60 leading-relaxed">
              =¡ Estes detalhes técnicos podem ser úteis para debugging. Copie e
              compartilhe com o suporte se necessário.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Compact Error Alert (for inline errors)
 */
export function ErrorAlertCompact({
  error,
  onRetry,
  className,
}: {
  error: unknown
  onRetry?: () => void
  className?: string
}) {
  const userMessage = getErrorMessage(error)

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        'border border-destructive/50 bg-destructive/10',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
      <p className="text-sm text-destructive flex-1">{userMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'p-1.5 rounded hover:bg-destructive/20 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-destructive'
          )}
        >
          <RefreshCw className="h-4 w-4 text-destructive" />
        </button>
      )}
    </div>
  )
}
