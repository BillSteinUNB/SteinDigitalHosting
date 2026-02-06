function normalizeHref(href: string): string {
  return href.trim();
}

const defaultWholesaleLoginUrl = "/wholesale/login";
const defaultWholesaleOrderUrl = "/shop";

/**
 * Wholesale portal links.
 *
 * If you're using a WooCommerce wholesale plugin like WholesaleX, you can point these URLs
 * at the WordPress/WooCommerce pages that plugin provides (login, bulk order form, etc.).
 */
export const wholesaleLinks = {
  /** Where wholesale customers should login */
  login: normalizeHref(defaultWholesaleLoginUrl),
  /** Where wholesale customers should order / shop (bulk order form or wholesale shop) */
  order: normalizeHref(process.env.NEXT_PUBLIC_WHOLESALE_ORDER_URL || defaultWholesaleOrderUrl),
  /** Where to apply for wholesale account */
  register: normalizeHref("/wholesale/register"),
};

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

