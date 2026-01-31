import { cn } from "@/lib/utils";
import { formatPrice, formatPriceRange, calculateDiscount } from "@/lib/utils";

// ============================================
// PRICE DISPLAY COMPONENT
// ============================================

export interface PriceDisplayProps {
  price: number | string;
  regularPrice?: number | string;
  salePrice?: number | string;
  wholesalePrice?: number | string;
  isWholesale?: boolean;
  showDiscount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: {
    price: "text-body font-bold",
    regular: "text-small",
    discount: "text-tiny",
  },
  md: {
    price: "text-h4 font-bold",
    regular: "text-body",
    discount: "text-small",
  },
  lg: {
    price: "text-h2 font-bold",
    regular: "text-h4",
    discount: "text-body",
  },
};

/**
 * Price Display Component
 * 
 * Shows price with optional sale/wholesale variants.
 * Handles regular, sale, and wholesale pricing.
 * 
 * @example
 * <PriceDisplay price={29.99} />
 * <PriceDisplay price={24.99} regularPrice={29.99} showDiscount />
 * <PriceDisplay price={29.99} wholesalePrice={22.99} isWholesale />
 */
export function PriceDisplay({
  price,
  regularPrice,
  salePrice,
  wholesalePrice,
  isWholesale = false,
  showDiscount = false,
  size = "md",
  className,
}: PriceDisplayProps) {
  const styles = sizeStyles[size];
  
  // Determine which price to show
  const currentPrice = salePrice || price;
  const originalPrice = salePrice ? (regularPrice || price) : regularPrice;
  const isOnSale = Boolean(salePrice) || (regularPrice && Number(regularPrice) > Number(price));
  
  // Wholesale takes priority if user is wholesale
  const displayPrice = isWholesale && wholesalePrice ? wholesalePrice : currentPrice;
  const priceColorClass = isWholesale && wholesalePrice ? "text-success" : isOnSale ? "text-red-primary" : "text-black";
  
  // Calculate discount
  const discountPercent = isOnSale && originalPrice 
    ? calculateDiscount(originalPrice, currentPrice)
    : 0;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      {/* Current/Sale price */}
      <span className={cn(styles.price, priceColorClass)}>
        {formatPrice(displayPrice)}
      </span>

      {/* Original price (strikethrough) */}
      {isOnSale && originalPrice && !isWholesale && (
        <span className={cn(styles.regular, "text-gray-medium line-through")}>
          {formatPrice(originalPrice)}
        </span>
      )}

      {/* Discount percentage badge */}
      {showDiscount && discountPercent > 0 && !isWholesale && (
        <span className={cn(
          styles.discount,
          "px-1.5 py-0.5 bg-red-primary text-white font-bold rounded-sm"
        )}>
          -{discountPercent}%
        </span>
      )}

      {/* Wholesale indicator */}
      {isWholesale && wholesalePrice && (
        <span className={cn(styles.discount, "text-success font-semibold")}>
          Wholesale
        </span>
      )}
    </div>
  );
}

// ============================================
// PRICE RANGE DISPLAY
// ============================================

export interface PriceRangeDisplayProps {
  minPrice: number | string;
  maxPrice: number | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Price Range Display Component
 * 
 * Shows price range for variable products.
 * 
 * @example
 * <PriceRangeDisplay minPrice={29.99} maxPrice={49.99} />
 */
export function PriceRangeDisplay({
  minPrice,
  maxPrice,
  size = "md",
  className,
}: PriceRangeDisplayProps) {
  const styles = sizeStyles[size];
  const isSamePrice = Number(minPrice) === Number(maxPrice);

  return (
    <span className={cn(styles.price, "text-black", className)}>
      {isSamePrice ? formatPrice(minPrice) : formatPriceRange(minPrice, maxPrice)}
    </span>
  );
}

// ============================================
// COMPARE PRICE DISPLAY
// ============================================

export interface ComparePriceDisplayProps {
  retailPrice: number | string;
  wholesalePrice: number | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Compare Price Display Component
 * 
 * Shows both retail and wholesale prices for comparison.
 * Used on product pages for wholesale customers.
 * 
 * @example
 * <ComparePriceDisplay retailPrice={29.99} wholesalePrice={22.99} />
 */
export function ComparePriceDisplay({
  retailPrice,
  wholesalePrice,
  size = "md",
  className,
}: ComparePriceDisplayProps) {
  const styles = sizeStyles[size];
  const savings = Number(retailPrice) - Number(wholesalePrice);
  const savingsPercent = calculateDiscount(retailPrice, wholesalePrice);

  return (
    <div className={cn("space-y-1", className)}>
      {/* Wholesale price (prominent) */}
      <div className="flex items-baseline gap-2">
        <span className={cn(styles.price, "text-success")}>
          {formatPrice(wholesalePrice)}
        </span>
        <span className={cn(styles.discount, "text-success font-semibold")}>
          Wholesale Price
        </span>
      </div>

      {/* Retail price (comparison) */}
      <div className="flex items-baseline gap-2">
        <span className={cn(styles.regular, "text-gray-medium line-through")}>
          {formatPrice(retailPrice)}
        </span>
        <span className={cn(styles.discount, "text-gray-medium")}>
          Retail
        </span>
      </div>

      {/* Savings */}
      <p className={cn(styles.discount, "text-success")}>
        You save {formatPrice(savings)} ({savingsPercent}%)
      </p>
    </div>
  );
}

// ============================================
// SIMPLE PRICE (Minimal)
// ============================================

export interface SimplePriceProps {
  amount: number | string;
  className?: string;
}

/**
 * Simple Price Component
 * 
 * Just the formatted price, no frills.
 * 
 * @example
 * <SimplePrice amount={29.99} />
 */
export function SimplePrice({ amount, className }: SimplePriceProps) {
  return (
    <span className={cn("font-bold", className)}>
      {formatPrice(amount)}
    </span>
  );
}
