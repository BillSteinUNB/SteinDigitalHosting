// Homepage - Server Component with WordPress Banners + GraphQL

// GraphQL data fetching
import { getFeaturedProducts, getBestSellers } from "@/lib/graphql/products";
import { getFeaturedCategories } from "@/lib/graphql/categories";

// Banner fetching from WordPress
import { 
  getHeroSlides, 
  getMiniBanners, 
  getMediumBanner,
  getProductBanners,
  defaultHeroSlides,
  defaultMiniBanners,
  defaultMediumBanner,
  type Banner
} from "@/lib/wordpress/banners";

// Home components
import {
  Hero,
  CategoryGrid,
  ProductBannerCarousel,
  ThreeBannerRow,
  MediumBanner,
  CustomerReviews,
  Newsletter,
} from "@/components/home";

// Product components
import { ProductCarousel } from "@/components/product";

// Force dynamic rendering to fetch fresh data on each request
export const dynamic = 'force-dynamic';

// ============================================
// HOMEPAGE - Server Component
// ============================================

export default async function HomePage() {
  console.log('[Page] Starting banner fetch...');
  
  // Fetch banners from WordPress
  const [
    wpHeroSlides,
    wpMiniBanners,
    wpMediumBanner,
    wpProductBanners,
  ] = await Promise.all([
    getHeroSlides(),
    getMiniBanners(),
    getMediumBanner(),
    getProductBanners(),
  ]);
  
  console.log('[Page] Banners fetched:');
  console.log('  Hero slides:', wpHeroSlides.length);
  console.log('  Mini banners:', wpMiniBanners.length);
  console.log('  Medium banner:', wpMediumBanner ? 'yes' : 'no');
  console.log('  Product banners:', wpProductBanners.length);
  
  // Fetch data from WooCommerce GraphQL
  const [
    featuredProducts,
    bestSellers,
    featuredCategories,
  ] = await Promise.all([
    getFeaturedProducts(8),
    getBestSellers(8),
    getFeaturedCategories(5),
  ]);

  // Transform WordPress banners to component format
  const heroSlides = (wpHeroSlides.length > 0 ? wpHeroSlides : defaultHeroSlides).map(bannerToHeroSlide);
  const miniBanners = (wpMiniBanners.length > 0 ? wpMiniBanners : defaultMiniBanners).map(bannerToMiniBanner);
  const mediumBanner = wpMediumBanner ? bannerToMediumBanner(wpMediumBanner) : defaultMediumBanner;

  return (
    <>
      {/* Hero Carousel - Uses WordPress banners */}
      <Hero slides={heroSlides} />

      {/* Three Promotional Banners */}
      <ThreeBannerRow banners={miniBanners} />

      {/* Latest Deals Carousel */}
      <ProductCarousel
        title="Latest Deals"
        products={featuredProducts}
        viewAllLink="/shop?featured=true"
      />

      {/* Medium Banner */}
      <MediumBanner 
        image={mediumBanner.imageUrl}
        alt={mediumBanner.alt}
        link={mediumBanner.link}
      />

      {/* Shop by Category */}
      <CategoryGrid
        title="Popular Categories"
        categories={featuredCategories}
        columns={5}
      />

      {/* Recommended Products */}
      <ProductCarousel
        title="Recommended"
        products={bestSellers}
        viewAllLink="/shop?sort=popularity"
      />

      {/* Product Banners Carousel */}
      <ProductBannerCarousel
        title="Discover Products You'll Love"
        banners={wpProductBanners}
        viewAllLink="/shop"
      />

      {/* Customer Reviews */}
      <CustomerReviews title="What Customers Say" />

      {/* Newsletter */}
      <Newsletter
        title="Sign Up For Newsletter"
        description="Stay up to date with recent news, advice and weekly offers."
        variant="default"
      />
    </>
  );
}

// ============================================
// DATA TRANSFORMATION HELPERS
// ============================================

import type { HeroSlide } from "@/components/home/Hero";

function bannerToHeroSlide(banner: Banner | Omit<Banner, 'id' | 'type' | 'order'>): HeroSlide {
  return {
    id: 'id' in banner ? banner.id.toString() : banner.title,
    title: banner.title,
    subtitle: '',
    description: '',
    ctaText: 'Shop Now',
    ctaLink: banner.link,
    image: {
      src: banner.imageUrl,
      alt: banner.alt,
    },
    textPosition: 'center',
    overlay: true,
  };
}

function bannerToMiniBanner(banner: Banner | Omit<Banner, 'id' | 'type' | 'order'>) {
  return {
    image: banner.imageUrl,
    alt: banner.alt,
    link: banner.link,
  };
}

function bannerToMediumBanner(banner: Banner | Omit<Banner, 'id' | 'type' | 'order'>) {
  return {
    imageUrl: banner.imageUrl,
    alt: banner.alt,
    link: banner.link,
  };
}
