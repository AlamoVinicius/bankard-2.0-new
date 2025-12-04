import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/components/custom/LoginPage'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
