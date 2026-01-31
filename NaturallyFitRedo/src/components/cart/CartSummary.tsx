"use client";

// ============================================
// CART SUMMARY COMPONENT
// ============================================

import { useState } from "react";
import Link from "next/link";
import { Tag, Truck, X, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { useCartStore } from "@/stores/cart-store";

// ============================================
// TYPES
// ============================================

export interface CartSummaryProps {
  className?: string;
  /** Show as sticky sidebar on desktop */
  sticky?: boolean;
}

// ============================================
// CART SUMMARY COMPONENT
// ============================================

/**
 * CartSummary Component
 *
 * Order summary sidebar with subtotal, discounts, shipping, taxes, total,
 * coupon code input, shipping method selector, and checkout button.
 *
 * @example
 * <CartSummary />
 * <CartSummary sticky />
 */
export function CartSummary({ className, sticky = true }: CartSummaryProps) {
  const { cart, applyCoupon, removeCoupon, setShippingMethod } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Calculate final total with shipping
  const finalTotal = cart.subtotal - cart.discountTotal + cart.shippingTotal + cart.taxTotal;

  // Check if free shipping is available (orders over $75)
  const freeShippingThreshold = 75;
  const amountUntilFreeShipping = freeShippingThreshold - cart.subtotal;
  const qualifiesForFreeShipping = cart.subtotal >= freeShippingThreshold;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(false);

    const success = await applyCoupon(couponCode.trim());

    if (success) {
      setCouponSuccess(true);
      setCouponCode("");
      // Clear success message after 3 seconds
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError("Invalid coupon code or already applied");
    }

    setIsApplyingCoupon(false);
  };

  // Handle coupon removal
  const handleRemoveCoupon = (code: string) => {
    removeCoupon(code);
  };

  // Handle shipping method change
  const handleShippingChange = (methodId: string) => {
    setShippingMethod(methodId);
  };

  return (
    <div
      className={cn(
        "bg-gray-light p-6",
        sticky && "lg:sticky lg:top-4",
        className
      )}
    >
      {/* Header */}
      <h2 className="font-heading font-bold text-h3 uppercase mb-6">
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      {!qualifiesForFreeShipping && cart.items.length > 0 && (
        <div className="mb-6 p-4 bg-white border border-gray-border">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} strokeWidth={1.5} className="text-gray-medium" />
            <span className="text-small">
              Add <strong className="text-red-primary">{formatPrice(amountUntilFreeShipping)}</strong> more
              for free shipping!
            </span>
          </div>
          <div className="w-full bg-gray-border h-2 overflow-hidden">
            <div
              className="bg-red-primary h-full transition-all duration-300"
              style={{ width: `${Math.min((cart.subtotal / freeShippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {qualifiesForFreeShipping && cart.items.length > 0 && (
        <div className="mb-6 p-4 bg-success/10 border border-success">
          <div className="flex items-center gap-2">
            <Check size={18} strokeWidth={1.5} className="text-success" />
            <span className="text-small font-semibold text-success">
              You qualify for free shipping!
            </span>
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="mb-6">
        <label className="text-small font-semibold mb-2 block">Coupon Code</label>
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <Input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError(null);
              }}
              placeholder="Enter code"
              className="w-full"
              aria-label="Coupon code"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={isApplyingCoupon || !couponCode.trim()}
            className="flex-shrink-0"
          >
            {isApplyingCoupon ? "..." : "Apply"}
          </Button>
        </div>

        {/* Coupon Error */}
        {couponError && (
          <div className="flex items-center gap-2 mt-2 text-error">
            <AlertCircle size={14} strokeWidth={1.5} />
            <span className="text-small">{couponError}</span>
          </div>
        )}

        {/* Coupon Success */}
        {couponSuccess && (
          <div className="flex items-center gap-2 mt-2 text-success">
            <Check size={14} strokeWidth={1.5} />
            <span className="text-small">Coupon applied successfully!</span>
          </div>
        )}

        {/* Applied Coupons */}
        {cart.appliedCoupons.length > 0 && (
          <div className="mt-3 space-y-2">
            {cart.appliedCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="flex items-center justify-between bg-white p-2 border border-gray-border"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Tag size={14} strokeWidth={1.5} className="text-success flex-shrink-0" />
                  <span className="text-small font-semibold truncate">{coupon.code}</span>
                  <span className="text-tiny text-gray-medium flex-shrink-0">
                    ({coupon.discountType === "percent" ? `${coupon.discountAmount}%` : formatPrice(coupon.discountAmount)} off)
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  className="p-1 text-gray-medium hover:text-error transition-colors flex-shrink-0"
                  aria-label={`Remove coupon ${coupon.code}`}
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shipping Methods */}
      {cart.items.length > 0 && cart.shippingMethods && (
        <div className="mb-6">
          <label className="text-small font-semibold mb-3 block">Shipping Method</label>
          <div className="space-y-2">
            {cart.shippingMethods.map((method) => {
              const isDisabled = method.id === "free_shipping" && !qualifiesForFreeShipping;
              const isSelected = cart.selectedShippingMethod === method.id;

              return (
                <label
                  key={method.id}
                  className={cn(
                    "flex items-start gap-3 p-3 bg-white border cursor-pointer transition-colors",
                    isSelected ? "border-red-primary" : "border-gray-border hover:border-gray-medium",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="radio"
                    name="shipping-method"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => handleShippingChange(method.id)}
                    disabled={isDisabled}
                    className="mt-0.5 accent-red-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-small font-semibold">{method.label}</span>
                      <span className="text-small font-bold flex-shrink-0">
                        {method.cost === 0 ? "FREE" : formatPrice(method.cost)}
                      </span>
                    </div>
                    {method.description && (
                      <p className="text-tiny text-gray-medium mt-0.5">{method.description}</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Totals */}
      <div className="space-y-3 py-4 border-t border-gray-border">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-body text-gray-dark">Subtotal</span>
          <span className="text-body font-semibold">{formatPrice(cart.subtotal)}</span>
        </div>

        {/* Discount */}
        {cart.discountTotal > 0 && (
          <div className="flex items-center justify-between text-success">
            <span className="text-body">Discount</span>
            <span className="text-body font-semibold">-{formatPrice(cart.discountTotal)}</span>
          </div>
        )}

        {/* Shipping */}
        {cart.selectedShippingMethod && (
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-dark">Shipping</span>
            <span className="text-body font-semibold">
              {cart.shippingTotal === 0 ? "FREE" : formatPrice(cart.shippingTotal)}
            </span>
          </div>
        )}

        {/* Tax */}
        {cart.taxTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-dark">Tax</span>
            <span className="text-body font-semibold">{formatPrice(cart.taxTotal)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-gray-dark">
        <span className="font-heading font-bold text-h3 uppercase">Total</span>
        <span className="font-bold text-h2">{formatPrice(finalTotal)}</span>
      </div>

      {/* Checkout Button */}
      <div className="space-y-3 mt-4">
        {cart.items.length > 0 ? (
          <Link
            href="/checkout"
            className={cn(
              "inline-flex items-center justify-center gap-2 w-full",
              "font-heading font-bold uppercase tracking-button",
              "border-0 rounded-none cursor-pointer",
              "transition-all duration-200",
              "bg-red-primary text-white hover:bg-red-hover",
              "px-8 py-4 text-body min-h-[52px]"
            )}
          >
            Proceed to Checkout
          </Link>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled
          >
            Proceed to Checkout
          </Button>
        )}

        <Link
          href="/shop"
          className="block text-center text-small text-gray-medium hover:text-red-primary transition-colors underline"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Payment Methods Note */}
      <div className="mt-6 pt-4 border-t border-gray-border">
        <p className="text-tiny text-gray-medium text-center">
          Secure checkout powered by industry-standard encryption.
          We accept Visa, Mastercard, American Express, and PayPal.
        </p>
      </div>
    </div>
  );
}

export default CartSummary;
