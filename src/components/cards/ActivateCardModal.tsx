import { useState } from 'react'
import { Loader2, CreditCard, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cardRepository } from '@/repositories/cardRepository'
import { useToast } from '@/hooks/use-toast'
import type { Card } from '@/models/Card'
import { formatCardNumber } from '@/models/Card'

// Form validation schema
const activateCardSchema = z.object({
  cardId: z.number().min(1, 'Selecione um cartão'),
  alias: z
    .string()
    .min(3, 'O apelido deve ter no mínimo 3 caracteres')
    .max(20, 'O apelido deve ter no máximo 20 caracteres'),
  password: z
    .string()
    .min(4, 'A senha deve ter no mínimo 4 dígitos')
    .max(6, 'A senha deve ter no máximo 6 dígitos')
    .regex(/^\d+$/, 'A senha deve conter apenas números'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type ActivateCardFormData = z.infer<typeof activateCardSchema>

interface ActivateCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inactiveCards: Card[]
  document?: string
  onSuccess?: () => void
}

export function ActivateCardModal({
  open,
  onOpenChange,
  inactiveCards,
  onSuccess,
}: ActivateCardModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ActivateCardFormData>({
    resolver: zodResolver(activateCardSchema),
    defaultValues: {
      cardId: 0,
      alias: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleCardSelect = (cardId: number) => {
    setSelectedCardId(cardId)
    setValue('cardId', cardId)
  }

  const onSubmit = async (data: ActivateCardFormData) => {
    setIsLoading(true)
    try {
      await cardRepository.activateCard({
        cardId: data.cardId,
        alias: data.alias,
        password: data.password,
      })

      toast({
        title: 'Cartão ativado com sucesso!',
        description: `O cartão "${data.alias}" foi ativado e está pronto para uso.`,
      })

      reset()
      setSelectedCardId(null)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Erro ao ativar cartão',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível ativar o cartão. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset()
      setSelectedCardId(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Ativar Novo Cartão
          </DialogTitle>
          <DialogDescription>
            Selecione um cartão inativo e configure suas informações para
            ativá-lo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Card Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Selecione um cartão inativo
            </Label>
            {inactiveCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum cartão inativo disponível para ativação.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto">
                {inactiveCards.map((card) => (
                  <button
                    key={card.cardId}
                    type="button"
                    onClick={() => handleCardSelect(card.cardId)}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all
                      ${
                        selectedCardId === card.cardId
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          p-2 rounded-lg
                          ${
                            selectedCardId === card.cardId
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }
                        `}
                        >
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">
                            {formatCardNumber(card.last4Digits)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {card.type === 'PLASTIC' ? 'Físico' : 'Virtual'} •{' '}
                            {card.printedName}
                          </p>
                        </div>
                      </div>
                      {selectedCardId === card.cardId && (
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {errors.cardId && (
              <p className="text-sm text-destructive">{errors.cardId.message}</p>
            )}
          </div>

          {/* Alias Input */}
          <div className="space-y-2">
            <Label htmlFor="alias" className="text-base font-semibold">
              Apelido do Cartão
            </Label>
            <Input
              id="alias"
              placeholder="Ex: Cartão Principal, Viagens, etc."
              disabled={isLoading || !selectedCardId}
              {...register('alias')}
              className={errors.alias ? 'border-destructive' : ''}
            />
            {errors.alias && (
              <p className="text-sm text-destructive">{errors.alias.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-semibold">
              Senha do Cartão
            </Label>
            <Input
              id="password"
              type="password"
              inputMode="numeric"
              placeholder="Digite 4-6 dígitos"
              maxLength={6}
              disabled={isLoading || !selectedCardId}
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              A senha deve ter entre 4 e 6 dígitos numéricos
            </p>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold">
              Confirme a Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              inputMode="numeric"
              placeholder="Digite a senha novamente"
              maxLength={6}
              disabled={isLoading || !selectedCardId}
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedCardId || inactiveCards.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ativando...
                </>
              ) : (
                'Confirmar Ativação'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
