"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SaleBadge,
  StockBadge,
  StarRating,
  PriceDisplay,
  IconButton,
} from "@/components/ui";
import type { ProductCardData } from "@/types/product";

// ============================================
// PRODUCT CARD COMPONENT
// ============================================

export interface ProductCardProps {
  product: ProductCardData;
  showQuickView?: boolean;
  showWishlist?: boolean;
  showAddToCart?: boolean;
  onQuickView?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

/**
 * ProductCard Component
 *
 * Displays a product in a card format for listings and carousels.
 * Features:
 * - Product image with hover actions
 * - Sale badge
 * - Stock status
 * - Star rating
 * - Price display
 * - Quick view, wishlist, add to cart buttons
 */
export default function ProductCard({
  product,
  showQuickView = true,
  showWishlist = true,
  showAddToCart = true,
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    slug,
    name,
    image,
    price,
    regularPrice,
    salePrice,
    averageRating,
    reviewCount,
    productBrands,
    onSale,
    stockStatus,
  } = product;

  const brandName = productBrands[0]?.name;
  const isOutOfStock = stockStatus === "OUT_OF_STOCK";

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(id);
  };

  // Handle wishlist
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(id);
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(id);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white",
        "border border-gray-border",
        "transition-shadow duration-200 hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - 260px × 300px display size */}
      <Link
        href={`/product/${slug}`}
        className="relative overflow-hidden bg-gray-light"
        style={{ width: '260px', height: '300px' }}
      >
        {/* Product Image */}
        {image && !imageError ? (
          <Image
            src={image.sourceUrl}
            alt={image.altText || name}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              "group-hover:scale-105"
            )}
            sizes="260px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-light">
            <span className="text-gray-medium text-sm">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {onSale && <SaleBadge />}
          {isOutOfStock && <StockBadge status="OUT_OF_STOCK" />}
        </div>

        {/* Hover Action Buttons */}
        <div
          className={cn(
            "absolute bottom-2 left-2 right-2 z-10",
            "flex justify-center gap-2",
            "transition-all duration-200",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          {showQuickView && (
            <IconButton
              icon={<Eye size={18} strokeWidth={1.5} />}
              aria-label="Quick view"
              variant="secondary"
              size="sm"
              onClick={handleQuickView}
              className="bg-white text-black hover:bg-red-primary hover:text-white"
            />
          )}
          {showWishlist && (
            <IconButton
              icon={<Heart size={18} strokeWidth={1.5} />}
              aria-label="Add to wishlist"
              variant="secondary"
              size="sm"
              onClick={handleWishlist}
              className="bg-white text-black hover:bg-red-primary hover:text-white"
            />
          )}
          {showAddToCart && !isOutOfStock && (
            <IconButton
              icon={<ShoppingCart size={18} strokeWidth={1.5} />}
              aria-label="Add to cart"
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              className="bg-white text-black hover:bg-red-primary hover:text-white"
            />
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="font-heading text-sm uppercase text-gray-dark">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4 min-w-0">
        {/* Brand */}
        {brandName && (
          <Link
            href={`/brands/${productBrands[0]?.slug}`}
            className="text-tiny text-gray-medium hover:text-red-primary transition-colors uppercase tracking-wide mb-1 truncate"
          >
            {brandName}
          </Link>
        )}

        {/* Product Name */}
        <h3 className="min-w-0 mb-2">
          <Link
            href={`/product/${slug}`}
            className="text-small font-medium text-black hover:text-red-primary transition-colors line-clamp-2 break-words"
          >
            {name}
          </Link>
        </h3>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={averageRating} size="sm" />
            <span className="text-tiny text-gray-medium">({reviewCount})</span>
          </div>
        )}

        {/* Price - Push to bottom */}
        <div className="mt-auto pt-2">
          <PriceDisplay
            price={price}
            regularPrice={regularPrice}
            salePrice={salePrice}
            size="md"
          />
        </div>
      </div>
    </article>
  );
}

// ============================================
// PRODUCT CARD SKELETON
// ============================================

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-border animate-pulse">
      {/* Image skeleton - 260px × 300px */}
      <div className="bg-gray-200" style={{ width: '260px', height: '300px' }} />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="h-3 w-16 bg-gray-200 rounded" />
        {/* Name */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
        {/* Rating */}
        <div className="h-4 w-24 bg-gray-200 rounded" />
        {/* Price */}
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
