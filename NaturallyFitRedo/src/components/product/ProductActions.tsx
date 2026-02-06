"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Check, Share2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, QuantitySelector, Spinner } from "@/components/ui";
import { useCartStore } from "@/stores/cart-store";
import type { ProductImage, ProductVariation } from "@/types/product";

// ============================================
// PRODUCT ACTIONS COMPONENT
// ============================================

export interface ProductActionsProps {
  productId: number;
  productName: string;
  productSlug: string;
  productImage?: ProductImage;
  price: number;
  regularPrice: number;
  salePrice?: number;
  wholesalePrice?: number;
  isWholesale?: boolean;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  stockQuantity?: number;
  variation?: ProductVariation;
  isVariableProduct?: boolean;
  allVariationsSelected?: boolean;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
  className?: string;
}

/**
 * ProductActions Component
 *
 * Contains the main product actions:
 * - Quantity selector
 * - Add to cart button
 * - Add to wishlist button
 * - Share button
 */
export default function ProductActions({
  productId,
  productName,
  productSlug,
  productImage,
  price,
  regularPrice,
  salePrice,
  wholesalePrice,
  isWholesale = false,
  stockStatus,
  stockQuantity,
  variation,
  isVariableProduct = false,
  allVariationsSelected = true,
  onAddToWishlist,
  isInWishlist = false,
  className,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const { addItem, openMiniCart } = useCartStore();

  const isOutOfStock = stockStatus === "OUT_OF_STOCK";
  const hasValidVariation = !isVariableProduct || Boolean(variation);
  const canAddToCart =
    !isOutOfStock &&
    (!isVariableProduct || allVariationsSelected) &&
    hasValidVariation &&
    (variation ? variation.stockStatus !== "OUT_OF_STOCK" : true);

  // Max quantity based on stock
  const maxQuantity = stockQuantity ?? 99;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!canAddToCart) return;

    setIsAddingToCart(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const effectivePrice = variation
        ? parseFloat(variation.price.replace(/[^0-9.]/g, ""))
        : price;
      const effectiveRegularPrice = variation
        ? parseFloat(variation.regularPrice.replace(/[^0-9.]/g, ""))
        : regularPrice;
      const effectiveSalePrice = variation?.salePrice
        ? parseFloat(variation.salePrice.replace(/[^0-9.]/g, ""))
        : salePrice;
      const effectiveWholesalePrice =
        isWholesale && typeof wholesalePrice === "number"
          ? wholesalePrice
          : undefined;

      addItem({
        productId,
        variationId: variation?.databaseId,
        quantity,
        item: {
          productId,
          variationId: variation?.databaseId,
          name: variation ? `${productName} - ${variation.name}` : productName,
          slug: productSlug,
          image: variation?.image || productImage,
          price: effectiveWholesalePrice ?? effectivePrice,
          regularPrice: effectiveRegularPrice,
          salePrice: effectiveSalePrice,
          variation: variation
            ? { name: variation.name, attributes: variation.attributes }
            : undefined,
        },
      });

      setAddedToCart(true);
      openMiniCart();

      // Reset added state after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist
  const handleWishlist = async () => {
    if (!onAddToWishlist) return;

    setIsWishlistLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onAddToWishlist();
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Handle share
  const handleShare = async (method: "copy" | "twitter" | "facebook") => {
    const url = typeof window !== "undefined" 
      ? `${window.location.origin}/product/${productSlug}`
      : `/product/${productSlug}`;

    switch (method) {
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Quantity and Add to Cart Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quantity Selector */}
        {canAddToCart && (
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={maxQuantity}
            disabled={isAddingToCart}
          />
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart || isAddingToCart}
          variant={addedToCart ? "secondary" : "primary"}
          size="lg"
          className="flex-1 md:flex-none md:min-w-[200px]"
        >
          {isAddingToCart ? (
            <>
              <Spinner size="sm" color="white" />
              <span className="ml-2">ADDING...</span>
            </>
          ) : addedToCart ? (
            <>
              <Check size={18} strokeWidth={2} />
              <span className="ml-2">ADDED TO CART</span>
            </>
          ) : isOutOfStock ? (
            "OUT OF STOCK"
          ) : !allVariationsSelected ? (
            "SELECT OPTIONS"
          ) : !hasValidVariation ? (
            "UNAVAILABLE OPTION"
          ) : (
            <>
              <ShoppingCart size={18} strokeWidth={1.5} />
              <span className="ml-2">ADD TO CART</span>
            </>
          )}
        </Button>
      </div>

      {/* Secondary Actions Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          className={cn(
            "inline-flex items-center gap-2",
            "text-small font-semibold uppercase tracking-wide",
            "transition-colors min-h-[44px]",
            isInWishlist
              ? "text-red-primary"
              : "text-gray-dark hover:text-red-primary"
          )}
        >
          {isWishlistLoading ? (
            <Spinner size="sm" />
          ) : (
            <Heart
              size={18}
              strokeWidth={1.5}
              fill={isInWishlist ? "currentColor" : "none"}
            />
          )}
          {isInWishlist ? "IN WISHLIST" : "ADD TO WISHLIST"}
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={cn(
              "inline-flex items-center gap-2",
              "text-small font-semibold uppercase tracking-wide",
              "text-gray-dark hover:text-red-primary",
              "transition-colors min-h-[44px]"
            )}
          >
            <Share2 size={18} strokeWidth={1.5} />
            SHARE
          </button>

          {/* Share Dropdown */}
          {showShareMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowShareMenu(false)}
              />

              {/* Menu */}
              <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-border shadow-lg py-2 min-w-[160px]">
                <button
                  type="button"
                  onClick={() => handleShare("copy")}
                  className="w-full px-4 py-2 text-left text-small hover:bg-gray-light flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Link
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleShare("twitter")}
                  className="w-full px-4 py-2 text-left text-small hover:bg-gray-light"
                >
                  Share on Twitter
                </button>
                <button
                  type="button"
                  onClick={() => handleShare("facebook")}
                  className="w-full px-4 py-2 text-left text-small hover:bg-gray-light"
                >
                  Share on Facebook
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Out of Stock Message */}
      {isOutOfStock && (
        <div className="p-4 bg-gray-light border border-gray-border">
          <p className="text-body text-gray-dark mb-2">
            This product is currently out of stock.
          </p>
          <button
            type="button"
            className="text-small font-semibold text-red-primary hover:underline"
          >
            Notify me when available
          </button>
        </div>
      )}

      {/* Variable Product - No Selection Message */}
      {isVariableProduct && !allVariationsSelected && !isOutOfStock && (
        <p className="text-small text-gray-medium">
          Please select all options above to add this product to your cart.
        </p>
      )}
    </div>
  );
}

// ============================================
// BUY NOW BUTTON (Optional enhancement)
// ============================================

export interface BuyNowButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function BuyNowButton({
  onClick,
  disabled = false,
  className,
}: BuyNowButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="secondary"
      size="lg"
      className={cn("w-full", className)}
    >
      BUY NOW
    </Button>
  );
}

// ============================================
// SKELETON
// ============================================

export function ProductActionsSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-3">
        <div className="w-[120px] h-[44px] bg-gray-200" />
        <div className="flex-1 h-[52px] bg-gray-200" />
      </div>

      {/* Secondary actions */}
      <div className="flex items-center gap-4">
        <div className="w-32 h-5 bg-gray-200 rounded" />
        <div className="w-16 h-5 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
