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
// WORDPRESS IMAGE REFERENCES - RevSlider Homepage
// ============================================
const WP_HERO_IMAGES = {
  alaniSlider: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Alani-Slider-1.png",
  mammothSlider: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Mammoth-Slider-1.png",
  believeSlider: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Believe-Slider-1.png",
  vndlSlider: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/VNDL-Slider-1.png",
  batchSlider: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Batch-27-Slider-2.png",
  energyPouches: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Energy-Pouches-1.jpg",
  communityImage: "https://naturallyfit.ca/wp-content/uploads/2024/03/288388789_5831383580222630_2687580129211060376_n.jpg",
  promoSlider: "https://naturallyfit.ca/wp-content/uploads/2025/10/Add-a-heading-1350-x-510-px-1.png",
};

// Default hero slides
const defaultSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Alani Nu",
    subtitle: "Shop Now",
    description: "Premium supplements for your fitness journey.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    image: {
      src: WP_HERO_IMAGES.alaniSlider,
      alt: "Alani Nu Supplements",
    },
    textPosition: "center",
    overlay: true,
  },
  {
    id: "slide-2",
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
  {
    id: "slide-3",
    title: "Believe Supplements",
    subtitle: "Premium Quality",
    description: "Fuel your workouts with Believe Supplements.",
    ctaText: "Shop Believe",
    ctaLink: "/brands/believe",
    image: {
      src: WP_HERO_IMAGES.believeSlider,
      alt: "Believe Supplements",
    },
    textPosition: "center",
    overlay: true,
  },
  {
    id: "slide-4",
    title: "VNDL Project",
    subtitle: "Performance Driven",
    description: "Next-level performance supplements.",
    ctaText: "Shop VNDL",
    ctaLink: "/brands/vndl",
    image: {
      src: WP_HERO_IMAGES.vndlSlider,
      alt: "VNDL Project Supplements",
    },
    textPosition: "center",
    overlay: true,
  },
  {
    id: "slide-5",
    title: "Batch 27",
    subtitle: "New Arrival",
    description: "Discover the latest from Batch 27.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    image: {
      src: WP_HERO_IMAGES.batchSlider,
      alt: "Batch 27 Supplements",
    },
    textPosition: "center",
    overlay: true,
  },
  {
    id: "slide-6",
    title: "Energy Pouches",
    subtitle: "New Product",
    description: "Convenient energy on the go.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    image: {
      src: WP_HERO_IMAGES.energyPouches,
      alt: "Energy Pouches",
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

      {/* Custom Navigation Arrows - Subtle style matching original */}
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

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        /* Hero Carousel Container - Full Width Responsive */
        .hero-swiper {
          width: 100%;
          height: 60vh;
          min-height: 400px;
          max-height: 600px;
        }

        @media (min-width: 768px) {
          .hero-swiper {
            height: 65vh;
            min-height: 450px;
            max-height: 650px;
          }
        }

        @media (min-width: 1024px) {
          .hero-swiper {
            height: 70vh;
            min-height: 500px;
            max-height: 700px;
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
  }[slide.textPosition || "center"];

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
