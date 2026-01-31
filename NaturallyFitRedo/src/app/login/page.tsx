// ============================================
// LOGIN PAGE
// ============================================

import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { LoginForm } from "@/components/auth";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Sign In | Naturally Fit",
  description: "Sign in to your Naturally Fit account to access your orders, wishlist, and exclusive deals.",
};

// ============================================
// PAGE COMPONENT
// ============================================

export default function LoginPage() {
  return (
    <main className="py-12 lg:py-16 min-h-[calc(100vh-200px)]">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-h1 uppercase mb-2">
              Sign In
            </h1>
            <p className="text-body text-gray-medium">
              Welcome back! Sign in to access your account.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white p-6 sm:p-8 border border-gray-border">
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-light" />}>
              <LoginForm />
            </Suspense>
          </div>

          {/* Wholesale CTA */}
          <div className="mt-8 p-6 bg-gray-light text-center">
            <h2 className="font-heading font-bold text-h4 uppercase mb-2">
              Are You a Business?
            </h2>
            <p className="text-small text-gray-medium mb-4">
              Apply for a wholesale account to access exclusive pricing and bulk discounts.
            </p>
            <Link
              href="/wholesale"
              className="inline-flex items-center justify-center px-6 py-3 font-heading font-bold uppercase tracking-button text-small border-2 border-black text-black hover:bg-black hover:text-white transition-all"
            >
              Apply for Wholesale
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
