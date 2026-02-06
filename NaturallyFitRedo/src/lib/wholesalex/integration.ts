// ============================================
// WHOLESALEX INTEGRATION HELPERS
// ============================================

/**
 * WholesaleX Integration
 * 
 * Helper functions to interact with WholesaleX plugin data from WordPress/WooCommerce.
 * These functions query WholesaleX pricing, user roles, and product visibility settings.
 */

// ============================================
// CONFIGURATION
// ============================================

/**
 * WholesaleX user role name
 * Default: 'wholesale_customer' (common WholesaleX role)
 * 
 * To find your role name:
 * 1. WordPress Admin → Users → Roles
 * 2. Or check WholesaleX settings
 */
export const WHOLESALEX_ROLE = process.env.WHOLESALEX_ROLE_NAME || "wholesale_customer";
export const WHOLESALEX_PLATINUM_ROLE =
  process.env.WHOLESALEX_PLATINUM_ROLE_NAME || "wholesale_platinum";

/**
 * WholesaleX pricing meta key
 * Default: '_wholesale_price' (common meta key)
 * 
 * To find your meta key:
 * 1. Edit a product in WordPress
 * 2. Check custom fields for wholesale price
 * 3. Or check WholesaleX documentation
 */
export const WHOLESALEX_PRICE_META = process.env.WHOLESALEX_PRICE_META_KEY || "_wholesale_price";

/**
 * Wholesale discount percent (flat) fallback when no per-product price exists.
 * Use NEXT_PUBLIC_ for client-side access.
 */
export const WHOLESALE_DISCOUNT_PERCENT_DEFAULT = Number(
  process.env.NEXT_PUBLIC_WHOLESALE_DISCOUNT_PERCENT ||
    process.env.WHOLESALE_DISCOUNT_PERCENT ||
    0
);

export const WHOLESALE_DISCOUNT_PERCENT_PLATINUM = Number(
  process.env.NEXT_PUBLIC_WHOLESALE_PLATINUM_DISCOUNT_PERCENT ||
    process.env.WHOLESALE_PLATINUM_DISCOUNT_PERCENT ||
    0
);

// Temporary hardcoded rule: wholesale price is cost + 20%.
export const WHOLESALE_COST_PLUS_PERCENT = 20;

// ============================================
// USER ROLE CHECKING
// ============================================

/**
 * Check if a user has WholesaleX wholesale role
 */
export function isWholesaleXUser(userRole: string): boolean {
  return userRole === WHOLESALEX_ROLE || userRole === "wholesale_customer";
}

function normalizeRole(role?: string): string {
  return (role || "").toLowerCase().trim().replace(/\s+/g, "_");
}

export function getWholesaleDiscountPercent(userRole?: string): number {
  const normalized = normalizeRole(userRole);
  if (normalized === normalizeRole(WHOLESALEX_PLATINUM_ROLE)) {
    return WHOLESALE_DISCOUNT_PERCENT_PLATINUM;
  }
  if (normalized === normalizeRole(WHOLESALEX_ROLE)) {
    return WHOLESALE_DISCOUNT_PERCENT_DEFAULT;
  }
  return 0;
}

/**
 * Get WholesaleX role name
 */
export function getWholesaleXRole(): string {
  return WHOLESALEX_ROLE;
}

// ============================================
// PRICING HELPERS
// ============================================

/**
 * Get wholesale price for a product
 * 
 * This queries the product's meta fields for WholesaleX pricing.
 * You'll need to extend the GraphQL query to include meta fields,
 * or use WooCommerce REST API to get product meta.
 * 
 * @param productId - Product database ID
 * @param regularPrice - Regular retail price
 * @returns Wholesale price if available, otherwise regular price
 */
export async function getWholesalePrice(
  productId: number,
  regularPrice: number
): Promise<number> {
  // TODO: Implement actual WholesaleX price lookup
  // This will need to query WordPress/WooCommerce for product meta
  // Options:
  // 1. Extend GraphQL query to include meta fields
  // 2. Use WooCommerce REST API to get product meta
  // 3. Use WordPress REST API to query post meta
  
  // For now, return regular price (will be replaced with actual lookup)
  return regularPrice;
}

/**
 * Calculate wholesale discount percentage
 */
export function calculateWholesaleDiscount(
  regularPrice: number,
  wholesalePrice: number
): number {
  if (regularPrice === 0) return 0;
  return Math.round(((regularPrice - wholesalePrice) / regularPrice) * 100);
}

function parsePriceNumber(value: number | string | undefined): number | null {
  if (value === undefined) return null;
  const parsed =
    typeof value === "number"
      ? value
      : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Calculate effective wholesale price:
 * - Use WholesaleX per-product price if provided
 * - Otherwise apply flat % discount to regular price
 * - If a sale price is lower, use the sale price
 */
export function getEffectiveWholesalePrice(params: {
  regularPrice: number | string;
  salePrice?: number | string;
  wholesaleOverride?: number | string;
  discountPercent?: number;
  userRole?: string;
}): number | null {
  const regular = parsePriceNumber(params.regularPrice);
  if (regular === null) return null;

  const override = parsePriceNumber(params.wholesaleOverride);
  const sale = parsePriceNumber(params.salePrice);
  const discountPercent =
    typeof params.discountPercent === "number"
      ? params.discountPercent
      : getWholesaleDiscountPercent(params.userRole);
  const hasWholesaleRule = typeof override === "number" || discountPercent > 0;
  if (!hasWholesaleRule) return null;

  let candidate = regular;

  if (typeof override === "number") {
    candidate = override * (1 + WHOLESALE_COST_PLUS_PERCENT / 100);
  } else if (discountPercent > 0) {
    candidate = regular * (1 - discountPercent / 100);
  }

  if (typeof sale === "number" && sale < candidate) {
    candidate = sale;
  }

  return candidate;
}

// ============================================
// PRODUCT VISIBILITY
// ============================================

/**
 * Check if product should be visible to wholesale users
 * 
 * WholesaleX may hide certain products from retail customers
 * but show them to wholesale customers.
 */
export async function isProductVisibleToWholesale(
  _productId: number,
  _isWholesaleUser: boolean
): Promise<boolean> {
  // TODO: Implement WholesaleX visibility check
  // This will need to query WholesaleX product visibility settings
  
  // For now, return true (all products visible)
  return true;
}

// ============================================
// BULK ORDERING
// ============================================

/**
 * Get minimum order quantity for wholesale
 */
export function getWholesaleMinOrderQty(): number {
  // TODO: Get from WholesaleX settings
  return 1; // Default: no minimum
}

/**
 * Get wholesale pricing tiers (if quantity-based)
 */
export async function getWholesalePricingTiers(
  _productId: number
): Promise<Array<{ minQty: number; price: number }>> {
  // TODO: Query WholesaleX tiered pricing
  return [];
}

// ============================================
// NOTES FOR IMPLEMENTATION
// ============================================

/**
 * To fully implement WholesaleX integration, you'll need to:
 * 
 * 1. **Extend GraphQL queries** to include product meta fields:
 *    - Add meta fields to product queries in src/lib/graphql/products.ts
 *    - Query for WholesaleX pricing meta keys
 * 
 * 2. **Or use WooCommerce REST API** to get product meta:
 *    - GET /wp-json/wc/v3/products/{id}
 *    - Check meta_data array for WholesaleX pricing
 * 
 * 3. **Query user roles** from WordPress:
 *    - Use WooCommerce REST API: GET /wp-json/wc/v3/customers/{id}
 *    - Check roles array for WholesaleX role
 * 
 * 4. **Check product visibility**:
 *    - Query WholesaleX product visibility settings
 *    - May be stored in product meta or custom taxonomy
 * 
 * 5. **Get pricing tiers** (if using quantity-based pricing):
 *    - Query WholesaleX tiered pricing rules
 *    - Apply correct price based on quantity
 */
