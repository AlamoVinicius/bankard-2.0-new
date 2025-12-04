import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '@/components/custom/SignupPage'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})
