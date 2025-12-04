import { useState } from 'react'
import { Menu, Bell, User } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between p-4 lg:px-8">
            {/* Left side - Menu button (mobile only) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>

            {/* Center - Page title (optional, can be updated per page) */}
            <div className="flex-1 lg:flex-none lg:ml-0 ml-4">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <button
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-700 dark:text-gray-200" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Profile */}
              <button
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Profile"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Usuário
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
