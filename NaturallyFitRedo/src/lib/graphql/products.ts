// WooCommerce GraphQL Queries
import { fetchGraphQL } from './client';
import type { ProductCardData, Product, SimpleProduct, VariableProduct, StockStatus } from '@/types/product';
import { replaceWordPressBase } from '@/lib/config/wordpress';
import { formatPrice } from "@/lib/utils";
import { WHOLESALEX_PRICE_META } from "@/lib/wholesalex/integration";
import { getAllowedCategoryLabel, isAllowedCategorySlug } from "@/lib/shop-categories";
import { getWooBrandBySlug, getWooBrandProductSlugs } from "@/lib/woocommerce/brands";

// GraphQL response types
interface WooProductNode {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  sku: string | null;
  onSale: boolean;
  averageRating: number;
  reviewCount: number;
  image: {
    sourceUrl: string;
    altText: string;
  } | null;
  galleryImages: {
    nodes: Array<{
      sourceUrl: string;
      altText: string;
    }>;
  };
  productCategories: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  metaData?: Array<{
    key: string;
    value: unknown;
  }>;
}

interface SimpleProductNode extends WooProductNode {
  __typename: 'SimpleProduct';
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: string;
  stockQuantity: number | null;
}

interface VariableProductNode extends WooProductNode {
  __typename: 'VariableProduct';
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  stockStatus: string;
  stockQuantity: number | null;
  variations: {
    nodes: Array<{
      id: string;
      databaseId: number;
      name: string;
      price: string | null;
      regularPrice: string | null;
      salePrice: string | null;
      stockStatus: string;
      metaData?: Array<{
        key: string;
        value: unknown;
      }>;
      attributes: {
        nodes: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  attributes: {
    nodes: Array<{
      name: string;
      options: string[];
    }>;
  };
}

type WooProduct = SimpleProductNode | VariableProductNode;

interface ProductsResponse {
  products: {
    nodes: WooProduct[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string | null;
      startCursor: string | null;
    };
  };
}

interface SingleProductResponse {
  product: WooProduct | null;
}

// Query fragments
const PRODUCT_CARD_FIELDS = `
  id
  databaseId
  name
  slug
  onSale
  averageRating
  reviewCount
  image {
    sourceUrl
    altText
  }
  productCategories {
    nodes {
      name
      slug
    }
  }
  metaData {
    key
    value
  }
  ... on SimpleProduct {
    price
    regularPrice
    salePrice
    stockStatus
  }
  ... on VariableProduct {
    price
    regularPrice
    salePrice
    stockStatus
  }
`;

const FULL_PRODUCT_FIELDS = `
  id
  databaseId
  name
  slug
  description
  shortDescription
  sku
  onSale
  averageRating
  reviewCount
  image {
    sourceUrl
    altText
  }
  galleryImages {
    nodes {
      sourceUrl
      altText
    }
  }
  productCategories {
    nodes {
      id
      name
      slug
    }
  }
  metaData {
    key
    value
  }
  ... on SimpleProduct {
    price
    regularPrice
    salePrice
    stockStatus
    stockQuantity
  }
  ... on VariableProduct {
    price
    regularPrice
    salePrice
    stockStatus
    stockQuantity
    variations(first: 100) {
      nodes {
        id
        databaseId
        name
        price
        regularPrice
        salePrice
        stockStatus
        metaData {
          key
          value
        }
        attributes {
          nodes {
            name
            value
          }
        }
      }
    }
    attributes {
      nodes {
        name
        options
      }
    }
  }
`;

// Helper to convert stock status
function convertStockStatus(status: string): StockStatus {
  switch (status) {
    case 'IN_STOCK':
      return 'IN_STOCK';
    case 'OUT_OF_STOCK':
      return 'OUT_OF_STOCK';
    case 'ON_BACKORDER':
      return 'ON_BACKORDER';
    default:
      return 'OUT_OF_STOCK';
  }
}

// Default placeholder for products without images
const DEFAULT_PLACEHOLDER = 'https://placehold.co/600x600/1a1a2e/ffffff?text=No+Image';

// Transform image URL from old domain to new domain
function transformImageUrl(url: string | null | undefined): string {
  if (!url) return DEFAULT_PLACEHOLDER;

  return replaceWordPressBase(url);
}

function extractMetaValue(
  metaData: Array<{ key: string; value: unknown }> | undefined,
  key: string
): string | undefined {
  if (!metaData?.length) return undefined;
  const match = metaData.find((item) => item.key === key);
  if (!match) return undefined;
  const raw = match.value;
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw === "string" || typeof raw === "number") {
    return String(raw);
  }
  return undefined;
}

function parseWholesaleMetaPrice(
  metaData: Array<{ key: string; value: unknown }> | undefined
): string | undefined {
  const rawValue = extractMetaValue(metaData, WHOLESALEX_PRICE_META);
  if (!rawValue) return undefined;
  const parsed = parsePriceNumber(rawValue);
  if (Number.isNaN(parsed)) return undefined;
  return formatPrice(parsed);
}

function parsePriceNumber(value: unknown): number {
  const parsed = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isNaN(parsed) ? NaN : parsed;
}

async function getBrandSlugSet(brandSlug: string): Promise<Set<string>> {
  const brand = await getWooBrandBySlug(brandSlug);
  if (!brand) {
    return new Set<string>();
  }

  const slugs = await getWooBrandProductSlugs(brand.id);
  return new Set(slugs);
}

function matchesAllowedCategories(
  categories: Array<{ slug: string; name: string }>
): boolean {
  if (!categories.length) {
    return false;
  }

  return categories.some((category) => {
    return (
      isAllowedCategorySlug(category.slug) ||
      Boolean(getAllowedCategoryLabel(category.name))
    );
  });
}

// Convert WooCommerce product to ProductCardData
function transformToCardData(wooProduct: WooProduct): ProductCardData {
  // Use WordPress image if available, transform URL, otherwise use placeholder
  const imageUrl = transformImageUrl(wooProduct.image?.sourceUrl);
  const wholesalePrice = parseWholesaleMetaPrice(wooProduct.metaData);
  
  return {
    id: wooProduct.id,
    databaseId: wooProduct.databaseId,
    slug: wooProduct.slug,
    name: wooProduct.name,
    image: {
      sourceUrl: imageUrl,
      altText: wooProduct.image?.altText || wooProduct.name,
    },
    price: wooProduct.price || '$0.00',
    regularPrice: wooProduct.regularPrice || '$0.00',
    salePrice: wooProduct.salePrice || undefined,
    averageRating: wooProduct.averageRating || 0,
    reviewCount: wooProduct.reviewCount || 0,
    productCategories: wooProduct.productCategories.nodes.map(cat => ({
      name: cat.name,
      slug: cat.slug,
    })),
    productBrands: [], // WooCommerce doesn't have brands by default
    onSale: wooProduct.onSale,
    stockStatus: convertStockStatus(wooProduct.stockStatus || 'OUT_OF_STOCK'),
    wholesalePrice,
  };
}

// Convert WooCommerce product to full Product type
function transformToProduct(wooProduct: WooProduct): Product {
  // Use WordPress image if available, transform URL, otherwise use placeholder
  const imageUrl = transformImageUrl(wooProduct.image?.sourceUrl);
  
  // Process gallery images
  const galleryImages = wooProduct.galleryImages?.nodes.map(img => ({
    sourceUrl: transformImageUrl(img.sourceUrl),
    altText: img.altText || wooProduct.name,
  })) || [];
  
  const baseProduct = {
    id: wooProduct.id,
    databaseId: wooProduct.databaseId,
    slug: wooProduct.slug,
    name: wooProduct.name,
    image: {
      sourceUrl: imageUrl,
      altText: wooProduct.image?.altText || wooProduct.name,
    },
    galleryImages: galleryImages.length > 0 ? galleryImages : [{
      sourceUrl: imageUrl,
      altText: wooProduct.name,
    }],
    description: wooProduct.description || '',
    shortDescription: wooProduct.shortDescription || '',
    sku: wooProduct.sku || '',
    stockStatus: convertStockStatus(wooProduct.stockStatus || 'OUT_OF_STOCK'),
    stockQuantity: wooProduct.stockQuantity || 0,
    averageRating: wooProduct.averageRating || 0,
    reviewCount: wooProduct.reviewCount || 0,
    productCategories: wooProduct.productCategories.nodes.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    productBrands: [],
    featured: false,
    onSale: wooProduct.onSale,
  };

  if (wooProduct.__typename === 'VariableProduct') {
    const variableProduct = wooProduct as VariableProductNode;
    const variationWholesaleValues = variableProduct.variations?.nodes
      .map((variation) => {
        const rawValue = extractMetaValue(variation.metaData, WHOLESALEX_PRICE_META);
        const parsed = rawValue ? parsePriceNumber(rawValue) : NaN;
        return Number.isNaN(parsed) ? undefined : parsed;
      })
      .filter((value): value is number => typeof value === "number");

    const wholesalePriceRange =
      variationWholesaleValues && variationWholesaleValues.length > 0
        ? {
            min: formatPrice(Math.min(...variationWholesaleValues)),
            max: formatPrice(Math.max(...variationWholesaleValues)),
          }
        : undefined;

    return {
      ...baseProduct,
      type: 'VARIABLE',
      price: variableProduct.price || '$0.00',
      regularPrice: variableProduct.regularPrice || '$0.00',
      salePrice: variableProduct.salePrice || undefined,
      variations: variableProduct.variations?.nodes.map(v => ({
        id: v.id,
        databaseId: v.databaseId,
        name: v.name,
        price: v.price || '$0.00',
        regularPrice: v.regularPrice || '$0.00',
        salePrice: v.salePrice || undefined,
        wholesalePrice: parseWholesaleMetaPrice(v.metaData),
        stockStatus: convertStockStatus(v.stockStatus || 'OUT_OF_STOCK'),
        attributes: v.attributes.nodes.map(a => ({
          name: a.name,
          value: a.value,
        })),
      })) || [],
      attributes: variableProduct.attributes?.nodes.map(a => ({
        name: a.name,
        options: a.options,
        variation: true,
      })) || [],
      wholesalePriceRange,
    } as VariableProduct;
  }

  return {
    ...baseProduct,
    type: 'SIMPLE',
    price: wooProduct.price || '$0.00',
    regularPrice: wooProduct.regularPrice || '$0.00',
    salePrice: wooProduct.salePrice || undefined,
    wholesalePrice: parseWholesaleMetaPrice(wooProduct.metaData),
  } as SimpleProduct;
}

// ============================================
// FETCH FUNCTIONS
// ============================================

// Fetch products for shop page
export async function getProducts(
  first: number = 20,
  after?: string,
  categorySlug?: string
): Promise<{ products: ProductCardData[]; hasNextPage: boolean; endCursor: string | null }> {
  const whereClause = categorySlug ? `, where: { category: "${categorySlug}" }` : '';
  
  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after${whereClause}) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await fetchGraphQL<ProductsResponse>(query, { first, after });

  return {
    products: data.products.nodes.map(transformToCardData),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

// Fetch single product by slug
export async function getProductBySlugGraphQL(slug: string): Promise<Product | null> {
  const query = `
    query GetProduct($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        ${FULL_PRODUCT_FIELDS}
      }
    }
  `;

  const data = await fetchGraphQL<SingleProductResponse>(query, { slug });
  
  if (!data.product) {
    return null;
  }

  return transformToProduct(data.product);
}

// Fetch featured products
export async function getFeaturedProducts(limit: number = 8): Promise<ProductCardData[]> {
  const query = `
    query GetFeaturedProducts($first: Int!) {
      products(first: $first, where: { featured: true }) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  const data = await fetchGraphQL<ProductsResponse>(query, { first: limit });
  return data.products.nodes.map(transformToCardData);
}

// Fetch sale products
export async function getSaleProducts(limit: number = 8): Promise<ProductCardData[]> {
  const query = `
    query GetSaleProducts($first: Int!) {
      products(first: $first, where: { onSale: true }) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  const data = await fetchGraphQL<ProductsResponse>(query, { first: limit });
  return data.products.nodes.map(transformToCardData);
}

// Fetch best sellers
export async function getBestSellers(limit: number = 8): Promise<ProductCardData[]> {
  // WooGraphQL may not support sorting by total_sales, so we fetch recent products
  const query = `
    query GetBestSellers($first: Int!) {
      products(first: $first) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  const data = await fetchGraphQL<ProductsResponse>(query, { first: limit });
  return data.products.nodes.map(transformToCardData);
}

// Import types for paginated function
import type { ProductFilters, ProductSortOption, PaginatedProducts } from '@/types/product';

// Fetch paginated products with filters and sorting (for shop page)
export async function getPaginatedProductsGraphQL(
  filters: ProductFilters = {},
  sortBy: ProductSortOption = 'default',
  page: number = 1,
  perPage: number = 12
): Promise<PaginatedProducts> {
  // Build where clause based on filters
  const whereConditions: string[] = [];
  
  if (filters.category) {
    whereConditions.push(`category: "${filters.category}"`);
  }
  
  if (filters.onSale) {
    whereConditions.push('onSale: true');
  }
  
  if (filters.search) {
    whereConditions.push(`search: "${filters.search}"`);
  }

  const whereClause = whereConditions.length > 0 
    ? `, where: { ${whereConditions.join(', ')} }` 
    : '';

  // Build orderby clause
  let orderbyClause = '';
  switch (sortBy) {
    case 'price-asc':
      orderbyClause = ', orderby: { field: PRICE, order: ASC }';
      break;
    case 'price-desc':
      orderbyClause = ', orderby: { field: PRICE, order: DESC }';
      break;
    case 'name-asc':
      orderbyClause = ', orderby: { field: TITLE, order: ASC }';
      break;
    case 'name-desc':
      orderbyClause = ', orderby: { field: TITLE, order: DESC }';
      break;
    case 'date-desc':
      orderbyClause = ', orderby: { field: DATE, order: DESC }';
      break;
    default:
      // Default sorting (no specific order)
      break;
  }

  // WooGraphQL doesn't support "skip" - we need to fetch more products to cover the page
  // For small catalogs, fetch all; for larger ones, we'll need cursor-based pagination
  const first = page * perPage; // Fetch enough to cover up to current page

  const query = `
    query GetPaginatedProducts($first: Int!) {
      products(first: $first${whereClause}${orderbyClause}) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  `;

  const [data, brandSlugSet] = await Promise.all([
    fetchGraphQL<ProductsResponse>(query, { first }),
    filters.brand ? getBrandSlugSet(filters.brand) : Promise.resolve(null),
  ]);
  
  const allProducts = data.products.nodes
    .filter((product) => matchesAllowedCategories(product.productCategories.nodes))
    .filter((product) => {
      if (!filters.brand || !brandSlugSet) {
        return true;
      }
      return brandSlugSet.has(product.slug);
    })
    .map(transformToCardData);
  
  // Apply client-side pagination since WooGraphQL doesn't support skip
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);
  
  const total = allProducts.length;
  const totalPages = Math.ceil(total / perPage);

  return {
    products: paginatedProducts,
    pageInfo: {
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
