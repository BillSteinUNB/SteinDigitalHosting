"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";
import type { ACFCustomerReview } from "@/lib/wordpress/acf/types";

// Import Swiper styles
import "swiper/css";

// ============================================
// CUSTOMER REVIEWS DATA - Default/Fallback
// ============================================

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
}

const defaultReviews: Review[] = [
  {
    id: "review-1",
    name: "Matt Niles",
    rating: 5,
    text: "Great selection of products and fast shipping. The customer service team was very helpful when I had questions about my order. Will definitely be ordering again!",
  },
  {
    id: "review-2",
    name: "Alex Getliffe",
    rating: 5,
    text: "Been shopping here for years. Always the best prices and the loyalty program is fantastic. Highly recommend to anyone serious about their fitness goals.",
  },
  {
    id: "review-3",
    name: "Sarah Johnson",
    rating: 5,
    text: "Love the variety of products available. The website is easy to navigate and checkout is a breeze. Free shipping on orders over $75 is a great bonus!",
  },
  {
    id: "review-4",
    name: "Mike Roberts",
    rating: 5,
    text: "As a competitive athlete, I need quality supplements I can trust. Naturally Fit has never let me down. Their protein selection is second to none.",
  },
];

// ============================================
// CUSTOMER REVIEWS COMPONENT
// ============================================

export interface CustomerReviewsProps {
  title?: string;
  reviews?: Review[] | ACFCustomerReview[];
  className?: string;
  useACFFormat?: boolean;
}

/**
 * CustomerReviews Component
 *
 * Testimonials carousel showing customer reviews (Tab 1 style).
 * Includes star ratings, reviewer names, and quoted testimonials.
 * Supports both ACF and default data formats.
 */
export default function CustomerReviews({
  title = "What Customers Say",
  reviews,
  className,
  useACFFormat = false,
}: CustomerReviewsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Use provided reviews or fall back to defaults
  const displayReviews = reviews && reviews.length > 0 
    ? reviews 
    : defaultReviews;

  return (
    <section className={cn("py-12 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <SectionHeading centered>{title}</SectionHeading>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
            }}
            className="reviews-swiper"
          >
            {displayReviews.map((review) => (
              <SwiperSlide key={useACFFormat ? (review as ACFCustomerReview).name : (review as Review).id}>
                <ReviewCard review={review} isACF={useACFFormat} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10",
              "w-10 h-10 min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "bg-white shadow-md border border-gray-border",
              "text-black hover:bg-red-primary hover:text-white hover:border-red-primary",
              "transition-all duration-200",
              "hidden md:flex"
            )}
            aria-label="Previous review"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10",
              "w-10 h-10 min-w-[44px] min-h-[44px]",
              "flex items-center justify-center",
              "bg-white shadow-md border border-gray-border",
              "text-black hover:bg-red-primary hover:text-white hover:border-red-primary",
              "transition-all duration-200",
              "hidden md:flex"
            )}
            aria-label="Next review"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Google Reviews Badge */}
        <div className="flex justify-center mt-8">
          <Image
            src="https://nftest.dreamhosters.com/wp-content/uploads/2026/02/google-reviews_logo.jpg"
            alt="Google Reviews"
            width={225}
            height={92}
            className="w-[225px] h-[92px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

// ============================================
// REVIEW CARD
// ============================================

interface ReviewCardProps {
  review: Review | ACFCustomerReview;
  isACF?: boolean;
}

function ReviewCard({ review, isACF = false }: ReviewCardProps) {
  // Handle ACF format
  if (isACF) {
    const acfReview = review as ACFCustomerReview;
    return (
      <div className="bg-white p-6 border border-gray-border h-full">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              strokeWidth={1.5}
              className={cn(
                "fill-current",
                i < acfReview.rating ? "text-yellow-400" : "text-gray-300"
              )}
            />
          ))}
        </div>

        {/* Review Text */}
        <blockquote className="text-gray-dark mb-4 line-clamp-4">
          &ldquo;{acfReview.text}&rdquo;
        </blockquote>

        {/* Reviewer Name */}
        <p className="font-heading font-semibold text-sm uppercase text-black">
          {acfReview.name}
        </p>
      </div>
    );
  }

  // Handle default format
  const defaultReview = review as Review;
  return (
    <div className="bg-white p-6 border border-gray-border h-full">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            strokeWidth={1.5}
            className={cn(
              "fill-current",
              i < defaultReview.rating ? "text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="text-gray-dark mb-4 line-clamp-4">
        &ldquo;{defaultReview.text}&rdquo;
      </blockquote>

      {/* Reviewer Name */}
      <p className="font-heading font-semibold text-sm uppercase text-black">
        {defaultReview.name}
      </p>
    </div>
  );
}
