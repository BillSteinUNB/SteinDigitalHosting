// WooCommerce GraphQL Categories
import { fetchGraphQL, shouldUseMockData } from './client';

interface WooCategory {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  count: number;
  image: {
    sourceUrl: string;
    altText: string;
  } | null;
  parent: {
    node: {
      id: string;
      name: string;
      slug: string;
    };
  } | null;
}

interface CategoriesResponse {
  productCategories: {
    nodes: WooCategory[];
  };
}

const CATEGORY_FIELDS = `
  id
  databaseId
  name
  slug
  description
  count
  image {
    sourceUrl
    altText
  }
  parent {
    node {
      id
      name
      slug
    }
  }
`;

// Re-export the type from mock to ensure compatibility
import type { CategoryWithCount } from '@/lib/mock/categories';
export type { CategoryWithCount };

function transformCategory(wooCategory: WooCategory): CategoryWithCount {
  return {
    id: wooCategory.id,
    name: wooCategory.name,
    slug: wooCategory.slug,
    productCount: wooCategory.count || 0,
    description: wooCategory.description || undefined,
    image: wooCategory.image ? {
      sourceUrl: wooCategory.image.sourceUrl,
      altText: wooCategory.image.altText || wooCategory.name,
    } : undefined,
    parent: wooCategory.parent?.node ? {
      id: wooCategory.parent.node.id,
      name: wooCategory.parent.node.name,
      slug: wooCategory.parent.node.slug,
    } : undefined,
  };
}

// Fetch all categories
export async function getCategories(): Promise<CategoryWithCount[]> {
  if (shouldUseMockData()) {
    const { categories } = await import('@/lib/mock/categories');
    return categories;
  }

  const query = `
    query GetCategories {
      productCategories(first: 100) {
        nodes {
          ${CATEGORY_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<CategoriesResponse>(query);
    return data.productCategories.nodes.map(transformCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    const { categories } = await import('@/lib/mock/categories');
    return categories;
  }
}

// Fetch single category by slug
export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  if (shouldUseMockData()) {
    const { getCategoryBySlug: getMockCategory } = await import('@/lib/mock/categories');
    return getMockCategory(slug) || null;
  }

  const query = `
    query GetCategory($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        ${CATEGORY_FIELDS}
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ productCategory: WooCategory | null }>(query, { slug });
    
    if (!data.productCategory) {
      return null;
    }

    return transformCategory(data.productCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    const { getCategoryBySlug: getMockCategory } = await import('@/lib/mock/categories');
    return getMockCategory(slug) || null;
  }
}

// Fetch featured/parent categories for homepage
export async function getFeaturedCategories(limit: number = 6): Promise<CategoryWithCount[]> {
  if (shouldUseMockData()) {
    const { featuredCategories } = await import('@/lib/mock/categories');
    return featuredCategories.slice(0, limit);
  }

  // Fetch parent categories (no parent = top level)
  const query = `
    query GetFeaturedCategories($first: Int!) {
      productCategories(first: $first, where: { parent: 0 }) {
        nodes {
          ${CATEGORY_FIELDS}
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<CategoriesResponse>(query, { first: limit });
    return data.productCategories.nodes.map(transformCategory);
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    const { featuredCategories } = await import('@/lib/mock/categories');
    return featuredCategories.slice(0, limit);
  }
}
