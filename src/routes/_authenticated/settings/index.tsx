import { createFileRoute } from '@tanstack/react-router'
import {
  User,
  Lock,
  Bell,
  Moon,
  Globe,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Database,
  Smartphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/authStore'
import { useMockStore } from '@/stores/mockStore'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user } = useAuthStore()
  const { isMockEnabled, apiUrl } = useMockStore()

  // Settings sections
  const settingsSections = [
    {
      title: 'Conta',
      items: [
        {
          icon: User,
          label: 'Perfil',
          description: 'Gerencie suas informações pessoais',
          action: 'navigate',
          badge: null,
        },
        {
          icon: CreditCard,
          label: 'Dados bancários',
          description: 'Contas e cartões vinculados',
          action: 'navigate',
          badge: null,
        },
      ],
    },
    {
      title: 'Segurança',
      items: [
        {
          icon: Lock,
          label: 'Senha',
          description: 'Alterar senha de acesso',
          action: 'navigate',
          badge: null,
        },
        {
          icon: Shield,
          label: 'Autenticação em duas etapas',
          description: 'Adicione uma camada extra de segurança',
          action: 'toggle',
          badge: null,
          enabled: false,
        },
        {
          icon: Smartphone,
          label: 'Dispositivos conectados',
          description: 'Gerencie os dispositivos autorizados',
          action: 'navigate',
          badge: '2 dispositivos',
        },
      ],
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: Bell,
          label: 'Notificações',
          description: 'Configure alertas e avisos',
          action: 'navigate',
          badge: null,
        },
        {
          icon: Moon,
          label: 'Tema escuro',
          description: 'Alternar entre modo claro e escuro',
          action: 'toggle',
          badge: null,
          enabled: true,
        },
        {
          icon: Globe,
          label: 'Idioma',
          description: 'Português (Brasil)',
          action: 'navigate',
          badge: null,
        },
      ],
    },
    {
      title: 'Desenvolvimento',
      items: [
        {
          icon: Database,
          label: 'Modo de API',
          description: isMockEnabled ? 'Dados Mockados' : 'API Real',
          action: 'info',
          badge: isMockEnabled ? 'Mock' : 'Real',
          badgeColor: isMockEnabled ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500',
        },
        {
          icon: Globe,
          label: 'URL da API',
          description: apiUrl,
          action: 'info',
          badge: null,
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          icon: HelpCircle,
          label: 'Central de ajuda',
          description: 'Perguntas frequentes e tutoriais',
          action: 'navigate',
          badge: null,
        },
        {
          icon: Shield,
          label: 'Termos e privacidade',
          description: 'Políticas e termos de uso',
          action: 'navigate',
          badge: null,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {user?.login || 'Usuário'}
              </h2>
              <p className="text-sm opacity-90">Conta Premium</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {section.title}
              </h3>
              <div className="bg-card rounded-xl border shadow-sm divide-y">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 sm:p-5 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.label}</p>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.badgeColor || 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>

                      {/* Action */}
                      {item.action === 'toggle' && (
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={() => {
                            // TODO: Implement toggle logic
                            console.log('Toggle:', item.label)
                          }}
                        />
                      )}
                      {item.action === 'navigate' && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-destructive uppercase tracking-wide">
            Zona de perigo
          </h3>
          <div className="bg-card rounded-xl border border-destructive/20 shadow-sm p-4 sm:p-5">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-destructive">Excluir conta</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                </p>
              </div>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => {
                  // TODO: Implement account deletion
                  console.log('Delete account')
                }}
              >
                Excluir minha conta
              </Button>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
          <p>AnyPay v2.0.0</p>
          <p className="mt-1">
            Modo: {isMockEnabled ? 'Desenvolvimento (Mock)' : 'Produção'}
          </p>
        </div>
      </div>
    </div>
  )
}
