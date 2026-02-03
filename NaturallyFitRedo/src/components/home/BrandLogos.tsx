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
import type { ACFBrandLogo } from "@/lib/wordpress/acf/types";

// Import Swiper styles
import "swiper/css";

// ============================================
// BRAND LOGOS COMPONENT
// ============================================

export interface BrandLogosProps {
  title?: string;
  brands: BrandWithDetails[] | ACFBrandLogo[];
  showTitle?: boolean;
  autoplay?: boolean;
  viewAllLink?: string;
  className?: string;
  // If true, brands are ACF format; if false, they're mock format
  useACFFormat?: boolean;
}

/**
 * BrandLogos Component
 *
 * Horizontal scrolling/carousel of brand logos.
 * Used on homepage to showcase featured brands.
 * Supports both ACF and mock data formats.
 */
export default function BrandLogos({
  title = "Discover Brands You'll Love",
  brands,
  showTitle = true,
  autoplay = true,
  viewAllLink = "/brands",
  className,
  useACFFormat = false,
}: BrandLogosProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12 bg-white", className)}>
      <div className="container">
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
            roundLengths
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
              <SwiperSlide key={useACFFormat ? (brand as ACFBrandLogo).name : (brand as BrandWithDetails).id}>
                <BrandLogo 
                  brand={brand} 
                  isACF={useACFFormat} 
                />
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
  brand: BrandWithDetails | ACFBrandLogo;
  isACF?: boolean;
}

function BrandLogo({ brand, isACF = false }: BrandLogoProps) {
  // Handle ACF format
  if (isACF) {
    const acfBrand = brand as ACFBrandLogo;
    return (
      <Link
        href={acfBrand.link}
        className={cn(
          "group",
          "flex items-center justify-center",
          "w-full h-[159px]",
          "transition-all duration-300",
          "focus-ring"
        )}
        title={acfBrand.name}
      >
        {acfBrand.logo?.url ? (
          <div className="relative w-[159px] h-[159px]">
            <Image
              src={acfBrand.logo.url}
              alt={acfBrand.logo.alt || acfBrand.name}
              fill
              sizes="159px"
              className={cn(
                "object-contain",
                "grayscale opacity-60",
                "transition-all duration-300",
                "group-hover:grayscale-0 group-hover:opacity-100"
              )}
              quality={100}
            />
          </div>
        ) : (
          <span className="font-heading text-sm uppercase text-gray-dark opacity-60 group-hover:opacity-100 transition-opacity">
            {acfBrand.name}
          </span>
        )}
      </Link>
    );
  }

  // Handle mock/original format
  const mockBrand = brand as BrandWithDetails;
  return (
    <Link
      href={`/brands/${mockBrand.slug}`}
      className={cn(
        "group",
        "flex items-center justify-center",
        "w-full h-[159px]",
        "transition-all duration-300",
        "focus-ring"
      )}
      title={mockBrand.name}
    >
      {mockBrand.logo ? (
        <div className="relative w-[159px] h-[159px]">
          <Image
            src={mockBrand.logo.sourceUrl}
            alt={mockBrand.logo.altText || mockBrand.name}
            fill
            sizes="159px"
            className={cn(
              "object-contain",
              "grayscale opacity-60",
              "transition-all duration-300",
              "group-hover:grayscale-0 group-hover:opacity-100"
            )}
            quality={100}
          />
        </div>
      ) : (
        <span className="font-heading text-sm uppercase text-gray-dark opacity-60 group-hover:opacity-100 transition-opacity">
          {mockBrand.name}
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
  brands: BrandWithDetails[] | ACFBrandLogo[];
  columns?: 4 | 5 | 6;
  showProductCount?: boolean;
  className?: string;
  useACFFormat?: boolean;
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
  useACFFormat = false,
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
            key={useACFFormat ? (brand as ACFBrandLogo).name : (brand as BrandWithDetails).id}
            brand={brand}
            showProductCount={showProductCount}
            isACF={useACFFormat}
          />
        ))}
      </div>
    </section>
  );
}

interface BrandCardProps {
  brand: BrandWithDetails | ACFBrandLogo;
  showProductCount?: boolean;
  isACF?: boolean;
}

function BrandCard({ brand, showProductCount, isACF = false }: BrandCardProps) {
  // Handle ACF format
  if (isACF) {
    const acfBrand = brand as ACFBrandLogo;
    return (
      <Link
        href={acfBrand.link}
        className={cn(
          "group flex flex-col items-center justify-center",
          "p-4 bg-white border border-gray-border",
          "hover:shadow-lg hover:border-red-primary",
          "transition-all duration-200"
        )}
      >
        {/* Logo - 159px × 159px */}
        <div 
          className="flex items-center justify-center mb-3"
          style={{ width: '159px', height: '159px' }}
        >
          {acfBrand.logo?.url ? (
            <Image
              src={acfBrand.logo.url}
              alt={acfBrand.logo.alt || acfBrand.name}
              width={159}
              height={159}
              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <span className="font-heading text-lg uppercase text-gray-dark group-hover:text-red-primary transition-colors">
              {acfBrand.name}
            </span>
          )}
        </div>

        {/* Brand Name */}
        <h3 className="font-heading text-sm uppercase text-center text-black group-hover:text-red-primary transition-colors">
          {acfBrand.name}
        </h3>
      </Link>
    );
  }

  // Handle mock/original format
  const mockBrand = brand as BrandWithDetails;
  // Determine if logo is rectangular or square
  const isSquareLogo = mockBrand.slug?.match(/alani-nu|anabar|believe|yummy/i);
  const logoHeight = isSquareLogo ? 159 : 121;

  return (
    <Link
      href={`/brands/${mockBrand.slug}`}
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
        {mockBrand.logo ? (
          <Image
            src={mockBrand.logo.sourceUrl}
            alt={mockBrand.logo.altText || mockBrand.name}
            width={159}
            height={logoHeight}
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <span className="font-heading text-lg uppercase text-gray-dark group-hover:text-red-primary transition-colors">
            {mockBrand.name}
          </span>
        )}
      </div>

      {/* Brand Name */}
      <h3 className="font-heading text-sm uppercase text-center text-black group-hover:text-red-primary transition-colors">
        {mockBrand.name}
      </h3>

      {/* Product Count */}
      {showProductCount && (
        <span className="text-tiny text-gray-medium mt-1">
          {mockBrand.productCount} Products
        </span>
      )}
    </Link>
  );
}
