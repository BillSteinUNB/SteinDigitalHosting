"use client";

import { useState } from "react";
import { ThumbsUp, CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Textarea,
  StarRatingInput,
  StarRating,
  RatingSummary,
  EmptyState,
} from "@/components/ui";
import type { MockReview } from "@/lib/mock/users";

// ============================================
// PRODUCT REVIEWS COMPONENT
// ============================================

export interface ProductReviewsProps {
  reviews: MockReview[];
  averageRating: number;
  totalReviews: number;
  productId: number;
  onSubmitReview?: (review: ReviewFormData) => Promise<void>;
  className?: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  name: string;
  email: string;
}

/**
 * ProductReviews Component
 *
 * Complete reviews section for product pages:
 * - Rating summary with distribution
 * - Review list with helpful votes
 * - Review submission form
 */
export default function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
  productId,
  onSubmitReview,
  className,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);

  // Calculate rating distribution
  const distribution = reviews.reduce(
    (acc, review) => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (rating >= 1 && rating <= 5) {
        acc[rating]++;
      }
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<1 | 2 | 3 | 4 | 5, number>
  );

  return (
    <div className={cn("w-full", className)} id="reviews">
      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
        {/* Rating Summary */}
        <div className="md:w-1/3">
          <RatingSummary
            averageRating={averageRating}
            totalReviews={totalReviews}
            distribution={distribution}
          />
        </div>

        {/* Write Review CTA */}
        <div className="md:w-2/3 flex flex-col items-start">
          <h3 className="text-h4 font-heading font-bold uppercase mb-2">
            Share Your Experience
          </h3>
          <p className="text-body text-gray-dark mb-4">
            Help other customers by sharing your thoughts on this product.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            variant={showForm ? "secondary" : "primary"}
          >
            {showForm ? "CANCEL" : "WRITE A REVIEW"}
          </Button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onSubmit={async (data) => {
            await onSubmitReview?.(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="border-t border-gray-border pt-8">
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<User size={48} strokeWidth={1} />}
            title="No Reviews Yet"
            description="Be the first to share your experience with this product."
            action={
              !showForm && (
                <Button onClick={() => setShowForm(true)}>
                  WRITE A REVIEW
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// REVIEW CARD COMPONENT
// ============================================

interface ReviewCardProps {
  review: MockReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const formattedDate = new Date(review.date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <article className="border-b border-gray-border pb-6 last:border-b-0">
      {/* Review Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-light flex items-center justify-center">
            <User size={20} className="text-gray-medium" strokeWidth={1.5} />
          </div>

          {/* Name & Date */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-body font-semibold">{review.userName}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-tiny text-success">
                  <CheckCircle size={14} />
                  Verified Purchase
                </span>
              )}
            </div>
            <span className="text-tiny text-gray-medium">{formattedDate}</span>
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review Title */}
      <h4 className="text-body font-semibold text-black mb-2">
        {review.title}
      </h4>

      {/* Review Content */}
      <p className="text-body text-gray-dark leading-relaxed mb-4">
        {review.content}
      </p>

      {/* Helpful Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={hasVoted}
          className={cn(
            "inline-flex items-center gap-2",
            "text-small transition-colors",
            hasVoted
              ? "text-success cursor-default"
              : "text-gray-medium hover:text-black"
          )}
        >
          <ThumbsUp size={16} strokeWidth={1.5} />
          Helpful ({helpfulCount})
        </button>
      </div>
    </article>
  );
}

// ============================================
// REVIEW FORM COMPONENT
// ============================================

interface ReviewFormProps {
  productId: number;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel: () => void;
}

function ReviewForm({ productId: _productId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    if (!title.trim()) {
      newErrors.title = "Please enter a review title";
    }
    if (!content.trim()) {
      newErrors.content = "Please enter your review";
    }
    if (content.trim().length < 20) {
      newErrors.content = "Review must be at least 20 characters";
    }
    if (!name.trim()) {
      newErrors.name = "Please enter your name";
    }
    if (!email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        rating,
        title: title.trim(),
        content: content.trim(),
        name: name.trim(),
        email: email.trim(),
      });

      // Reset form on success
      setRating(0);
      setTitle("");
      setContent("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({ submit: "Failed to submit review. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-light p-6 mb-8 border border-gray-border"
    >
      <h3 className="text-h4 font-heading font-bold uppercase mb-6">
        Write Your Review
      </h3>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-small font-semibold text-black mb-2">
          Your Rating *
        </label>
        <StarRatingInput
          value={rating}
          onChange={setRating}
          size="lg"
        />
        {errors.rating && (
          <p className="text-tiny text-error mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div className="mb-4">
        <Input
          label="Review Title *"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />
      </div>

      {/* Content */}
      <div className="mb-4">
        <Textarea
          label="Your Review *"
          placeholder="Share your experience with this product. What did you like or dislike?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={errors.content}
          rows={5}
        />
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Your Name *"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Your Email *"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          hint="Your email will not be published"
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p className="text-small text-error mb-4">{errors.submit}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}

// ============================================
// SKELETON
// ============================================

export function ProductReviewsSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 space-y-4">
          <div className="h-16 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>

        {/* CTA */}
        <div className="md:w-2/3 space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200" />
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-border pt-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 border-b border-gray-border pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
