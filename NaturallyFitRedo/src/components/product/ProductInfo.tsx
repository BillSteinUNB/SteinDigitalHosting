import Link from "next/link";
import { cn } from "@/lib/utils";
import { StarRating, PriceDisplay, Badge } from "@/components/ui";
import type { ProductBrand, ProductCategory, StockStatus } from "@/types/product";

// ============================================
// PRODUCT INFO COMPONENT
// ============================================

export interface ProductInfoProps {
  name: string;
  brand?: ProductBrand;
  categories?: ProductCategory[];
  sku?: string;
  price: string;
  regularPrice: string;
  salePrice?: string;
  wholesalePrice?: string;
  averageRating: number;
  reviewCount: number;
  shortDescription?: string;
  stockStatus: StockStatus;
  stockQuantity?: number;
  showWholesalePrice?: boolean;
  className?: string;
}

/**
 * ProductInfo Component
 *
 * Displays core product information:
 * - Brand (linked)
 * - Product name
 * - SKU
 * - Rating with review count
 * - Price display
 * - Short description
 * - Stock status
 */
export default function ProductInfo({
  name,
  brand,
  categories,
  sku,
  price,
  regularPrice,
  salePrice,
  wholesalePrice,
  averageRating,
  reviewCount,
  shortDescription,
  stockStatus,
  stockQuantity,
  showWholesalePrice = false,
  className,
}: ProductInfoProps) {
  const isOutOfStock = stockStatus === "OUT_OF_STOCK";
  const isLowStock = stockStatus === "IN_STOCK" && stockQuantity !== undefined && stockQuantity <= 5;
  const isOnBackorder = stockStatus === "ON_BACKORDER";

  return (
    <div className={cn("flex flex-col gap-4 min-w-0", className)}>
      {/* Breadcrumb Categories */}
      {categories && categories.length > 0 && (
        <nav aria-label="Product categories" className="text-tiny text-gray-medium">
          <ol className="flex flex-wrap items-center gap-1">
            {categories.map((category, index) => (
              <li key={category.id} className="flex items-center">
                <Link
                  href={`/shop/${category.slug}`}
                  className="hover:text-red-primary transition-colors"
                >
                  {category.name}
                </Link>
                {index < categories.length - 1 && (
                  <span className="mx-1">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Brand */}
      {brand && (
        <Link
          href={`/brands/${brand.slug}`}
          className="text-small text-gray-medium hover:text-red-primary transition-colors uppercase tracking-wide font-semibold"
        >
          {brand.name}
        </Link>
      )}

      {/* Product Name */}
      <h1 className="text-h2 md:text-h1 font-heading font-bold text-black leading-tight break-words">
        {name}
      </h1>

      {/* SKU */}
      {sku && (
        <p className="text-tiny text-gray-medium">
          SKU: <span className="font-medium">{sku}</span>
        </p>
      )}

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-3">
        <StarRating rating={averageRating} size="md" />
        <span className="text-small font-medium text-gray-dark">{averageRating.toFixed(1)}</span>
        {reviewCount > 0 ? (
          <Link
            href="#reviews"
            className="text-small text-gray-medium hover:text-red-primary transition-colors"
          >
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </Link>
        ) : (
          <Link
            href="#reviews"
            className="text-small text-gray-medium hover:text-red-primary transition-colors"
          >
            Write a review
          </Link>
        )}
      </div>

      {/* Price Display */}
      <div className="flex flex-col gap-2">
        <PriceDisplay
          price={price}
          regularPrice={regularPrice}
          salePrice={salePrice}
          size="lg"
        />

        {/* Wholesale Price (for logged-in wholesale customers) */}
        {showWholesalePrice && wholesalePrice && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">WHOLESALE</Badge>
            <span className="text-body font-semibold text-gray-dark">
              {wholesalePrice}
            </span>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock && (
          <Badge variant="error" size="md">Out of Stock</Badge>
        )}
        {isOnBackorder && (
          <Badge variant="warning" size="md">Available on Backorder</Badge>
        )}
        {isLowStock && (
          <Badge variant="warning" size="md">Only {stockQuantity} left!</Badge>
        )}
        {stockStatus === "IN_STOCK" && !isLowStock && (
          <Badge variant="success" size="md">In Stock</Badge>
        )}
      </div>

      {/* Short Description */}
      {shortDescription && (
        <div
          className="text-body text-gray-dark leading-relaxed prose prose-sm max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />
      )}
    </div>
  );
}

// ============================================
// PRODUCT INFO SKELETON
// ============================================

export function ProductInfoSkeleton() {
  return (
    <div className="flex flex-col gap-4 min-w-0 animate-pulse">
      {/* Categories */}
      <div className="h-3 w-32 bg-gray-200 rounded" />

      {/* Brand */}
      <div className="h-4 w-24 bg-gray-200 rounded" />

      {/* Name */}
      <div className="space-y-2">
        <div className="h-8 w-full bg-gray-200 rounded" />
        <div className="h-8 w-3/4 bg-gray-200 rounded" />
      </div>

      {/* SKU */}
      <div className="h-3 w-20 bg-gray-200 rounded" />

      {/* Rating */}
      <div className="h-5 w-40 bg-gray-200 rounded" />

      {/* Price */}
      <div className="h-8 w-32 bg-gray-200 rounded" />

      {/* Stock */}
      <div className="h-6 w-24 bg-gray-200 rounded" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
