"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

// ============================================
// STAR RATING DISPLAY COMPONENT
// ============================================

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  className?: string;
}

const sizeConfig = {
  sm: { starSize: 14, gap: "gap-0.5", textSize: "text-tiny" },
  md: { starSize: 16, gap: "gap-0.5", textSize: "text-small" },
  lg: { starSize: 20, gap: "gap-1", textSize: "text-body" },
};

/**
 * Star Rating Display Component
 * 
 * Shows rating as filled/empty stars.
 * Gold (#FFD700) for filled, light gray for empty.
 * 
 * @example
 * <StarRating rating={4.5} />
 * <StarRating rating={4} showCount count={24} />
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showCount = false,
  count = 0,
  className,
}: StarRatingProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("inline-flex items-center", config.gap, className)}>
      {/* Stars */}
      <div className={cn("flex items-center", config.gap)}>
        {Array.from({ length: maxRating }, (_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

          return (
            <span key={index} className="relative inline-block">
              {/* Empty star (background) */}
              <Star
                size={config.starSize}
                className="text-star-empty"
                fill="currentColor"
                strokeWidth={0}
              />
              {/* Filled star (overlay with clip) */}
              {fillPercentage > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    size={config.starSize}
                    className="text-star"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Review count */}
      {showCount && (
        <span className={cn("text-gray-medium ml-1", config.textSize)}>
          ({count})
        </span>
      )}
    </div>
  );
}

// ============================================
// INTERACTIVE STAR RATING COMPONENT
// ============================================

export interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "md" | "lg";
  disabled?: boolean;
  className?: string;
}

/**
 * Interactive Star Rating Component
 * 
 * Clickable stars for rating input.
 * 
 * @example
 * <StarRatingInput value={rating} onChange={setRating} />
 */
export function StarRatingInput({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  disabled = false,
  className,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const config = sizeConfig[size];

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div
      className={cn(
        "inline-flex items-center",
        config.gap,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onMouseLeave={() => setHoverValue(0)}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !disabled && setHoverValue(starValue)}
            className={cn(
              "p-0.5 transition-transform",
              !disabled && "hover:scale-110 cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-primary focus-visible:ring-offset-1"
            )}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            <Star
              size={config.starSize}
              className={cn(
                "transition-colors",
                isFilled ? "text-star" : "text-star-empty"
              )}
              fill="currentColor"
              strokeWidth={0}
            />
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// RATING SUMMARY COMPONENT
// ============================================

export interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  className?: string;
}

/**
 * Rating Summary Component
 * 
 * Shows average rating with distribution bars.
 * Used on product pages.
 * 
 * @example
 * <RatingSummary
 *   averageRating={4.5}
 *   totalReviews={124}
 *   distribution={{ 5: 80, 4: 30, 3: 10, 2: 3, 1: 1 }}
 * />
 */
export function RatingSummary({
  averageRating,
  totalReviews,
  distribution,
  className,
}: RatingSummaryProps) {
  return (
    <div className={cn("flex gap-6", className)}>
      {/* Average rating */}
      <div className="text-center">
        <div className="text-hero font-heading font-bold">
          {averageRating.toFixed(1)}
        </div>
        <StarRating rating={averageRating} size="md" />
        <p className="text-small text-gray-medium mt-1">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Distribution bars */}
      {distribution && (
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars as keyof typeof distribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-tiny text-gray-medium w-3">{stars}</span>
                <Star size={12} className="text-star" fill="currentColor" strokeWidth={0} />
                <div className="flex-1 h-2 bg-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-star rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-tiny text-gray-medium w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
