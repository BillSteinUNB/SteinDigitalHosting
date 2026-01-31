"use client";

// ============================================
// CART PAGE
// ============================================

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, Button, EmptyState } from "@/components/ui";
import { CartItem, CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/stores/cart-store";

// ============================================
// CART PAGE COMPONENT
// ============================================

export default function CartPage() {
  const { cart, clearCart } = useCartStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <main className="py-8 lg:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-small flex-wrap">
            <li>
              <Link
                href="/"
                className="text-gray-medium hover:text-red-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-medium">/</li>
            <li className="text-black font-semibold">Shopping Cart</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <SectionHeading as="h1">
            Shopping Cart
            {cart.itemCount > 0 && (
              <span className="text-gray-medium font-normal ml-2">
                ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </SectionHeading>

          {cart.items.length > 0 && (
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-small text-gray-medium hover:text-red-primary transition-colors"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Empty Cart */}
        {cart.items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={64} strokeWidth={1} />}
            title="Your Cart is Empty"
            description="Looks like you haven't added any products yet. Start shopping to fill your cart with supplements and fitness essentials."
            action={
              <Link
                href="/shop"
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "font-heading font-bold uppercase tracking-button",
                  "border-0 rounded-none cursor-pointer",
                  "transition-all duration-200",
                  "bg-red-primary text-white hover:bg-red-hover",
                  "px-6 py-3 text-small min-h-[44px]"
                )}
              >
                Shop Now
              </Link>
            }
          />
        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
            {/* Cart Items */}
            <div className="min-w-0">
              {/* Cart Header - Desktop Table */}
              <div className="hidden lg:block mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left py-3 font-heading font-bold text-small uppercase">
                        Product
                      </th>
                      <th className="text-center py-3 px-4 font-heading font-bold text-small uppercase">
                        Price
                      </th>
                      <th className="text-center py-3 px-4 font-heading font-bold text-small uppercase">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-heading font-bold text-small uppercase">
                        Subtotal
                      </th>
                      <th className="py-3 pl-4 w-12">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <CartItemRow key={item.key} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cart Items - Mobile Cards */}
              <div className="lg:hidden border border-gray-border divide-y divide-gray-border mb-6">
                {cart.items.map((item) => (
                  <CartItem key={item.key} item={item} />
                ))}
              </div>

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-gray-border">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-small font-semibold hover:text-red-primary transition-colors"
                >
                  <ArrowLeft size={16} strokeWidth={1.5} />
                  Continue Shopping
                </Link>

                {/* Clear Cart */}
                <div className="relative">
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-small text-gray-medium">Clear all items?</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleClearCart}
                      >
                        Yes, Clear
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowClearConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="inline-flex items-center gap-2 text-small text-gray-medium hover:text-error transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="mt-8 lg:mt-0">
              <CartSummary />
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
