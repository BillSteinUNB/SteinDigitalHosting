import { getWordPressBaseUrl } from "@/lib/config/wordpress";

import { getWordPressBaseUrl } from "@/lib/config/wordpress";

export interface WooBrand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}


const BRAND_ENDPOINT = "/wp-json/wp/v2/product_brand";
const PRODUCT_ENDPOINT = "/wp-json/wp/v2/product";
const PER_PAGE = 100;

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const baseUrl = getWordPressBaseUrl();
  const url = new URL(path, baseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
}

async function fetchPaged<T>(
  path: string,
  query: Record<string, QueryValue>
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (true) {
    const url = buildUrl(path, { ...query, per_page: PER_PAGE, page });
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 400) {
        break;
      }
      throw new Error(`Failed to fetch ${path} (${response.status})`);
    }

    const data = (await response.json()) as T[];
    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    results.push(...data);

    if (data.length < PER_PAGE) {
      break;
    }

    page += 1;
  }

  return results;
}


export async function getWooBrands(): Promise<WooBrand[]> {
  const brands = await fetchPaged<WooBrand>(BRAND_ENDPOINT, {
    orderby: "name",
    order: "asc",
  });

  return [...brands].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getWooBrandMap(): Promise<Map<number, WooBrand>> {
  const brands = await getWooBrands();
  return new Map(brands.map((brand) => [brand.id, brand]));
}

export async function getWooBrandBySlug(slug: string): Promise<WooBrand | undefined> {
  const url = buildUrl(BRAND_ENDPOINT, { slug, per_page: 1 });
  const response = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as WooBrand[];
  return Array.isArray(data) ? data[0] : undefined;
}

export async function getWooBrandProductSlugs(brandId: number): Promise<string[]> {
  const products = await fetchPaged<{ slug?: string }>(PRODUCT_ENDPOINT, {
    product_brand: brandId,
    status: "publish",
    _fields: "slug",
  });

  return products
    .map((product) => product.slug)
    .filter((slug): slug is string => Boolean(slug));
}
