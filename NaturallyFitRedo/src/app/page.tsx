// Homepage - Server Component with GraphQL data fetching

import { Truck, Shield, Award, Clock } from "lucide-react";

// GraphQL data fetching
import { getFeaturedProducts, getSaleProducts, getBestSellers } from "@/lib/graphql/products";
import { getFeaturedCategories } from "@/lib/graphql/categories";

// Mock data (brands not available in WooCommerce GraphQL by default)
import { featuredBrands } from "@/lib/mock/brands";

// Home components
import {
  Hero,
  CategoryGrid,
  BrandLogos,
  PromoBanner,
  SaleBanner,
  SplitPromo,
  FeaturesBar,
  Newsletter,
} from "@/components/home";

// Product components
import { ProductCarousel } from "@/components/product";

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================
const WP_IMAGES = {
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
    saleProducts,
    bestSellers,
    featuredCategories,
  ] = await Promise.all([
    getFeaturedProducts(8),
    getSaleProducts(8),
    getBestSellers(8),
    getFeaturedCategories(6),
  ]);

  return (
    <>
      {/* Hero Carousel */}
      <Hero />

      {/* Features Bar */}
      <FeaturesBar
        features={[
          {
            icon: <Truck size={24} strokeWidth={1.5} />,
            title: "Free Shipping",
            description: "On orders over $75",
          },
          {
            icon: <Shield size={24} strokeWidth={1.5} />,
            title: "Price Match",
            description: "Guaranteed lowest prices",
          },
          {
            icon: <Award size={24} strokeWidth={1.5} />,
            title: "Veteran Owned",
            description: "Since 1999",
          },
          {
            icon: <Clock size={24} strokeWidth={1.5} />,
            title: "Fast Delivery",
            description: "Same day processing",
          },
        ]}
      />

      {/* Featured Products Carousel */}
      <ProductCarousel
        title="Featured Products"
        products={featuredProducts}
        viewAllLink="/shop?featured=true"
      />

      {/* Shop by Category */}
      <CategoryGrid
        title="Shop by Category"
        categories={featuredCategories}
        columns={6}
      />

      {/* Sale Banner */}
      <SaleBanner
        saleText="Winter Sale"
        discountText="Up to 40% Off Select Items"
        endDate="Jan 31st"
        ctaText="Shop Sale"
        ctaLink="/shop?on_sale=true"
      />

      {/* Sale Products Carousel */}
      <ProductCarousel
        title="On Sale Now"
        products={saleProducts}
        viewAllLink="/shop?on_sale=true"
      />

      {/* Split Promo Banners */}
      <SplitPromo
        leftPromo={{
          title: "3 for $99 Deal",
          subtitle: "Limited Time",
          ctaText: "Shop Now",
          ctaLink: "/shop",
          image: WP_IMAGES.promo3for99,
        }}
        rightPromo={{
          title: "Best Creatine Prices",
          subtitle: "Guaranteed",
          ctaText: "Shop Creatine",
          ctaLink: "/shop/creatine",
          image: WP_IMAGES.bestCreatine,
        }}
      />

      {/* Best Sellers */}
      <ProductCarousel
        title="Best Sellers"
        products={bestSellers}
        viewAllLink="/shop?sort=popularity"
      />

      {/* Shop by Brand */}
      <BrandLogos
        title="Shop by Brand"
        brands={featuredBrands}
        viewAllLink="/brands"
      />

      {/* Wholesale Promo */}
      <PromoBanner
        title="Wholesale Program"
        subtitle="For Gyms & Retailers"
        description="Get exclusive pricing, dedicated support, and priority shipping for your business."
        ctaText="Learn More"
        ctaLink="/wholesale"
        backgroundColor="black"
        size="lg"
      />

      {/* Newsletter */}
      <Newsletter
        title="Stay in the Loop"
        description="Subscribe for exclusive deals, new arrivals, and fitness tips delivered straight to your inbox."
        variant="default"
      />
    </>
  );
}
