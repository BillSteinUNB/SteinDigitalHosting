// ============================================
// DATA UTILITY FUNCTIONS
// ============================================

import type {
  Product,
  ProductCardData,
  ProductFilters,
  ProductSortOption,
  PaginatedProducts,
} from "@/types/product";
import {
  allProducts,
  allProductCards,
} from "./products";

// ============================================
// PRODUCT RETRIEVAL
// ============================================

/**
 * Get a product by its ID
 */
export function getProductById(id: string): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

/**
 * Get a product by its database ID
 */
export function getProductByDatabaseId(databaseId: number): Product | undefined {
  return allProducts.find((product) => product.databaseId === databaseId);
}

/**
 * Get a product by its slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

/**
 * Get product card data by ID
 */
export function getProductCardById(id: string): ProductCardData | undefined {
  return allProductCards.find((product) => product.id === id);
}

// ============================================
// PRODUCT FILTERING
// ============================================

/**
 * Parse price string to number (e.g., "$79.99" -> 79.99)
 */
function parsePriceString(price: string): number {
  // Handle price ranges (e.g., "$34.99 - $89.99")
  const match = price.match(/\$?([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Filter products based on criteria
 */
export function filterProducts(
  products: ProductCardData[],
  filters: ProductFilters
): ProductCardData[] {
  return products.filter((product) => {
    // Category filter
    if (filters.category) {
      const hasCategory = product.productCategories.some(
        (cat) => cat.slug === filters.category
      );
      if (!hasCategory) return false;
    }

    // Brand filter
    if (filters.brand) {
      const hasBrand = product.productBrands.some(
        (brand) => brand.slug === filters.brand
      );
      if (!hasBrand) return false;
    }

    // Price range filter
    const productPrice = parsePriceString(product.price);
    if (filters.minPrice !== undefined && productPrice < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && productPrice > filters.maxPrice) {
      return false;
    }

    // On sale filter
    if (filters.onSale !== undefined && filters.onSale && !product.onSale) {
      return false;
    }

    // In stock filter
    if (filters.inStock !== undefined && filters.inStock) {
      if (product.stockStatus !== "IN_STOCK") return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const categoryMatch = product.productCategories.some((cat) =>
        cat.name.toLowerCase().includes(searchLower)
      );
      const brandMatch = product.productBrands.some((brand) =>
        brand.name.toLowerCase().includes(searchLower)
      );
      if (!nameMatch && !categoryMatch && !brandMatch) return false;
    }

    return true;
  });
}

// ============================================
// PRODUCT SORTING
// ============================================

/**
 * Sort products by specified option
 */
export function sortProducts(
  products: ProductCardData[],
  sortBy: ProductSortOption
): ProductCardData[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort(
        (a, b) => parsePriceString(a.price) - parsePriceString(b.price)
      );

    case "price-desc":
      return sorted.sort(
        (a, b) => parsePriceString(b.price) - parsePriceString(a.price)
      );

    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case "rating":
      return sorted.sort((a, b) => b.averageRating - a.averageRating);

    case "popularity":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);

    case "date-desc":
      // For mock data, we'll use the product ID as a proxy for date
      return sorted.sort((a, b) => b.databaseId - a.databaseId);

    case "default":
    default:
      // Featured first, then by review count
      return sorted.sort((a, b) => {
        // Primary sort: on sale items first
        if (a.onSale && !b.onSale) return -1;
        if (!a.onSale && b.onSale) return 1;
        // Secondary sort: by review count (popularity)
        return b.reviewCount - a.reviewCount;
      });
  }
}

// ============================================
// PAGINATED PRODUCTS
// ============================================

/**
 * Get paginated products with filtering and sorting
 */
export function getPaginatedProducts(
  options: {
    filters?: ProductFilters;
    sortBy?: ProductSortOption;
    page?: number;
    perPage?: number;
  } = {}
): PaginatedProducts {
  const {
    filters = {},
    sortBy = "default",
    page = 1,
    perPage = 12,
  } = options;

  // Apply filters
  let products = filterProducts(allProductCards, filters);

  // Apply sorting
  products = sortProducts(products, sortBy);

  // Calculate pagination
  const total = products.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Slice for current page
  const paginatedProducts = products.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    pageInfo: {
      total,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

// ============================================
// RELATED PRODUCTS
// ============================================

/**
 * Get related products based on categories and brands
 */
export function getRelatedProducts(
  productId: string,
  limit: number = 4
): ProductCardData[] {
  const product = getProductById(productId);
  if (!product) return [];

  const categorySlug = product.productCategories[0]?.slug;
  const brandSlug = product.productBrands[0]?.slug;

  // Find products in same category or brand, excluding current product
  const related = allProductCards.filter((p) => {
    if (p.id === productId) return false;

    const sameCategory = categorySlug
      ? p.productCategories.some((c) => c.slug === categorySlug)
      : false;
    const sameBrand = brandSlug
      ? p.productBrands.some((b) => b.slug === brandSlug)
      : false;

    return sameCategory || sameBrand;
  });

  // Sort by rating and return limited results
  return related
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
}

// ============================================
// SEARCH PRODUCTS
// ============================================

/**
 * Search products by query string
 */
export function searchProducts(
  query: string,
  limit: number = 10
): ProductCardData[] {
  if (!query.trim()) return [];

  const results = filterProducts(allProductCards, { search: query });
  return results.slice(0, limit);
}

// ============================================
// CATEGORY PRODUCTS
// ============================================

/**
 * Get products by category slug
 */
export function getProductsByCategory(
  categorySlug: string,
  options: {
    sortBy?: ProductSortOption;
    page?: number;
    perPage?: number;
  } = {}
): PaginatedProducts {
  return getPaginatedProducts({
    filters: { category: categorySlug },
    ...options,
  });
}

// ============================================
// BRAND PRODUCTS
// ============================================

/**
 * Get products by brand slug
 */
export function getProductsByBrand(
  brandSlug: string,
  options: {
    sortBy?: ProductSortOption;
    page?: number;
    perPage?: number;
  } = {}
): PaginatedProducts {
  return getPaginatedProducts({
    filters: { brand: brandSlug },
    ...options,
  });
}

// ============================================
// PRICE RANGE
// ============================================

/**
 * Get the min and max prices from a set of products
 */
export function getPriceRange(products: ProductCardData[] = allProductCards): {
  min: number;
  max: number;
} {
  if (products.length === 0) return { min: 0, max: 0 };

  const prices = products.map((p) => parsePriceString(p.price));
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}
