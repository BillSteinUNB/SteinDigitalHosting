// ============================================
// REGISTER PAGE
// ============================================

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { RegisterForm } from "@/components/auth";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Create Account | Naturally Fit",
  description: "Create a Naturally Fit account to save your addresses, track orders, and get exclusive deals.",
};

// ============================================
// PAGE COMPONENT
// ============================================

export default function RegisterPage() {
  return (
    <main className="py-12 lg:py-16">
      <Container>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-h1 uppercase mb-2">
              Create Account
            </h1>
            <p className="text-body text-gray-medium">
              Join Naturally Fit and start your fitness journey today.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-light">
              <span className="text-h2 mb-2 block">📦</span>
              <p className="text-small font-semibold">Track Orders</p>
            </div>
            <div className="text-center p-4 bg-gray-light">
              <span className="text-h2 mb-2 block">💰</span>
              <p className="text-small font-semibold">Exclusive Deals</p>
            </div>
            <div className="text-center p-4 bg-gray-light">
              <span className="text-h2 mb-2 block">⚡</span>
              <p className="text-small font-semibold">Faster Checkout</p>
            </div>
          </div>

          {/* Register Form */}
          <div className="bg-white p-6 sm:p-8 border border-gray-border">
            <RegisterForm />
          </div>

          {/* Wholesale CTA */}
          <div className="mt-8 p-6 bg-gray-light text-center">
            <h2 className="font-heading font-bold text-h4 uppercase mb-2">
              Wholesale Accounts
            </h2>
            <p className="text-small text-gray-medium mb-4">
              Looking to buy in bulk? Apply for a wholesale account for special pricing.
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
