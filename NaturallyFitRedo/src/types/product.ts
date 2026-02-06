// ============================================
// PRODUCT TYPES
// ============================================

export interface ProductImage {
  sourceUrl: string;
  altText: string;
  id?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image?: ProductImage;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logo?: ProductImage;
}

export interface ProductVariation {
  id: string;
  databaseId: number;
  name: string;
  price: string;
  regularPrice: string;
  salePrice?: string;
  wholesalePrice?: string;
  stockStatus: StockStatus;
  stockQuantity?: number;
  attributes: VariationAttribute[];
  image?: ProductImage;
}

export interface VariationAttribute {
  name: string;
  value: string;
}

export interface ProductAttribute {
  name: string;
  options: string[];
  variation: boolean;
}

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";

export type ProductType = "SIMPLE" | "VARIABLE" | "GROUPED" | "EXTERNAL";

// Base product interface
export interface ProductBase {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  type: ProductType;
  image?: ProductImage;
  galleryImages?: ProductImage[];
  description?: string;
  shortDescription?: string;
  sku?: string;
  stockStatus: StockStatus;
  stockQuantity?: number;
  averageRating: number;
  reviewCount: number;
  productCategories: ProductCategory[];
  productBrands: ProductBrand[];
  featured: boolean;
  onSale: boolean;
  dateOnSaleFrom?: string;
  dateOnSaleTo?: string;
}

// Simple product
export interface SimpleProduct extends ProductBase {
  type: "SIMPLE";
  price: string;
  regularPrice: string;
  salePrice?: string;
  wholesalePrice?: string;
}

// Variable product
export interface VariableProduct extends ProductBase {
  type: "VARIABLE";
  price: string; // Price range as string (e.g., "$29.99 - $49.99")
  regularPrice: string;
  salePrice?: string;
  variations: ProductVariation[];
  attributes: ProductAttribute[];
  wholesalePriceRange?: {
    min: string;
    max: string;
  };
}

// Union type for all product types
export type Product = SimpleProduct | VariableProduct;

// Product card data (minimal data needed for cards)
export interface ProductCardData {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  image?: ProductImage;
  price: string;
  regularPrice: string;
  salePrice?: string;
  wholesalePrice?: string;
  averageRating: number;
  reviewCount: number;
  productCategories: Pick<ProductCategory, "name" | "slug">[];
  productBrands: Pick<ProductBrand, "name" | "slug">[];
  onSale: boolean;
  stockStatus: StockStatus;
}

// Product filters
export interface ProductFilters {
  category?: string;
  categorySlugs?: string[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  onSale?: boolean;
  inStock?: boolean;
}

// Product sorting
export type ProductSortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "date-desc"
  | "popularity"
  | "rating";

// Paginated products response
export interface PaginatedProducts {
  products: ProductCardData[];
  pageInfo: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
