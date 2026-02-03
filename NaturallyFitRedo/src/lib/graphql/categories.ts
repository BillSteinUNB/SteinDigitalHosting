// WooCommerce GraphQL Categories
import { fetchGraphQL } from './client';
import { replaceWordPressBase } from '@/lib/config/wordpress';

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

// Category type definition
export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  description?: string;
  image?: {
    sourceUrl: string;
    altText: string;
  };
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
}

function transformCategory(wooCategory: WooCategory): CategoryWithCount {
  return {
    id: wooCategory.id,
    name: wooCategory.name,
    slug: wooCategory.slug,
    productCount: wooCategory.count || 0,
    description: wooCategory.description || undefined,
    image: wooCategory.image ? {
      sourceUrl: replaceWordPressBase(wooCategory.image.sourceUrl),
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
  const query = `
    query GetCategories {
      productCategories(first: 100) {
        nodes {
          ${CATEGORY_FIELDS}
        }
      }
    }
  `;

  const data = await fetchGraphQL<CategoriesResponse>(query);
  return data.productCategories.nodes.map(transformCategory);
}

// Fetch single category by slug
export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const query = `
    query GetCategory($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        ${CATEGORY_FIELDS}
      }
    }
  `;

  const data = await fetchGraphQL<{ productCategory: WooCategory | null }>(query, { slug });
  
  if (!data.productCategory) {
    return null;
  }

  return transformCategory(data.productCategory);
}

// Fetch featured/parent categories for homepage
export async function getFeaturedCategories(limit: number = 6): Promise<CategoryWithCount[]> {
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

  const data = await fetchGraphQL<CategoriesResponse>(query, { first: limit });
  return data.productCategories.nodes.map(transformCategory);
}
