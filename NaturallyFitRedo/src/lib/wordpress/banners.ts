// ============================================
// Banners Fetcher - WordPress Custom Post Type
// Fetches banners from "banners" post type
// ============================================

import { fetchREST } from './rest/client';

// Banner types matching WordPress categories (your actual slugs)
export type BannerType = 'hero-slides' | 'mini-banner-1' | 'mini-banner-2' | 'mini-banner-3' | 'mini-banner-4';

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
  alt: string;
  type: BannerType;
  order: number;
}

/**
 * Fetch all published banners from WordPress
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    // Fetch from custom post type "banners" with embedded terms
    const response = await fetchREST<Array<{
      id: number;
      title: { rendered: string };
      link: string;
      _embedded?: {
        'wp:featuredmedia'?: Array<{
          source_url: string;
          alt_text: string;
        }>;
        'wp:term'?: Array<Array<{
          id: number;
          slug: string;
          name: string;
        }>>;
      };
      meta?: {
        banner_link?: string;
      };
      menu_order: number;
    }>>('/banners', {
      _embed: 'wp:term,wp:featuredmedia',
      per_page: 20,
      orderby: 'menu_order',
      order: 'asc',
      status: 'publish',
    });

    return response.map((banner) => {
      const featuredImage = banner._embedded?.['wp:featuredmedia']?.[0];
      
      // Extract banner type slug from embedded terms
      // wp:term is an array of arrays, we need to find the banner_type taxonomy
      let bannerType: string = '';
      const terms = banner._embedded?.['wp:term'];
      if (terms && Array.isArray(terms)) {
        for (const termGroup of terms) {
          if (Array.isArray(termGroup) && termGroup.length > 0) {
            // Check if this is the banner_type taxonomy by looking at the first term
            const firstTerm = termGroup[0];
            if (firstTerm && firstTerm.slug) {
              // This is a banner_type term
              bannerType = firstTerm.slug;
              break;
            }
          }
        }
      }
      
      return {
        id: banner.id,
        title: banner.title.rendered,
        imageUrl: featuredImage?.source_url || '',
        link: banner.meta?.banner_link || '/shop',
        alt: featuredImage?.alt_text || banner.title.rendered,
        type: (bannerType as BannerType) || 'hero-slides',
        order: banner.menu_order || 0,
      };
    }).filter(banner => banner.imageUrl); // Only return banners with images

  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return [];
  }
}

/**
 * Get banners by type
 */
export async function getBannersByType(type: BannerType): Promise<Banner[]> {
  const allBanners = await getBanners();
  return allBanners
    .filter(banner => banner.type === type)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get hero slides (multiple hero banners)
 */
export async function getHeroSlides(): Promise<Banner[]> {
  return getBannersByType('hero-slides');
}

/**
 * Get mini banners (3 banners)
 */
export async function getMiniBanners(): Promise<Banner[]> {
  const types: BannerType[] = ['mini-banner-1', 'mini-banner-2', 'mini-banner-3'];
  const allBanners = await getBanners();
  
  return types
    .map(type => allBanners.find(b => b.type === type))
    .filter((b): b is Banner => b !== undefined);
}

/**
 * Get medium banner (mini-banner-4)
 */
export async function getMediumBanner(): Promise<Banner | null> {
  const banners = await getBannersByType('mini-banner-4');
  return banners[0] || null;
}

// Default banner as fallback - MAMMOTH ONLY (for testing)
export const defaultHeroSlides: Omit<Banner, 'id' | 'type' | 'order'>[] = [
  {
    title: 'Mammoth Supplements',
    imageUrl: 'https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Mammoth-Slider-1.png',
    link: '/brands/mammoth',
    alt: 'Mammoth Supplements',
  },
];

export const defaultMiniBanners: Omit<Banner, 'id' | 'type' | 'order'>[] = [
  {
    title: '3 for $99',
    imageUrl: 'https://nftest.dreamhosters.com/wp-content/uploads/2026/02/NF_3_for_99-2026.png',
    link: '/product/mix-and-match-for-99/',
    alt: 'Bundles 3 for $99',
  },
  {
    title: 'Beat Any Price',
    imageUrl: 'https://nftest.dreamhosters.com/wp-content/uploads/2026/02/shipping-2.png',
    link: '/price-guarantee/',
    alt: 'Beat ANY Price by 10%',
  },
  {
    title: 'Free Shipping',
    imageUrl: 'https://nftest.dreamhosters.com/wp-content/uploads/2026/02/shipping.png',
    link: '/shop/',
    alt: 'Free Shipping / Free Hoodie / Free Shaker',
  },
];

export const defaultMediumBanner: Omit<Banner, 'id' | 'type' | 'order'> = {
  title: 'Best Creatine Prices',
  imageUrl: 'https://nftest.dreamhosters.com/wp-content/uploads/2026/02/BEST-CREATINE-PRICES-1.png',
  link: '/shop/creatine',
  alt: 'Best Creatine Prices',
};
