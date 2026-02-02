"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";
import type { BrandWithDetails } from "@/lib/mock/brands";

// Import Swiper styles
import "swiper/css";

// ============================================
// BRAND LOGOS COMPONENT
// ============================================

export interface BrandLogosProps {
  title?: string;
  brands: BrandWithDetails[];
  showTitle?: boolean;
  autoplay?: boolean;
  viewAllLink?: string;
  className?: string;
}

/**
 * BrandLogos Component
 *
 * Horizontal scrolling/carousel of brand logos.
 * Used on homepage to showcase featured brands.
 */
export default function BrandLogos({
  title = "Shop by Brand",
  brands,
  showTitle = true,
  autoplay = true,
  viewAllLink = "/brands",
  className,
}: BrandLogosProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {showTitle && (
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionHeading>{title}</SectionHeading>

            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-small font-heading uppercase tracking-wide text-red-primary hover:text-red-hover transition-colors"
              >
                View All Brands →
              </Link>
            )}
          </div>
        )}

        {/* Brand Carousel */}
        <div className="relative group/brands">
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={2}
            loop={brands.length > 6}
            autoplay={
              autoplay
                ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            breakpoints={{
              480: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
            className="brand-logos-swiper"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <BrandLogo brand={brand} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
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
              "opacity-0 group-hover/brands:opacity-100",
              "hidden md:flex"
            )}
            aria-label="Previous brands"
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
              "opacity-0 group-hover/brands:opacity-100",
              "hidden md:flex"
            )}
            aria-label="Next brands"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================
// BRAND LOGO ITEM
// ============================================

interface BrandLogoProps {
  brand: BrandWithDetails;
}

function BrandLogo({ brand }: BrandLogoProps) {
  // Determine if logo is rectangular or square based on aspect ratio hint
  // Rectangular logos: 159px × 121px (1.32:1 ratio) - e.g., TC Nutrition, Advanced Genetics
  // Square logos: 159px × 159px (1:1 ratio) - e.g., Alani Nu, Anabar
  const isSquareLogo = brand.slug?.match(/alani-nu|anabar|believe|yummy/i);
  const logoWidth = 159;
  const logoHeight = isSquareLogo ? 159 : 121;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "flex items-center justify-center",
        "bg-gray-light border border-transparent",
        "grayscale hover:grayscale-0",
        "opacity-60 hover:opacity-100",
        "hover:border-gray-border",
        "transition-all duration-300"
      )}
      style={{ width: '159px', height: isSquareLogo ? '159px' : '121px' }}
      title={brand.name}
    >
      {brand.logo ? (
        <Image
          src={brand.logo.sourceUrl}
          alt={brand.logo.altText || brand.name}
          width={logoWidth}
          height={logoHeight}
          className="object-contain"
          style={{ maxWidth: '159px', maxHeight: isSquareLogo ? '159px' : '121px' }}
        />
      ) : (
        <span className="font-heading text-sm uppercase text-gray-dark">
          {brand.name}
        </span>
      )}
    </Link>
  );
}

// ============================================
// BRAND GRID (Alternative layout)
// ============================================

export interface BrandGridProps {
  title?: string;
  brands: BrandWithDetails[];
  columns?: 4 | 5 | 6;
  showProductCount?: boolean;
  className?: string;
}

/**
 * BrandGrid Component
 *
 * Static grid of brand cards.
 * Used on the brands page.
 */
export function BrandGrid({
  title,
  brands,
  columns = 5,
  showProductCount = true,
  className,
}: BrandGridProps) {
  const gridCols = {
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  };

  return (
    <section className={cn("py-8", className)}>
      {title && (
        <div className="mb-8">
          <SectionHeading>{title}</SectionHeading>
        </div>
      )}

      <div className={cn("grid gap-4", gridCols[columns])}>
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            showProductCount={showProductCount}
          />
        ))}
      </div>
    </section>
  );
}

interface BrandCardProps {
  brand: BrandWithDetails;
  showProductCount?: boolean;
}

function BrandCard({ brand, showProductCount }: BrandCardProps) {
  // Determine if logo is rectangular or square
  const isSquareLogo = brand.slug?.match(/alani-nu|anabar|believe|yummy/i);
  const logoHeight = isSquareLogo ? 159 : 121;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "group flex flex-col items-center justify-center",
        "p-4 bg-white border border-gray-border",
        "hover:shadow-lg hover:border-red-primary",
        "transition-all duration-200"
      )}
    >
      {/* Logo - 159px × 121px (rectangular) or 159px × 159px (square) */}
      <div 
        className="flex items-center justify-center mb-3"
        style={{ width: '159px', height: `${logoHeight}px` }}
      >
        {brand.logo ? (
          <Image
            src={brand.logo.sourceUrl}
            alt={brand.logo.altText || brand.name}
            width={159}
            height={logoHeight}
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <span className="font-heading text-lg uppercase text-gray-dark group-hover:text-red-primary transition-colors">
            {brand.name}
          </span>
        )}
      </div>

      {/* Brand Name */}
      <h3 className="font-heading text-sm uppercase text-center text-black group-hover:text-red-primary transition-colors">
        {brand.name}
      </h3>

      {/* Product Count */}
      {showProductCount && (
        <span className="text-tiny text-gray-medium mt-1">
          {brand.productCount} Products
        </span>
      )}
    </Link>
  );
}
