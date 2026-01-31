"use client";

// ============================================
// CHECKOUT ORDER SUMMARY (Sidebar)
// ============================================

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart-store";

// ============================================
// COMPONENT
// ============================================

export function CheckoutSummary() {
  const { cart, applyCoupon, removeCoupon } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Calculate totals
  const subtotal = cart.subtotal;
  const discount = cart.discountTotal;
  const shipping = cart.shippingTotal;
  const tax = cart.taxTotal;
  const total = subtotal - discount + shipping + tax;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    const success = await applyCoupon(couponCode.trim());

    if (success) {
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
    }

    setIsApplyingCoupon(false);
  };

  return (
    <div className="bg-gray-light p-6 lg:sticky lg:top-4">
      {/* Mobile toggle header */}
      <button
        type="button"
        className="w-full flex items-center justify-between lg:hidden mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-heading font-bold uppercase">
          Order Summary ({cart.itemCount})
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold">{formatPrice(total)}</span>
          {isExpanded ? (
            <ChevronUp size={20} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={20} strokeWidth={1.5} />
          )}
        </div>
      </button>

      {/* Desktop header */}
      <h2 className="hidden lg:block font-heading font-bold text-h3 uppercase mb-6">
        Order Summary
      </h2>

      {/* Collapsible content */}
      <div className={cn("lg:block", isExpanded ? "block" : "hidden")}>
        {/* Cart Items */}
        <div className="space-y-4 pb-4 border-b border-gray-border mb-4">
          {cart.items.map((item) => (
            <div key={item.key} className="flex gap-3">
              {/* Product Image */}
              <div className="relative w-14 h-14 bg-white border border-gray-border flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image.sourceUrl}
                    alt={item.image.altText || item.name}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-medium text-tiny">
                    No img
                  </div>
                )}
                {/* Quantity badge */}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-medium text-white text-tiny font-bold flex items-center justify-center rounded-full">
                  {item.quantity}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-small font-semibold hover:text-red-primary line-clamp-2"
                >
                  {item.name}
                </Link>
                {item.variation && (
                  <p className="text-tiny text-gray-medium">
                    {item.variation.attributes?.map((attr) => attr.value).join(" / ")}
                  </p>
                )}
              </div>

              {/* Price */}
              <span className="text-small font-semibold flex-shrink-0">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon Code */}
        <div className="pb-4 border-b border-gray-border mb-4">
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <Input
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError(null);
                }}
                placeholder="Discount code"
                className="w-full"
                aria-label="Discount code"
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

          {couponError && (
            <p className="text-error text-small mt-2">{couponError}</p>
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
                  </div>
                  <button
                    onClick={() => removeCoupon(coupon.code)}
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

        {/* Order Totals */}
        <div className="space-y-3 pb-4 border-b border-gray-border mb-4">
          <div className="flex justify-between">
            <span className="text-gray-dark">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span className="font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-dark">Shipping</span>
            <span className="font-semibold">
              {shipping === 0
                ? cart.selectedShippingMethod
                  ? "FREE"
                  : "Calculated at next step"
                : formatPrice(shipping)}
            </span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-dark">Tax</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between">
          <span className="font-heading font-bold text-lg uppercase">Total</span>
          <span className="font-bold text-xl">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;
