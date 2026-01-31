"use client";

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

/**
 * AuthProvider Component
 *
 * Wraps the application with NextAuth SessionProvider.
 * Use this in your root layout to enable authentication.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;
