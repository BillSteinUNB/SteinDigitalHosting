"use client";

// ============================================
// MINI CART COMPONENT
// ============================================

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { CountBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useCartStore, selectCartItems, selectCartItemCount, selectCartSubtotal, selectIsCartOpen } from "@/stores/cart-store";

// ============================================
// TYPES
// ============================================

interface MiniCartProps {
  /** Optional override for cart count (for SSR/static) */
  cartCount?: number;
  /** Icon color class */
  iconClassName?: string;
  /** Dropdown background for dark header context */
  darkMode?: boolean;
  /** Always show badge even when count is 0 */
  showBadgeAlways?: boolean;
}

// ============================================
// MINI CART COMPONENT
// ============================================

/**
 * MiniCart Component
 *
 * Cart icon with dropdown preview showing cart items.
 * Opens on hover (desktop) or click (mobile).
 * Connected to Zustand cart store.
 */
export default function MiniCart({ cartCount: cartCountProp, iconClassName = "", darkMode = false, showBadgeAlways = false }: MiniCartProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cart store state
  const items = useCartStore(selectCartItems);
  const storeItemCount = useCartStore(selectCartItemCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const isOpen = useCartStore(selectIsCartOpen);
  const { openMiniCart, closeMiniCart, removeItem } = useCartStore();

  // Use prop count if provided (for SSR), otherwise use store
  const itemCount = cartCountProp ?? storeItemCount;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeMiniCart();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeMiniCart]);

  // Handle hover with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    openMiniCart();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      closeMiniCart();
    }, 200);
  };

  // Handle item removal
  const handleRemoveItem = (key: string) => {
    removeItem(key);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cart Icon Button */}
      <button
        onClick={() => (isOpen ? closeMiniCart() : openMiniCart())}
        className={cn(
          "relative p-2 transition-colors",
          darkMode ? "hover:bg-white/10" : "hover:bg-gray-light",
          iconClassName
        )}
        aria-label={`Shopping cart (${itemCount} items)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ShoppingBag size={24} strokeWidth={1.5} />
        {(itemCount > 0 || showBadgeAlways) && (
          <CountBadge
            count={itemCount}
            size="sm"
            className="absolute -top-1 -right-1"
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2",
            "w-[360px] bg-white",
            "border border-gray-border shadow-dropdown",
            "animate-slide-down",
            "z-dropdown"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-border">
            <h3 className="font-heading font-bold text-h4 uppercase">
              Your Cart ({itemCount})
            </h3>
            <button
              onClick={closeMiniCart}
              className="p-1 hover:bg-gray-light transition-colors lg:hidden"
              aria-label="Close cart"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Cart Items */}
          {items.length > 0 ? (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {items.map((item) => {
                  const variationText = item.variation?.attributes
                    ?.map((attr) => `${attr.name}: ${attr.value}`)
                    .join(" | ");

                  return (
                    <div
                      key={item.key}
                      className="flex gap-3 p-4 border-b border-gray-border last:border-b-0"
                    >
                      {/* Image */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeMiniCart}
                        className="w-16 h-16 bg-gray-light flex-shrink-0 relative overflow-hidden"
                      >
                        {item.image?.sourceUrl ? (
                          <Image
                            src={item.image.sourceUrl}
                            alt={item.image.altText || item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-tiny text-gray-medium">IMG</span>
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeMiniCart}
                          className="text-small font-semibold line-clamp-2 mb-1 hover:text-red-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        {variationText && (
                          <p className="text-tiny text-gray-medium mb-1 truncate">
                            {variationText}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-small text-gray-medium">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-bold text-small">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveItem(item.key)}
                        className="p-1 text-gray-medium hover:text-error transition-colors self-start flex-shrink-0"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-border bg-gray-light">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-bold uppercase">Subtotal</span>
                  <span className="font-bold text-h4">{formatPrice(subtotal)}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={closeMiniCart}
                    className="btn btn-primary w-full text-center"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeMiniCart}
                    className="btn btn-outline w-full text-center"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="p-8 text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-medium" strokeWidth={1} />
              <p className="font-heading font-bold uppercase mb-2">Your Cart is Empty</p>
              <p className="text-small text-gray-medium mb-4">
                Add some products to get started!
              </p>
              <Link
                href="/shop"
                onClick={closeMiniCart}
                className="btn btn-primary inline-flex"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
