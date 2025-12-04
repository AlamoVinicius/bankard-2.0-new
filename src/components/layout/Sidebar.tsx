import { Link, useNavigate } from '@tanstack/react-router'
import { Home, CreditCard, Wallet, Settings, LogOut, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()

  const menuItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/cards', icon: CreditCard, label: 'Cartões' },
    { to: '/accounts', icon: Wallet, label: 'Contas' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ]

  const handleLogout = () => {
    // Clear auth state (removes token from localStorage)
    clearAuth()
    // Close sidebar if on mobile
    onClose()
    // Redirect to login page
    navigate({ to: '/login' })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 sm:w-80
          bg-gradient-to-b from-gray-900 to-gray-800
          text-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">B</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Bankard 2.0</h2>
              <p className="text-xs text-gray-400">Sua conta digital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-gray-800/50 transition-all group"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 transition-all group',
                }}
              >
                <item.icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 sm:p-4 rounded-xl hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all group"
          >
            <LogOut
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-medium text-sm sm:text-base">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
