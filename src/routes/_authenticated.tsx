import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  // TODO: Add authentication check here
  // const { isAuthenticated } = useAuthStore()
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />
  // }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
