import { cn } from "@/lib/utils";

// ============================================
// BASE SKELETON COMPONENT
// ============================================

export interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton Component
 * 
 * Loading placeholder that mimics content shape.
 * 
 * @example
 * <Skeleton width={200} height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 */
export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-sm",
    circular: "rounded-full",
    text: "rounded-sm h-4",
  };

  const animationStyles = {
    pulse: "animate-pulse",
    wave: "animate-[shimmer_2s_infinite]",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-gray-light",
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
}

// ============================================
// PRODUCT CARD SKELETON
// ============================================

export interface ProductCardSkeletonProps {
  className?: string;
}

/**
 * Product Card Skeleton
 * 
 * Loading placeholder for product cards.
 * Matches ProductCard layout exactly.
 */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-border p-4",
        className
      )}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full mb-4" />
      
      {/* Category/brand line */}
      <Skeleton height={12} className="w-3/4 mb-2" />
      
      {/* Title (2 lines) */}
      <Skeleton height={16} className="w-full mb-1" />
      <Skeleton height={16} className="w-2/3 mb-3" />
      
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="circular" width={14} height={14} />
        ))}
      </div>
      
      {/* Price */}
      <Skeleton height={20} className="w-1/3" />
    </div>
  );
}

// ============================================
// PRODUCT GRID SKELETON
// ============================================

export interface ProductGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Product Grid Skeleton
 * 
 * Grid of product card skeletons.
 */
export function ProductGridSkeleton({
  count = 8,
  columns = 4,
  className,
}: ProductGridSkeletonProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// CATEGORY CIRCLE SKELETON
// ============================================

export function CategoryCircleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3" aria-hidden="true">
      <Skeleton variant="circular" width={100} height={100} />
      <Skeleton height={14} className="w-20" />
    </div>
  );
}

// ============================================
// HERO BANNER SKELETON
// ============================================

export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[280px] md:h-[350px] lg:h-[500px]" aria-hidden="true">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Skeleton height={48} className="w-64" />
        <Skeleton height={24} className="w-48" />
        <Skeleton height={44} className="w-32" />
      </div>
    </div>
  );
}

// ============================================
// PROMO BANNER SKELETON
// ============================================

export function PromoBannerSkeleton() {
  return <Skeleton className="w-full h-[180px] rounded-lg" />;
}

// ============================================
// TABLE ROW SKELETON
// ============================================

export interface TableRowSkeletonProps {
  columns?: number;
  className?: string;
}

export function TableRowSkeleton({ columns = 4, className }: TableRowSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)} aria-hidden="true">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={16} className="flex-1" />
      ))}
    </div>
  );
}

// ============================================
// TEXT SKELETON
// ============================================

export interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

/**
 * Text Skeleton
 * 
 * Multiple lines of text placeholder.
 */
export function TextSkeleton({
  lines = 3,
  lastLineWidth = "w-3/4",
  className,
}: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            "h-4",
            i === lines - 1 ? lastLineWidth : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// ============================================
// CART ITEM SKELETON
// ============================================

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-border" aria-hidden="true">
      {/* Image */}
      <Skeleton width={80} height={80} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <Skeleton height={14} className="w-3/4 mb-2" />
        <Skeleton height={12} className="w-1/2 mb-3" />
        <div className="flex items-center gap-4">
          <Skeleton height={32} className="w-24" />
          <Skeleton height={16} className="w-16" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// FILTER SIDEBAR SKELETON
// ============================================

export function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Price filter */}
      <div>
        <Skeleton height={20} className="w-32 mb-4" />
        <Skeleton height={8} className="w-full mb-4" />
        <Skeleton height={40} className="w-full" />
      </div>
      
      {/* Category filter */}
      <div>
        <Skeleton height={20} className="w-40 mb-4" />
        <Skeleton height={44} className="w-full" />
      </div>
      
      {/* Brand filter */}
      <div>
        <Skeleton height={20} className="w-28 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton width={20} height={20} />
              <Skeleton height={14} className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
