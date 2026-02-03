"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// ============================================
// HERO SLIDE DATA
// ============================================

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: {
    src: string;
    alt: string;
  };
  textPosition?: "left" | "center" | "right";
  overlay?: boolean;
}

// ============================================
// FALLBACK - ONLY MAMMOTH (for testing)
// ============================================
const WP_HERO_IMAGES = {
  mammothSlider: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Mammoth-Slider-1.png",
};

// Single slide fallback - Mammoth only (no scrolling)
const defaultSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Mammoth Supplements",
    subtitle: "Canadian Made",
    description: "High-quality Canadian supplements for serious athletes.",
    ctaText: "Shop Mammoth",
    ctaLink: "/brands/mammoth",
    image: {
      src: WP_HERO_IMAGES.mammothSlider,
      alt: "Mammoth Supplements",
    },
    textPosition: "center",
    overlay: true,
  },
];

// ============================================
// HERO COMPONENT
// ============================================

interface HeroProps {
  slides?: HeroSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export default function Hero({
  slides = defaultSlides,
  autoplay = false, // DISABLED by default for testing
  autoplayDelay = 5000,
}: HeroProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Use default slides if no slides provided
  const heroSlides = slides.length > 0 ? slides : defaultSlides;
  
  // Check if we have multiple slides
  const hasMultipleSlides = heroSlides.length > 1;

  return (
    <section className="relative w-full" aria-label="Hero banner">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={hasMultipleSlides} // Only loop if multiple slides
        autoplay={
          autoplay && hasMultipleSlides // Only autoplay if multiple slides
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={
          hasMultipleSlides // Only show pagination if multiple slides
            ? {
                clickable: true,
                bulletClass: "hero-bullet",
                bulletActiveClass: "hero-bullet-active",
              }
            : false
        }
        allowTouchMove={hasMultipleSlides} // Disable swipe if single slide
        className="hero-swiper"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HeroSlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows - Only show if multiple slides */}
      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "bg-black/50 hover:bg-black/70",
              "text-white transition-colors",
              "hidden md:flex"
            )}
            style={{ transform: "translateY(-50%) skewX(-15deg)" }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} strokeWidth={1.5} style={{ transform: "skewX(15deg)" }} />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "bg-black/50 hover:bg-black/70",
              "text-white transition-colors",
              "hidden md:flex"
            )}
            style={{ transform: "translateY(-50%) skewX(-15deg)" }}
            aria-label="Next slide"
          >
            <ChevronRight size={24} strokeWidth={1.5} style={{ transform: "skewX(15deg)" }} />
          </button>
        </>
      )}

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        /* Hero Carousel Container - Floating with rounded corners */
        .hero-swiper {
          width: 90%;
          height: 54vh;
          min-height: 360px;
          max-height: 540px;
          margin: 16px auto 0;
          border-radius: 12px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .hero-swiper {
            height: 58.5vh;
            min-height: 405px;
            max-height: 585px;
          }
        }

        @media (min-width: 1024px) {
          .hero-swiper {
            height: 63vh;
            min-height: 450px;
            max-height: 630px;
          }
        }

        .hero-swiper .swiper-pagination {
          bottom: 20px;
        }

        .hero-swiper .swiper-slide {
          border-radius: 12px;
          overflow: hidden;
        }

        .hero-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid white;
          border-radius: 0;
          opacity: 1;
          margin: 0 6px !important;
          cursor: pointer;
          display: inline-block;
          transition: all 0.2s ease;
        }

        .hero-bullet-active {
          background: var(--color-red-primary);
          border-color: var(--color-red-primary);
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}

// ============================================
// HERO SLIDE CONTENT
// ============================================

interface HeroSlideContentProps {
  slide: HeroSlide;
}

function HeroSlideContent({ slide }: HeroSlideContentProps) {
  const textAlignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[slide.textPosition || "center"];

  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
        {/* Overlay - removed grey gradient */}
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4">
        <div
          className={cn(
            "h-full flex flex-col justify-center",
            "max-w-xl mx-auto",
            textAlignClass
          )}
        >
          {/* Tab 1 has no SHOP NOW button overlays on hero slides */}
        </div>
      </div>
    </div>
  );
}
