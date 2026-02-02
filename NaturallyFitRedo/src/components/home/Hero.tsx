"use client";

import { useRef } from "react";
import Link from "next/link";
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

// Default hero slides
const defaultSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Fuel Your Potential",
    subtitle: "New Arrivals",
    description: "Discover the latest in sports nutrition from the world's top brands.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    secondaryCtaText: "View Sale Items",
    secondaryCtaLink: "/shop?on_sale=true",
    image: {
      src: "/images/hero/hero-1.png",
      alt: "Athlete training with supplements",
    },
    textPosition: "left",
    overlay: true,
  },
  {
    id: "slide-2",
    title: "Up to 40% Off",
    subtitle: "Winter Sale",
    description: "Stock up on your favorite proteins, pre-workouts, and more.",
    ctaText: "Shop Sale",
    ctaLink: "/shop?on_sale=true",
    image: {
      src: "/images/hero/hero-2.png",
      alt: "Supplement sale promotion",
    },
    textPosition: "left",
    overlay: true,
  },
  {
    id: "slide-3",
    title: "GHOST x Warheads",
    subtitle: "Limited Edition",
    description: "Experience the legendary sour flavors in your favorite pre-workout.",
    ctaText: "Shop GHOST",
    ctaLink: "/brands/ghost",
    image: {
      src: "/images/hero/hero-3.png",
      alt: "GHOST supplements",
    },
    textPosition: "left",
    overlay: true,
  },
  {
    id: "slide-4",
    title: "Wholesale Program",
    subtitle: "For Gyms & Retailers",
    description: "Get exclusive pricing and dedicated support for your business.",
    ctaText: "Learn More",
    ctaLink: "/wholesale",
    secondaryCtaText: "Apply Now",
    secondaryCtaLink: "/wholesale/apply",
    image: {
      src: "/images/hero/hero-4.png",
      alt: "Wholesale supplements",
    },
    textPosition: "left",
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
  autoplay = true,
  autoplayDelay = 5000,
}: HeroProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative w-full" aria-label="Hero carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={{
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
        }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HeroSlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10",
          "w-12 h-12 min-w-[44px] min-h-[44px]",
          "flex items-center justify-center",
          "bg-white/90 hover:bg-white",
          "text-black transition-colors",
          "hidden md:flex"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10",
          "w-12 h-12 min-w-[44px] min-h-[44px]",
          "flex items-center justify-center",
          "bg-white/90 hover:bg-white",
          "text-black transition-colors",
          "hidden md:flex"
        )}
        aria-label="Next slide"
      >
        <ChevronRight size={24} strokeWidth={1.5} />
      </button>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          height: 500px;
        }

        @media (min-width: 768px) {
          .hero-swiper {
            height: 600px;
          }
        }

        @media (min-width: 1024px) {
          .hero-swiper {
            height: 700px;
          }
        }

        .hero-swiper .swiper-pagination {
          bottom: 20px;
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
  }[slide.textPosition || "left"];

  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        {slide.overlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4">
        <div
          className={cn(
            "h-full flex flex-col justify-center",
            "max-w-xl",
            textAlignClass
          )}
        >
          {/* Subtitle */}
          {slide.subtitle && (
            <span className="inline-block mb-2 px-3 py-1 bg-red-primary text-white text-sm font-heading uppercase tracking-wide">
              {slide.subtitle}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white uppercase leading-tight mb-4">
            {slide.title}
          </h1>

          {/* Description */}
          {slide.description && (
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-md">
              {slide.description}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={slide.ctaLink}
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button text-body",
                "bg-red-primary text-white hover:bg-red-hover",
                "transition-all duration-200"
              )}
            >
              {slide.ctaText}
            </Link>

            {slide.secondaryCtaText && slide.secondaryCtaLink && (
              <Link
                href={slide.secondaryCtaLink}
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-8 py-4 min-h-[52px]",
                  "font-heading font-bold uppercase tracking-button text-body",
                  "bg-transparent border-2 border-white text-white",
                  "hover:bg-white hover:text-black",
                  "transition-all duration-200"
                )}
              >
                {slide.secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
