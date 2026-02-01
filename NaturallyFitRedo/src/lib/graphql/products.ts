// WooCommerce GraphQL Queries
import { fetchGraphQL, shouldUseMockData } from './client';
import type { ProductCardData, Product, SimpleProduct, VariableProduct, StockStatus } from '@/types/product';

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

// Convert WooCommerce product to ProductCardData
function transformToCardData(wooProduct: WooProduct): ProductCardData {
  return {
    id: wooProduct.id,
    databaseId: wooProduct.databaseId,
    slug: wooProduct.slug,
    name: wooProduct.name,
    image: wooProduct.image ? {
      sourceUrl: wooProduct.image.sourceUrl,
      altText: wooProduct.image.altText || wooProduct.name,
    } : undefined,
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
  };
}

// Convert WooCommerce product to full Product type
function transformToProduct(wooProduct: WooProduct): Product {
  const baseProduct = {
    id: wooProduct.id,
    databaseId: wooProduct.databaseId,
    slug: wooProduct.slug,
    name: wooProduct.name,
    image: wooProduct.image ? {
      sourceUrl: wooProduct.image.sourceUrl,
      altText: wooProduct.image.altText || wooProduct.name,
    } : undefined,
    galleryImages: wooProduct.galleryImages?.nodes.map(img => ({
      sourceUrl: img.sourceUrl,
      altText: img.altText || wooProduct.name,
    })) || [],
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
    } as VariableProduct;
  }

  return {
    ...baseProduct,
    type: 'SIMPLE',
    price: wooProduct.price || '$0.00',
    regularPrice: wooProduct.regularPrice || '$0.00',
    salePrice: wooProduct.salePrice || undefined,
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
  if (shouldUseMockData()) {
    const { allProductCards } = await import('@/lib/mock/products');
    return {
      products: allProductCards.slice(0, first),
      hasNextPage: false,
      endCursor: null,
    };
  }

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

  try {
    const data = await fetchGraphQL<ProductsResponse>(query, { first, after });

    return {
      products: data.products.nodes.map(transformToCardData),
      hasNextPage: data.products.pageInfo.hasNextPage,
      endCursor: data.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data on error
    const { allProductCards } = await import('@/lib/mock/products');
    return {
      products: allProductCards.slice(0, first),
      hasNextPage: false,
      endCursor: null,
    };
  }
}

// Fetch single product by slug
export async function getProductBySlugGraphQL(slug: string): Promise<Product | null> {
  if (shouldUseMockData()) {
    const { getProductBySlug } = await import('@/lib/mock');
    return getProductBySlug(slug) || null;
  }

  const query = `
    query GetProduct($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        ${FULL_PRODUCT_FIELDS}
      }
    }
  `;

  try {
    const data = await fetchGraphQL<SingleProductResponse>(query, { slug });
    
    if (!data.product) {
      return null;
    }

    return transformToProduct(data.product);
  } catch (error) {
    console.error('Error fetching product:', error);
    const { getProductBySlug } = await import('@/lib/mock');
    return getProductBySlug(slug) || null;
  }
}

// Fetch featured products
export async function getFeaturedProducts(limit: number = 8): Promise<ProductCardData[]> {
  if (shouldUseMockData()) {
    const { featuredProducts } = await import('@/lib/mock/products');
    return featuredProducts.slice(0, limit);
  }

  const query = `
    query GetFeaturedProducts($first: Int!) {
      products(first: $first, where: { featured: true }) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<ProductsResponse>(query, { first: limit });
    return data.products.nodes.map(transformToCardData);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    const { featuredProducts } = await import('@/lib/mock/products');
    return featuredProducts.slice(0, limit);
  }
}

// Fetch sale products
export async function getSaleProducts(limit: number = 8): Promise<ProductCardData[]> {
  if (shouldUseMockData()) {
    const { saleProducts } = await import('@/lib/mock/products');
    return saleProducts.slice(0, limit);
  }

  const query = `
    query GetSaleProducts($first: Int!) {
      products(first: $first, where: { onSale: true }) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<ProductsResponse>(query, { first: limit });
    return data.products.nodes.map(transformToCardData);
  } catch (error) {
    console.error('Error fetching sale products:', error);
    const { saleProducts } = await import('@/lib/mock/products');
    return saleProducts.slice(0, limit);
  }
}

// Fetch best sellers
export async function getBestSellers(limit: number = 8): Promise<ProductCardData[]> {
  if (shouldUseMockData()) {
    const { bestSellers } = await import('@/lib/mock/products');
    return bestSellers.slice(0, limit);
  }

  // WooGraphQL may not support sorting by total_sales, so we fetch recent products as fallback
  const query = `
    query GetBestSellers($first: Int!) {
      products(first: $first) {
        nodes {
          ${PRODUCT_CARD_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<ProductsResponse>(query, { first: limit });
    return data.products.nodes.map(transformToCardData);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    const { bestSellers } = await import('@/lib/mock/products');
    return bestSellers.slice(0, limit);
  }
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
  if (shouldUseMockData()) {
    const { getPaginatedProducts } = await import('@/lib/mock');
    return getPaginatedProducts({ filters, sortBy, page, perPage });
  }

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

  // Calculate pagination
  const first = perPage;
  const skip = (page - 1) * perPage;

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

  const query = `
    query GetPaginatedProducts($first: Int!, $skip: Int) {
      products(first: $first, skip: $skip${whereClause}${orderbyClause}) {
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

  try {
    const data = await fetchGraphQL<ProductsResponse>(query, { first, skip });
    
    const products = data.products.nodes.map(transformToCardData);
    const total = products.length; // Note: WooGraphQL doesn't return total count easily
    const totalPages = data.products.pageInfo.hasNextPage ? page + 1 : page;

    return {
      products,
      pageInfo: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: data.products.pageInfo.hasNextPage,
        hasPreviousPage: data.products.pageInfo.hasPreviousPage,
      },
    };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    // Fallback to mock data
    const { getPaginatedProducts } = await import('@/lib/mock');
    return getPaginatedProducts({ filters, sortBy, page, perPage });
  }
}
