import { cn } from "@/lib/utils";

// ============================================
// BADGE COMPONENT
// ============================================

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-light text-gray-dark",
  primary: "bg-red-primary text-white",
  success: "bg-success text-white",
  warning: "bg-warning text-black",
  error: "bg-error text-white",
  outline: "bg-transparent border border-gray-border text-gray-dark",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px] min-h-[18px]",
  md: "px-2 py-0.5 text-tiny min-h-[20px]",
  lg: "px-2.5 py-1 text-small min-h-[24px]",
};

/**
 * Badge Component
 * 
 * Small label for status, categories, counts.
 * 
 * @example
 * <Badge variant="success">In Stock</Badge>
 * <Badge variant="error">Out of Stock</Badge>
 * <Badge variant="warning">Low Stock</Badge>
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "font-body font-semibold",
        "rounded-sm whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================
// COUNT BADGE (Circular)
// ============================================

export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: "primary" | "error";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Count Badge Component
 * 
 * Circular badge for counts (cart, wishlist, notifications).
 * Shows "9+" when count exceeds max.
 * 
 * @example
 * <CountBadge count={3} />
 * <CountBadge count={15} max={9} /> // Shows "9+"
 */
export function CountBadge({
  count,
  max = 99,
  variant = "primary",
  size = "md",
  className,
}: CountBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  const variantClass = variant === "primary" ? "bg-red-primary" : "bg-error";
  const sizeClass = size === "sm" 
    ? "min-w-[16px] h-[16px] text-[10px]" 
    : "min-w-[20px] h-[20px] text-[11px]";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-full text-white font-bold",
        "px-1",
        variantClass,
        sizeClass,
        className
      )}
    >
      {displayCount}
    </span>
  );
}

// ============================================
// SALE BADGE
// ============================================

export interface SaleBadgeProps {
  percentage?: number;
  className?: string;
}

/**
 * Sale Badge Component
 * 
 * Shows "SALE" or discount percentage.
 * 
 * @example
 * <SaleBadge />
 * <SaleBadge percentage={25} /> // Shows "-25%"
 */
export function SaleBadge({ percentage, className }: SaleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "px-2 py-1 min-h-[24px]",
        "bg-red-primary text-white",
        "font-heading font-bold text-tiny uppercase tracking-button",
        "rounded-none",
        className
      )}
    >
      {percentage ? `-${percentage}%` : "SALE"}
    </span>
  );
}

// ============================================
// STOCK BADGE
// ============================================

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER" | "LOW_STOCK";

export interface StockBadgeProps {
  status: StockStatus;
  quantity?: number;
  lowStockThreshold?: number;
  className?: string;
}

const stockConfig: Record<StockStatus, { label: string; variant: BadgeVariant }> = {
  IN_STOCK: { label: "In Stock", variant: "success" },
  OUT_OF_STOCK: { label: "Out of Stock", variant: "error" },
  ON_BACKORDER: { label: "Backorder", variant: "warning" },
  LOW_STOCK: { label: "Low Stock", variant: "warning" },
};

/**
 * Stock Badge Component
 * 
 * Shows stock status with appropriate color.
 * 
 * @example
 * <StockBadge status="IN_STOCK" />
 * <StockBadge status="IN_STOCK" quantity={3} lowStockThreshold={5} />
 */
export function StockBadge({
  status,
  quantity,
  lowStockThreshold = 5,
  className,
}: StockBadgeProps) {
  // Check for low stock
  let effectiveStatus = status;
  if (status === "IN_STOCK" && quantity !== undefined && quantity <= lowStockThreshold) {
    effectiveStatus = "LOW_STOCK";
  }

  const config = stockConfig[effectiveStatus];

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
}
