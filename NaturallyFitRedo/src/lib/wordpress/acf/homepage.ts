// ============================================
// Homepage Content Fetcher
// Fetches and transforms JSON fields from Pods
// ============================================

import { fetchPodsFieldsBySlug } from '@/lib/wordpress/rest/client';
import type {
  PodsHomepageContent,
  PodsHeroSlide,
  PodsMiniBanner,
  PodsMediumBanner,
  PodsBrandLogo,
  PodsCustomerReview,
  PodsNewsletterSection,
} from './types';
import { defaultHomepageContent } from './types';

// Pods field names - using JSON fields (simplest approach)
const PODS_FIELD_NAMES = {
  hero_slides: 'hero_slides_json',
  mini_banners: 'mini_banners_json',
  medium_banner: 'medium_banner_json',
  brand_logos: 'brand_logos_json',
  customer_reviews: 'customer_reviews_json',
  newsletter: 'newsletter_json',
};

// Type for raw JSON data
interface RawSlide {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  image?: unknown;
  text_position?: string;
  overlay?: boolean;
}

interface RawBanner {
  image?: unknown;
  link?: string;
}

interface RawBrand {
  name?: string;
  logo?: unknown;
  link?: string;
  description?: string;
}

interface RawReview {
  name?: string;
  rating?: number;
  text?: string;
  avatar?: unknown;
}

interface RawBrandLogosData {
  title?: string;
  brands?: RawBrand[];
}

interface RawReviewsData {
  title?: string;
  items?: RawReview[];
}

interface RawNewsletterData {
  title?: string;
  description?: string;
  placeholder?: string;
  button_text?: string;
}

/**
 * Safely parse JSON from Pods field
 */
function parseJSONField(field: unknown): unknown {
  if (!field) return null;
  
  // If already an object/array, return it
  if (typeof field === 'object') return field;
  
  // If it's a string, try to parse it
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      console.warn('Failed to parse JSON field:', field.substring(0, 100));
      return null;
    }
  }
  
  return null;
}

/**
 * Transform Pods image URL (could be full URL or attachment ID)
 */
function transformPodsImage(image: unknown): { url: string; alt: string } {
  if (!image) return { url: '', alt: '' };
  
  // If it's a string (direct URL)
  if (typeof image === 'string') {
    return { url: image, alt: '' };
  }
  
  // If it's an object with URL
  if (typeof image === 'object' && image !== null) {
    const img = image as { url?: string; guid?: string; alt?: string };
    return {
      url: img.url || img.guid || '',
      alt: img.alt || '',
    };
  }
  
  return { url: '', alt: '' };
}

/**
 * Transform hero slides from JSON
 */
function transformHeroSlides(rawData: unknown): PodsHeroSlide[] {
  const data = parseJSONField(rawData);
  if (!Array.isArray(data)) return [];
  
  return data
    .filter((slide): slide is RawSlide => slide && typeof slide === 'object')
    .map((slide, index) => ({
      id: slide.id?.toString() || `slide-${index}`,
      title: slide.title || '',
      subtitle: slide.subtitle,
      description: slide.description,
      cta_text: slide.cta_text || 'Shop Now',
      cta_link: slide.cta_link || '/shop',
      secondary_cta_text: slide.secondary_cta_text,
      secondary_cta_link: slide.secondary_cta_link,
      image: transformPodsImage(slide.image),
      text_position: (slide.text_position as 'left' | 'center' | 'right') || 'center',
      overlay: slide.overlay !== false,
    }))
    .filter((slide) => slide.image.url);
}

/**
 * Transform mini banners from JSON
 */
function transformMiniBanners(rawData: unknown): PodsMiniBanner[] {
  const data = parseJSONField(rawData);
  if (!Array.isArray(data)) return [];
  
  return data
    .filter((banner): banner is RawBanner => banner && typeof banner === 'object')
    .map((banner) => ({
      image: transformPodsImage(banner.image),
      link: banner.link || '/shop',
    }))
    .filter((banner) => banner.image.url);
}

/**
 * Transform medium banner from JSON
 */
function transformMediumBanner(rawData: unknown): PodsMediumBanner {
  const data = parseJSONField(rawData);
  if (!data || typeof data !== 'object') {
    return { image: { url: '', alt: '' }, link: '/shop' };
  }
  
  const banner = data as RawBanner;
  return {
    image: transformPodsImage(banner.image),
    link: banner.link || '/shop',
  };
}

/**
 * Transform brand logos from JSON
 */
function transformBrandLogos(rawData: unknown): { title: string; brands: PodsBrandLogo[] } {
  const data = parseJSONField(rawData);
  if (!data || typeof data !== 'object') {
    return { title: 'Discover Brands You\'ll Love', brands: [] };
  }
  
  const brandData = data as RawBrandLogosData;
  const brands = Array.isArray(brandData.brands) 
    ? brandData.brands
        .filter((brand): brand is RawBrand => brand && typeof brand === 'object')
        .map((brand) => ({
          name: brand.name || '',
          logo: transformPodsImage(brand.logo),
          link: brand.link || '/brands',
          description: brand.description,
        }))
        .filter((brand) => brand.logo.url)
    : [];
  
  return {
    title: brandData.title || 'Discover Brands You\'ll Love',
    brands,
  };
}

/**
 * Transform customer reviews from JSON
 */
function transformCustomerReviews(rawData: unknown): { title: string; items: PodsCustomerReview[] } {
  const data = parseJSONField(rawData);
  if (!data || typeof data !== 'object') {
    return { title: 'What Customers Say', items: [] };
  }
  
  const reviewsData = data as RawReviewsData;
  const items = Array.isArray(reviewsData.items) 
    ? reviewsData.items
        .filter((review): review is RawReview => review && typeof review === 'object')
        .map((review) => ({
          name: review.name || '',
          rating: Number(review.rating) || 5,
          text: review.text || '',
          avatar: review.avatar ? transformPodsImage(review.avatar) : undefined,
        }))
        .filter((review) => review.name && review.text)
    : [];
  
  return {
    title: reviewsData.title || 'What Customers Say',
    items,
  };
}

/**
 * Transform newsletter from JSON
 */
function transformNewsletter(rawData: unknown): PodsNewsletterSection {
  const data = parseJSONField(rawData);
  if (!data || typeof data !== 'object') {
    return defaultHomepageContent.newsletter;
  }
  
  const newsletterData = data as RawNewsletterData;
  return {
    title: newsletterData.title || 'Sign Up For Newsletter',
    description: newsletterData.description || 'Stay up to date with recent news, advice and weekly offers.',
    placeholder: newsletterData.placeholder || 'Enter your email address',
    button_text: newsletterData.button_text || 'Subscribe',
  };
}

/**
 * Fetch complete homepage content from WordPress Pods (JSON fields)
 * 
 * @param pageSlug - The slug of the page (default: 'homepage')
 * @returns Homepage content object with all sections
 */
export async function getHomepageContent(pageSlug: string = 'homepage'): Promise<PodsHomepageContent> {
  try {
    const podsData = await fetchPodsFieldsBySlug(pageSlug);
    
    // If no Pods data, return defaults
    if (!podsData || Object.keys(podsData).length === 0) {
      console.log('No Pods data found for homepage, using defaults');
      return defaultHomepageContent;
    }
    
    return {
      hero_slides: transformHeroSlides(podsData[PODS_FIELD_NAMES.hero_slides]),
      mini_banners: transformMiniBanners(podsData[PODS_FIELD_NAMES.mini_banners]),
      medium_banner: transformMediumBanner(podsData[PODS_FIELD_NAMES.medium_banner]),
      brand_logos: transformBrandLogos(podsData[PODS_FIELD_NAMES.brand_logos]),
      reviews: transformCustomerReviews(podsData[PODS_FIELD_NAMES.customer_reviews]),
      newsletter: transformNewsletter(podsData[PODS_FIELD_NAMES.newsletter]),
      product_showcases: [], // Can add later if needed
      seo: {},
    };
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return defaultHomepageContent;
  }
}

/**
 * Check if homepage content has valid data
 */
export function hasValidHomepageContent(content: PodsHomepageContent): boolean {
  return (
    content.hero_slides.length > 0 ||
    content.mini_banners.length > 0 ||
    content.medium_banner.image.url !== '' ||
    content.brand_logos.brands.length > 0
  );
}
