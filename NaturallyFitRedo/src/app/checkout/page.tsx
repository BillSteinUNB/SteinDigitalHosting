"use client";

// ============================================
// CHECKOUT PAGE
// ============================================

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CheckoutSteps,
  CheckoutInformation,
  CheckoutShipping,
  CheckoutPayment,
  CheckoutReview,
  CheckoutSummary,
} from "@/components/checkout";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCartStore } from "@/stores/cart-store";

// ============================================
// CHECKOUT PAGE COMPONENT
// ============================================

export default function CheckoutPage() {
  const router = useRouter();
  const { currentStep } = useCheckoutStore();
  const { cart } = useCartStore();

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart.items.length, router]);

  // Reset checkout on unmount (if not completed)
  useEffect(() => {
    return () => {
      // Only reset if order wasn't placed (no orderId)
      const { orderId } = useCheckoutStore.getState();
      if (!orderId) {
        // Don't reset on navigation within checkout
      }
    };
  }, []);

  // Don't render if cart is empty
  if (cart.items.length === 0) {
    return (
      <main className="py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag size={64} strokeWidth={1} className="mx-auto text-gray-medium mb-4" />
          <h1 className="font-heading font-bold text-2xl uppercase mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-dark mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link
            href="/shop"
            className={cn(
              "inline-flex items-center justify-center",
              "px-8 py-4 min-h-[52px]",
              "font-heading font-bold uppercase tracking-button",
              "bg-red-primary text-white hover:bg-red-hover",
              "transition-all duration-200"
            )}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "information":
        return <CheckoutInformation />;
      case "shipping":
        return <CheckoutShipping />;
      case "payment":
        return <CheckoutPayment />;
      case "review":
        return <CheckoutReview />;
      default:
        return <CheckoutInformation />;
    }
  };

  return (
    <main className="py-8 lg:py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-small text-gray-medium hover:text-red-primary transition-colors mb-2"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              Back to Cart
            </Link>
            <h1 className="font-heading font-bold text-2xl md:text-3xl uppercase">
              Checkout
            </h1>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-small text-gray-medium">
            <Lock size={16} strokeWidth={1.5} />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Checkout Steps Indicator */}
        <CheckoutSteps />

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Form Section */}
          <div className="min-w-0">
            {renderStepContent()}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="hidden lg:block">
            <CheckoutSummary />
          </aside>
        </div>

        {/* Mobile Order Summary (collapsible at top) */}
        <div className="lg:hidden mb-8 -mt-4">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
}
