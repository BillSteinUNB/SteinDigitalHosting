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
import type { Banner } from "@/lib/wordpress/banners";

// Import Swiper styles
import "swiper/css";

// ============================================
// PRODUCT BANNER CAROUSEL
// ============================================

export interface ProductBannerCarouselProps {
  title?: string;
  banners: Banner[];
  showTitle?: boolean;
  autoplay?: boolean;
  viewAllLink?: string;
  className?: string;
}

/**
 * ProductBannerCarousel Component
 *
 * Horizontal scrolling carousel of product banners.
 * Used on homepage to showcase featured products/categories.
 * Dynamically shows all uploaded banners (6, 10, or any number).
 */
export default function ProductBannerCarousel({
  title = "Discover Products You'll Love",
  banners,
  showTitle = true,
  autoplay = true,
  viewAllLink = "/shop",
  className,
}: ProductBannerCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Don't render if no banners
  if (banners.length === 0) {
    return null;
  }

  // Determine slides per view based on banner count
  // If fewer banners, show fewer per view so they don't look stretched
  const getSlidesPerView = () => {
    if (banners.length <= 2) return banners.length;
    if (banners.length <= 4) return 2;
    return 2;
  };

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
                View All →
              </Link>
            )}
          </div>
        )}

        {/* Product Banner Carousel */}
        <div className="relative group/banners">
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={getSlidesPerView()}
            roundLengths
            loop={banners.length > 4} // Only loop if we have enough banners
            autoplay={
              autoplay
                ? {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            breakpoints={{
              480: { slidesPerView: Math.min(3, banners.length) },
              640: { slidesPerView: Math.min(4, banners.length) },
              768: { slidesPerView: Math.min(5, banners.length) },
              1024: { slidesPerView: Math.min(6, banners.length) },
              1280: { slidesPerView: Math.min(8, banners.length) },
            }}
            className="product-banners-swiper"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <ProductBannerItem banner={banner} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows - only show if we have enough banners */}
          {banners.length > 2 && (
            <>
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
                  "opacity-0 group-hover/banners:opacity-100",
                  "hidden md:flex"
                )}
                aria-label="Previous banners"
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
                  "opacity-0 group-hover/banners:opacity-100",
                  "hidden md:flex"
                )}
                aria-label="Next banners"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {/* Pagination dots for mobile */}
        {banners.length > 2 && (
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  "bg-gray-300 hover:bg-red-primary"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// PRODUCT BANNER ITEM
// ============================================

interface ProductBannerItemProps {
  banner: Banner;
}

function ProductBannerItem({ banner }: ProductBannerItemProps) {
  return (
    <Link
      href={banner.link || "/shop"}
      className={cn(
        "group",
        "flex items-center justify-center",
        "w-full aspect-square max-w-[200px] mx-auto",
        "transition-all duration-300",
        "focus-ring"
      )}
      title={banner.title}
    >
      {banner.imageUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={banner.imageUrl}
            alt={banner.alt || banner.title}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
            className={cn(
              "object-contain",
              "grayscale opacity-70",
              "transition-all duration-300",
              "group-hover:grayscale-0 group-hover:opacity-100"
            )}
            quality={90}
          />
        </div>
      ) : (
        <span className="font-heading text-sm uppercase text-gray-dark opacity-60 group-hover:opacity-100 transition-opacity">
          {banner.title}
        </span>
      )}
    </Link>
  );
}
