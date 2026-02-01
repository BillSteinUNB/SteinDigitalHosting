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
          title: "New Pre-Workouts",
          subtitle: "Just Arrived",
          ctaText: "Shop Pre-Workout",
          ctaLink: "/shop/pre-workout",
          image: "/images/promos/promo-preworkout.jpg",
        }}
        rightPromo={{
          title: "Protein Sale",
          subtitle: "This Week Only",
          ctaText: "Shop Protein",
          ctaLink: "/shop/protein",
          image: "/images/promos/promo-protein.jpg",
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
