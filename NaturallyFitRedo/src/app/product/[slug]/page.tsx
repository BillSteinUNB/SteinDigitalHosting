// Product Page - Server Component

import { notFound } from "next/navigation";
import { getProductBySlugGraphQL } from "@/lib/graphql/products";
import ProductDetailsClient from "./ProductDetailsClient";

// ============================================
// SINGLE PRODUCT PAGE - Server Component
// ============================================

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  // Fetch product from WooCommerce GraphQL
  const product = await getProductBySlugGraphQL(slug);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  // Render client component with product data
  return <ProductDetailsClient product={product} />;
}
