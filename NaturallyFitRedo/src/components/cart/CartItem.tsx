"use client";

// ============================================
// CART ITEM COMPONENT
// ============================================

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { QuantitySelector } from "@/components/ui";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem as CartItemType } from "@/types/cart";

// ============================================
// TYPES
// ============================================

export interface CartItemProps {
  item: CartItemType;
  /** Compact mode for MiniCart */
  compact?: boolean;
  className?: string;
}

// ============================================
// CART ITEM COMPONENT
// ============================================

/**
 * CartItem Component
 *
 * Displays a single cart item with product image, name, variation info,
 * quantity selector, prices, and remove button.
 *
 * @example
 * <CartItem item={cartItem} />
 * <CartItem item={cartItem} compact /> // For MiniCart
 */
export function CartItem({ item, compact = false, className }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(item.key, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.key);
  };

  // Build variation string
  const variationText = item.variation?.attributes
    ?.map((attr) => `${attr.name}: ${attr.value}`)
    .join(" | ");

  // Check if item is on sale
  const isOnSale = item.salePrice && item.salePrice < item.regularPrice;

  // Compact variant for MiniCart
  if (compact) {
    return (
      <div
        className={cn(
          "flex gap-3 p-4 border-b border-gray-border last:border-b-0",
          className
        )}
      >
        {/* Product Image */}
        <Link
          href={`/product/${item.slug}`}
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
            className="text-small font-semibold line-clamp-2 mb-1 hover:text-red-primary transition-colors"
          >
            {item.name}
          </Link>
          {variationText && (
            <p className="text-tiny text-gray-medium mb-1">{variationText}</p>
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

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-1 text-gray-medium hover:text-error transition-colors self-start flex-shrink-0"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Full cart page variant
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-border last:border-b-0",
        className
      )}
    >
      {/* Product Image */}
      <Link
        href={`/product/${item.slug}`}
        className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-light flex-shrink-0 relative overflow-hidden self-start"
      >
        {item.image?.sourceUrl ? (
          <Image
            src={item.image.sourceUrl}
            alt={item.image.altText || item.name}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-small text-gray-medium">IMG</span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Name & Variation */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/product/${item.slug}`}
            className="font-heading font-bold text-body uppercase hover:text-red-primary transition-colors line-clamp-2 break-words"
          >
            {item.name}
          </Link>
          {variationText && (
            <p className="text-small text-gray-medium mt-1">{variationText}</p>
          )}

          {/* Unit Price (mobile only) */}
          <div className="sm:hidden mt-2">
            {isOnSale ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-small text-gray-medium line-through">
                  {formatPrice(item.regularPrice)}
                </span>
                <span className="font-bold text-red-primary">
                  {formatPrice(item.price)}
                </span>
              </div>
            ) : (
              <span className="font-semibold">{formatPrice(item.price)}</span>
            )}
            <span className="text-tiny text-gray-medium"> each</span>
          </div>
        </div>

        {/* Unit Price (desktop) */}
        <div className="hidden sm:block w-28 text-right flex-shrink-0">
          {isOnSale ? (
            <div className="flex flex-col items-end">
              <span className="text-small text-gray-medium line-through">
                {formatPrice(item.regularPrice)}
              </span>
              <span className="font-bold text-red-primary">
                {formatPrice(item.price)}
              </span>
            </div>
          ) : (
            <span className="font-semibold">{formatPrice(item.price)}</span>
          )}
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-3 sm:w-32 flex-shrink-0">
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={99}
            size="sm"
          />
        </div>

        {/* Line Total */}
        <div className="sm:w-28 text-left sm:text-right flex-shrink-0">
          <span className="font-bold text-h4">{formatPrice(item.subtotal)}</span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 text-gray-medium hover:text-error hover:bg-gray-light transition-colors self-start flex-shrink-0"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// ============================================
// CART ITEM ROW (Table Layout for Desktop)
// ============================================

export interface CartItemRowProps {
  item: CartItemType;
  className?: string;
}

/**
 * CartItemRow Component
 *
 * Table row variant for desktop cart display.
 */
export function CartItemRow({ item, className }: CartItemRowProps) {
  const { updateItemQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(item.key, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.key);
  };

  const variationText = item.variation?.attributes
    ?.map((attr) => `${attr.name}: ${attr.value}`)
    .join(" | ");

  const isOnSale = item.salePrice && item.salePrice < item.regularPrice;

  return (
    <tr className={cn("border-b border-gray-border", className)}>
      {/* Product */}
      <td className="py-4 pr-4">
        <div className="flex gap-4 items-start">
          <Link
            href={`/product/${item.slug}`}
            className="w-20 h-20 bg-gray-light flex-shrink-0 relative overflow-hidden"
          >
            {item.image?.sourceUrl ? (
              <Image
                src={item.image.sourceUrl}
                alt={item.image.altText || item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-tiny text-gray-medium">IMG</span>
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              className="font-heading font-bold text-small uppercase hover:text-red-primary transition-colors line-clamp-2 break-words"
            >
              {item.name}
            </Link>
            {variationText && (
              <p className="text-small text-gray-medium mt-1">{variationText}</p>
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-4 text-center">
        {isOnSale ? (
          <div className="flex flex-col items-center">
            <span className="text-small text-gray-medium line-through">
              {formatPrice(item.regularPrice)}
            </span>
            <span className="font-bold text-red-primary">
              {formatPrice(item.price)}
            </span>
          </div>
        ) : (
          <span className="font-semibold">{formatPrice(item.price)}</span>
        )}
      </td>

      {/* Quantity */}
      <td className="py-4 px-4 text-center">
        <QuantitySelector
          value={item.quantity}
          onChange={handleQuantityChange}
          min={1}
          max={99}
          size="sm"
        />
      </td>

      {/* Subtotal */}
      <td className="py-4 px-4 text-right">
        <span className="font-bold">{formatPrice(item.subtotal)}</span>
      </td>

      {/* Remove */}
      <td className="py-4 pl-4 text-center">
        <button
          onClick={handleRemove}
          className="p-2 text-gray-medium hover:text-error hover:bg-gray-light transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={18} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
