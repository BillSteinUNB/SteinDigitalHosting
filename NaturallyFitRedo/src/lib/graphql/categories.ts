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

function applyParentCounts(categories: CategoryWithCount[]): CategoryWithCount[] {
  const childrenByParent = new Map<string, CategoryWithCount[]>();

  for (const category of categories) {
    if (category.parent) {
      const list = childrenByParent.get(category.parent.slug) || [];
      list.push(category);
      childrenByParent.set(category.parent.slug, list);
    }
  }

  return categories.map((category) => {
    if (category.parent) {
      return category;
    }

    const children = childrenByParent.get(category.slug);
    if (!children || children.length === 0) {
      return category;
    }

    const summedCount = children.reduce(
      (total, child) => total + (child.productCount || 0),
      0
    );

    if (category.productCount === 0 && summedCount > 0) {
      return { ...category, productCount: summedCount };
    }

    return category;
  });
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
  const categories = data.productCategories.nodes.map(transformCategory);
  return applyParentCounts(categories);
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

export function getCategoryScopeSlugs(
  categories: CategoryWithCount[],
  rootSlug: string
): string[] {
  if (!rootSlug) return [];

  const byParent = new Map<string, CategoryWithCount[]>();

  for (const category of categories) {
    const parentSlug = category.parent?.slug;
    if (!parentSlug) continue;

    const siblings = byParent.get(parentSlug) || [];
    siblings.push(category);
    byParent.set(parentSlug, siblings);
  }

  const scope = new Set<string>([rootSlug]);
  const queue = [rootSlug];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    const children = byParent.get(current) || [];
    for (const child of children) {
      if (scope.has(child.slug)) continue;
      scope.add(child.slug);
      queue.push(child.slug);
    }
  }

  return Array.from(scope);
}
