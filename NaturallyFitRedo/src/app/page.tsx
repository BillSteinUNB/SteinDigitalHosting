// Homepage - Server Component with GraphQL data fetching

import Image from "next/image";

// GraphQL data fetching
import { getFeaturedProducts, getBestSellers } from "@/lib/graphql/products";
import { getFeaturedCategories } from "@/lib/graphql/categories";

// Mock data (brands with proper images)
import { featuredBrands } from "@/lib/mock/brands";

// Home components
import {
  Hero,
  CategoryGrid,
  BrandLogos,
  ThreeBannerRow,
  CustomerReviews,
  Newsletter,
} from "@/components/home";

// Product components
import { ProductCarousel } from "@/components/product";

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================
const WP_IMAGES = {
  // Three Banner Row (Tab 1 style)
  bundle3for99: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/NF_3_for_99-2026.png",
  beatAnyPrice: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/shipping-2.png",
  freeShipping: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/shipping.png",
  // Promo banners
  promo3for99: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/NF_3_for_99-2026.png",
  bestCreatine: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/BEST-CREATINE-PRICES-1.png",
  // Shipping icons
  shipping1: "https://naturallyfit.ca/wp-content/uploads/2025/04/shipping.png",
  shipping2: "https://naturallyfit.ca/wp-content/uploads/2025/02/shipping-2.png",
  // Featured products showcase
  creatineGummies: "https://naturallyfit.ca/wp-content/uploads/2026/01/Creatine_Gummies_Orange_Vibe_120ct_Render_ca13f6cc-00aa-4c70-8525-8599d9b65243.webp",
  shaker: "https://naturallyfit.ca/wp-content/uploads/2026/01/WhiteShaker1.webp",
  proteinBar: "https://naturallyfit.ca/wp-content/uploads/2025/12/PHD_CHOCORASP_UNIT.webp",
  energyDrink: "https://naturallyfit.ca/wp-content/uploads/2026/01/LemonIcedTea_nEW.webp",
};

// ============================================
// HOMEPAGE - Server Component
// ============================================

export default async function HomePage() {
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

  return (
    <>
      {/* Hero Carousel */}
      <Hero />

      {/* Three Promotional Banners (Tab 1 style) */}
      <ThreeBannerRow
        banners={[
          {
            image: WP_IMAGES.bundle3for99,
            alt: "Bundles 3 for $99",
            link: "/product/mix-and-match-for-99/",
          },
          {
            image: WP_IMAGES.beatAnyPrice,
            alt: "Beat ANY Price by 10%",
            link: "/price-guarantee/",
          },
          {
            image: WP_IMAGES.freeShipping,
            alt: "Free Shipping / Free Hoodie / Free Shaker",
            link: "/shop/",
          },
        ]}
      />

      {/* Latest Deals Carousel (was Featured Products) */}
      <ProductCarousel
        title="Latest Deals"
        products={featuredProducts}
        viewAllLink="/shop?featured=true"
      />

      {/* Creatine Promo Banner (image only, no text overlay - Tab 1 style) */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <a href="/shop/creatine" className="block mx-auto rounded-xl overflow-hidden" style={{ maxWidth: '980px' }}>
            <Image
              src={WP_IMAGES.bestCreatine}
              alt="Best Creatine Prices"
              width={980}
              height={201}
              className="w-full h-auto"
            />
          </a>
        </div>
      </section>

      {/* Shop by Category - Using mock data with correct images */}
      <CategoryGrid
        title="Popular Categories"
        categories={featuredCategories}
        columns={5}
      />

      {/* Recommended Products Carousel */}
      <ProductCarousel
        title="Recommended"
        products={bestSellers}
        viewAllLink="/shop?sort=popularity"
      />

      {/* Shop by Brand - renamed to match Tab 1, no view all link */}
      <BrandLogos
        title="Discover Brands You'll Love"
        brands={featuredBrands}
      />

      {/* Customer Reviews - Tab 1 style */}
      <CustomerReviews title="What Customers Say" />

      {/* Newsletter - Tab 1 style */}
      <Newsletter
        title="Sign Up For Newsletter"
        description="Stay up to date with recent news, advice and weekly offers."
        variant="default"
      />
    </>
  );
}
