/**
 * Format a number as Canadian currency
 *
 * @param price - The price in dollars (e.g., 29.99)
 * @param showCents - Whether to always show cents (default: true)
 * @returns Formatted price string (e.g., "$29.99")
 *
 * @example
 * formatPrice(29.99) // "$29.99"
 * formatPrice(30, false) // "$30"
 * formatPrice(0) // "$0.00"
 */
export function formatPrice(price: number | string, showCents: boolean = true): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "$0.00";
  }

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat("en-CA", options).format(numericPrice);
}

/**
 * Format a price range
 *
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Formatted price range (e.g., "$29.99 - $49.99")
 *
 * @example
 * formatPriceRange(29.99, 49.99) // "$29.99 - $49.99"
 * formatPriceRange(30, 30) // "$30.00"
 */
export function formatPriceRange(min: number | string, max: number | string): string {
  const minFormatted = formatPrice(min);
  const maxFormatted = formatPrice(max);

  if (minFormatted === maxFormatted) {
    return minFormatted;
  }

  return `${minFormatted} - ${maxFormatted}`;
}

/**
 * Calculate discount percentage
 *
 * @param regularPrice - Original price
 * @param salePrice - Discounted price
 * @returns Discount percentage rounded to nearest integer
 *
 * @example
 * calculateDiscount(100, 75) // 25
 */
export function calculateDiscount(
  regularPrice: number | string,
  salePrice: number | string
): number {
  const regular = typeof regularPrice === "string" ? parseFloat(regularPrice) : regularPrice;
  const sale = typeof salePrice === "string" ? parseFloat(salePrice) : salePrice;

  if (isNaN(regular) || isNaN(sale) || regular <= 0) {
    return 0;
  }

  return Math.round(((regular - sale) / regular) * 100);
}
