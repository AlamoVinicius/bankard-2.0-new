import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMockStore } from '@/stores/mockStore'
import { useAuthStore } from '@/stores/authStore'

/**
 * MockConfigModal
 *
 * Modal exibido no início do ciclo de vida da aplicação
 * perguntando ao usuário se deseja usar dados mockados
 * e qual a URL da API backend.
 *
 * Aparece apenas uma vez por sessão, ou pode ser resetado
 * através da store (para testes).
 *
 * IMPORTANTE: Limpa a autenticação ao abrir para sempre
 * começar na tela de login.
 */
export function MockConfigModal() {
  const navigate = useNavigate()
  const { apiUrl, enableMock, disableMock, setApiUrl } = useMockStore()
  const { clearAuth } = useAuthStore()
  const [isOpen, setIsOpen] = useState(true) // Always show on mount
  const [inputApiUrl, setInputApiUrl] = useState(apiUrl)

  useEffect(() => {
    // Sempre limpar autenticação ao montar o componente
    clearAuth()
  }, []) // Executar apenas uma vez ao montar

  /**
   * Normaliza a URL para garantir que tem protocolo
   */
  const normalizeUrl = (url: string): string => {
    const trimmedUrl = url.trim()

    // Se já tem protocolo, retorna como está
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl
    }

    // Se não tem protocolo, adiciona https://
    return `https://${trimmedUrl}`
  }

  const handleEnableMock = () => {
    enableMock()
    const normalizedUrl = normalizeUrl(inputApiUrl)
    setApiUrl(normalizedUrl)
    setInputApiUrl(normalizedUrl) // Atualizar o input também
    setIsOpen(false)

    // Redirecionar para login após configurar
    navigate({ to: '/login' })
  }

  const handleDisableMock = () => {
    disableMock()
    const normalizedUrl = normalizeUrl(inputApiUrl)
    setApiUrl(normalizedUrl)
    setInputApiUrl(normalizedUrl) // Atualizar o input também
    setIsOpen(false)

    // Redirecionar para login após configurar
    navigate({ to: '/login' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Configuração Inicial</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Configure a URL da API e escolha o modo de desenvolvimento
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Campo de URL da API */}
          <div className="space-y-2">
            <Label htmlFor="api-url" className="text-sm font-semibold">
              URL da API Backend
            </Label>
            <Input
              id="api-url"
              type="text"
              placeholder="https://localhost:7162"
              value={inputApiUrl}
              onChange={(e) => setInputApiUrl(e.target.value)}
              className="w-full"
            />
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">
                Informe a URL base da API (ex: https://api.exemplo.com)
              </p>
              {inputApiUrl && !inputApiUrl.startsWith('http://') && !inputApiUrl.startsWith('https://') && (
                <p className="text-amber-600 dark:text-amber-400">
                  ℹ️ Será adicionado automaticamente: <code className="bg-muted px-1 py-0.5 rounded">https://{inputApiUrl.trim()}</code>
                </p>
              )}
            </div>
          </div>

          {/* Opções de modo */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Modo de Operação</h4>

            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="font-semibold text-sm mb-1">Dados Mockados</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Simula respostas da API com dados de exemplo</li>
                <li>• Não requer conexão com servidor</li>
                <li>• Útil para desenvolvimento e testes</li>
              </ul>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="font-semibold text-sm mb-1">API Real</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Conecta com servidor real na URL informada</li>
                <li>• Dados reais do backend</li>
                <li>• Requer autenticação válida</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleDisableMock}
            className="flex-1 sm:flex-none"
          >
            Usar API Real
          </Button>
          <Button
            onClick={handleEnableMock}
            className="flex-1 sm:flex-none"
          >
            Usar Dados Mockados
          </Button>
        </DialogFooter>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Você pode alterar essas configurações depois através do localStorage
        </p>
      </DialogContent>
    </Dialog>
  )
}
