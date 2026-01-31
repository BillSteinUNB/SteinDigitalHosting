"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import type { ProductCardData } from "@/types/product";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ============================================
// PRODUCT CAROUSEL COMPONENT
// ============================================

export interface ProductCarouselProps {
  title: string;
  products: ProductCardData[];
  viewAllLink?: string;
  viewAllText?: string;
  isLoading?: boolean;
  slidesPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  onQuickView?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

/**
 * ProductCarousel Component
 *
 * Reusable product carousel with navigation arrows and pagination.
 * Used for Featured Products, Best Sellers, Related Products, etc.
 */
export default function ProductCarousel({
  title,
  products,
  viewAllLink,
  viewAllText = "View All",
  isLoading = false,
  slidesPerView = {},
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  className,
}: ProductCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Default slides per view with fallbacks
  const {
    mobile = 1.5,
    tablet = 2.5,
    desktop = 4,
    wide = 5,
  } = slidesPerView;

  // Don't render if no products and not loading
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading>{title}</SectionHeading>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-small font-heading uppercase tracking-wide text-red-primary hover:text-red-hover transition-colors"
            >
              {viewAllText} →
            </Link>
          )}
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={16}
            slidesPerView={mobile}
            breakpoints={{
              640: { slidesPerView: tablet, spaceBetween: 20 },
              1024: { slidesPerView: desktop, spaceBetween: 24 },
              1280: { slidesPerView: wide, spaceBetween: 24 },
            }}
            pagination={{
              clickable: true,
              bulletClass: "product-carousel-bullet",
              bulletActiveClass: "product-carousel-bullet-active",
            }}
            className="product-carousel-swiper !pb-12"
          >
            {isLoading
              ? // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <ProductCardSkeleton />
                  </SwiperSlide>
                ))
              : // Actual products
                products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard
                      product={product}
                      onQuickView={onQuickView}
                      onAddToWishlist={onAddToWishlist}
                      onAddToCart={onAddToCart}
                    />
                  </SwiperSlide>
                ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10",
              "w-10 h-10 min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "bg-white shadow-md border border-gray-border",
              "text-black hover:bg-red-primary hover:text-white hover:border-red-primary",
              "transition-all duration-200",
              "opacity-0 group-hover/carousel:opacity-100",
              "hidden md:flex"
            )}
            aria-label="Previous products"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10",
              "w-10 h-10 min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "bg-white shadow-md border border-gray-border",
              "text-black hover:bg-red-primary hover:text-white hover:border-red-primary",
              "transition-all duration-200",
              "opacity-0 group-hover/carousel:opacity-100",
              "hidden md:flex"
            )}
            aria-label="Next products"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .product-carousel-swiper .swiper-pagination {
          bottom: 0;
        }

        .product-carousel-bullet {
          width: 10px;
          height: 10px;
          background: var(--color-gray-medium);
          border-radius: 0;
          opacity: 1;
          margin: 0 4px !important;
          cursor: pointer;
          display: inline-block;
          transition: all 0.2s ease;
        }

        .product-carousel-bullet-active {
          background: var(--color-red-primary);
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}

// ============================================
// PRODUCT GRID (Non-carousel alternative)
// ============================================

export interface ProductGridProps {
  title?: string;
  products: ProductCardData[];
  columns?: 2 | 3 | 4 | 5;
  isLoading?: boolean;
  skeletonCount?: number;
  onQuickView?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

/**
 * ProductGrid Component
 *
 * Static grid layout for products (non-carousel).
 * Used for search results, category pages, etc.
 */
export function ProductGrid({
  title,
  products,
  columns = 4,
  isLoading = false,
  skeletonCount = 8,
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  className,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  return (
    <section className={cn("py-8", className)}>
      {title && (
        <div className="mb-8">
          <SectionHeading>{title}</SectionHeading>
        </div>
      )}

      <div className={cn("grid gap-4 md:gap-6", gridCols[columns])}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToWishlist={onAddToWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
      </div>
    </section>
  );
}
