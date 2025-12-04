import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Card } from '@/models/Card'
import { Loader2, Scan, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Form validation schema using Zod
 * Only for form validation (not API response)
 */
const billPaymentFormSchema = z.object({
  barcode: z
    .string()
    .min(47, 'C�digo de barras deve ter no m�nimo 47 d�gitos')
    .max(48, 'C�digo de barras deve ter no m�ximo 48 d�gitos')
    .regex(/^[0-9]+$/, 'C�digo de barras deve conter apenas n�meros'),
})

type BillPaymentFormData = z.infer<typeof billPaymentFormSchema>

interface BillPaymentFormProps {
  selectedCard: Card
  onSuccess?: () => void
}

/**
 * Bill Payment Form Component
 * Form for consulting bill barcode (UI only for now)
 */
export function BillPaymentForm({ selectedCard, onSuccess }: BillPaymentFormProps) {
  const [isConsulting, setIsConsulting] = useState(false)
  const [consultError, setConsultError] = useState<string | null>(null)

  const form = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentFormSchema),
    defaultValues: {
      barcode: '',
    },
  })

  /**
   * Handle form submission
   * TODO: Implement actual bill consultation API call
   */
  const onSubmit = async (data: BillPaymentFormData) => {
    try {
      setIsConsulting(true)
      setConsultError(null)

      // TODO: Call bill consultation API endpoint
      // const billDetails = await billRepository.consultBarcode(data.barcode, selectedCard.account)

      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Consulting barcode:', data.barcode)
      console.log('Using card:', selectedCard.cardId)
      console.log('Account:', selectedCard.account)

      // Success - move to next step
      onSuccess?.()
    } catch (error) {
      setConsultError(
        'N�o foi poss�vel consultar o boleto. Verifique o c�digo e tente novamente.'
      )
    } finally {
      setIsConsulting(false)
    }
  }

  /**
   * Format barcode input (add spaces every 5 digits for readability)
   */
  const formatBarcode = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')
    return onlyNumbers.replace(/(\d{5})(?=\d)/g, '$1 ')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Barcode Input */}
      <div className="space-y-2">
        <label
          htmlFor="barcode"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          C�digo de Barras
        </label>

        <div className="relative">
          <input
            id="barcode"
            type="text"
            placeholder="00000000000000000000000000000000000000000000000"
            className={cn(
              'flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'font-mono tracking-wide',
              'pr-12',
              form.formState.errors.barcode && 'border-destructive focus-visible:ring-destructive'
            )}
            {...form.register('barcode')}
            onChange={(e) => {
              const formatted = formatBarcode(e.target.value)
              form.setValue('barcode', e.target.value.replace(/\D/g, ''))
              e.target.value = formatted
            }}
            disabled={isConsulting}
            maxLength={58} // 48 digits + 10 spaces
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Escanear c�digo de barras"
              disabled={isConsulting}
            >
              <Scan className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {form.formState.errors.barcode && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {form.formState.errors.barcode.message}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Digite os 47 ou 48 d�gitos do c�digo de barras do boleto
        </p>
      </div>

      {/* Consultation Error */}
      {consultError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{consultError}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => form.reset()}
          disabled={isConsulting}
          className={cn(
            'flex-1 sm:flex-initial px-6 py-3 rounded-lg',
            'border border-border bg-background',
            'text-sm font-medium',
            'hover:bg-accent transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Limpar
        </button>

        <button
          type="submit"
          disabled={isConsulting || !form.formState.isValid}
          className={cn(
            'flex-1 px-6 py-3 rounded-lg',
            'bg-primary text-primary-foreground',
            'text-sm font-semibold',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
          )}
        >
          {isConsulting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Consultando...
            </>
          ) : (
            'Consultar Boleto'
          )}
        </button>
      </div>

      {/* Info */}
      <div className="rounded-lg bg-muted/50 p-4">
        <div className="flex gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Dica:</span> Voc� pode
              encontrar o c�digo de barras na parte inferior do boleto.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Certifique-se de que todos os d�gitos est�o corretos</li>
              <li>O c�digo deve ter 47 ou 48 d�gitos num�ricos</li>
              <li>N�o inclua espa�os ou caracteres especiais</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-4">
          <p className="text-xs font-mono text-blue-900 dark:text-blue-100">
            <strong>Card ID:</strong> {selectedCard.cardId}
            <br />
            <strong>Account:</strong> {selectedCard.account}
            <br />
            <strong>Card Holder:</strong> {selectedCard.printedName}
          </p>
        </div>
      )}
    </form>
  )
}
