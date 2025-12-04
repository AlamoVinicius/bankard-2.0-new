import { useMutation } from "@tanstack/react-query";
import { authRepository } from "@/repositories/authRepository";
import type { LoginCredentials } from "@/models/Auth";

/**
 * Auth Service
 * TanStack Query wrappers for authentication operations
 */
export function useAuthService() {
  /**
   * Mutation: Login
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authRepository.login(credentials),
  });

  /**
   * Mutation: Logout
   */
  const logoutMutation = useMutation({
    mutationFn: () => authRepository.logout(),
  });

  return {
    // Login
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Logout
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
