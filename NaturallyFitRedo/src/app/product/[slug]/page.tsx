"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Divider } from "@/components/ui";
import {
  ProductGallery,
  ProductInfo,
  ProductVariations,
  ProductActions,
  ProductTabs,
  ProductReviews,
  ProductCarousel,
} from "@/components/product";
import { getProductBySlug, getRelatedProducts } from "@/lib/mock";
import { getMockReviewsByProductId } from "@/lib/mock/users";
import type { ProductVariation, ProductImage } from "@/types/product";

// ============================================
// BREADCRUMB COMPONENT
// ============================================

interface BreadcrumbProps {
  productName: string;
  category?: { name: string; slug: string };
  brand?: { name: string; slug: string };
}

function Breadcrumb({ productName, category, brand }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-small">
        <li>
          <Link
            href="/"
            className="text-gray-medium hover:text-red-primary transition-colors"
          >
            Home
          </Link>
        </li>
        <ChevronRight size={14} className="text-gray-medium" />
        <li>
          <Link
            href="/shop"
            className="text-gray-medium hover:text-red-primary transition-colors"
          >
            Shop
          </Link>
        </li>
        {category && (
          <>
            <ChevronRight size={14} className="text-gray-medium" />
            <li>
              <Link
                href={`/shop/${category.slug}`}
                className="text-gray-medium hover:text-red-primary transition-colors"
              >
                {category.name}
              </Link>
            </li>
          </>
        )}
        {brand && (
          <>
            <ChevronRight size={14} className="text-gray-medium" />
            <li>
              <Link
                href={`/brands/${brand.slug}`}
                className="text-gray-medium hover:text-red-primary transition-colors"
              >
                {brand.name}
              </Link>
            </li>
          </>
        )}
        <ChevronRight size={14} className="text-gray-medium" />
        <li>
          <span className="text-black font-medium line-clamp-1 break-words">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}

// ============================================
// SINGLE PRODUCT PAGE
// ============================================

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Get product data
  const product = getProductBySlug(slug);

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  // State for variable products
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Check if this is a variable product
  const isVariableProduct = product.type === "VARIABLE";

  // Memoize variations and attributes to avoid dependency warnings
  const variations = useMemo(
    () => (isVariableProduct ? product.variations : []),
    [isVariableProduct, product]
  );
  const attributes = useMemo(
    () => (isVariableProduct ? product.attributes : []),
    [isVariableProduct, product]
  );

  // Find selected variation based on selected attributes
  const selectedVariation = useMemo((): ProductVariation | undefined => {
    if (!isVariableProduct) return undefined;

    // Check if all variation attributes are selected
    const variationAttributes = attributes.filter((attr) => attr.variation);
    const allSelected = variationAttributes.every(
      (attr) => selectedAttributes[attr.name]
    );

    if (!allSelected) return undefined;

    return variations.find((variation) =>
      variation.attributes.every(
        (attr) => selectedAttributes[attr.name] === attr.value
      )
    );
  }, [isVariableProduct, attributes, variations, selectedAttributes]);

  // Check if all variations are selected
  const allVariationsSelected = useMemo(() => {
    if (!isVariableProduct) return true;
    const variationAttributes = attributes.filter((attr) => attr.variation);
    return variationAttributes.every((attr) => selectedAttributes[attr.name]);
  }, [isVariableProduct, attributes, selectedAttributes]);

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  // Get price info
  const priceInfo = useMemo(() => {
    if (selectedVariation) {
      return {
        price: selectedVariation.price,
        regularPrice: selectedVariation.regularPrice,
        salePrice: selectedVariation.salePrice,
        stockStatus: selectedVariation.stockStatus,
        stockQuantity: selectedVariation.stockQuantity,
      };
    }
    return {
      price: product.price,
      regularPrice: product.regularPrice,
      salePrice: product.type === "SIMPLE" ? product.salePrice : undefined,
      stockStatus: product.stockStatus,
      stockQuantity: product.stockQuantity,
    };
  }, [product, selectedVariation]);

  // Get gallery images
  const galleryImages: ProductImage[] = useMemo(() => {
    const images: ProductImage[] = [];
    
    // Add main product image
    if (product.image) {
      images.push(product.image);
    }
    
    // Add gallery images
    if (product.galleryImages) {
      images.push(...product.galleryImages);
    }
    
    // For variable products, add variation image if different
    if (selectedVariation?.image) {
      const existingUrls = images.map((img) => img.sourceUrl);
      if (!existingUrls.includes(selectedVariation.image.sourceUrl)) {
        images.unshift(selectedVariation.image);
      }
    }
    
    return images;
  }, [product, selectedVariation]);

  // Get reviews
  const reviews = getMockReviewsByProductId(product.databaseId);

  // Get related products
  const relatedProducts = getRelatedProducts(product.id, 4);

  // Category and brand info for breadcrumb
  const primaryCategory = product.productCategories[0];
  const primaryBrand = product.productBrands[0];

  // Parse price for cart
  const parsedPrice = parseFloat(priceInfo.price.replace(/[^0-9.]/g, "")) || 0;
  const parsedRegularPrice =
    parseFloat(priceInfo.regularPrice.replace(/[^0-9.]/g, "")) || 0;
  const parsedSalePrice = priceInfo.salePrice
    ? parseFloat(priceInfo.salePrice.replace(/[^0-9.]/g, ""))
    : undefined;

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <section className="bg-gray-light py-4">
        <Container>
          <Breadcrumb
            productName={product.name}
            category={primaryCategory}
            brand={primaryBrand}
          />
        </Container>
      </section>

      {/* Product Details Section */}
      <section className="py-8 md:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Gallery */}
            <div className="min-w-0">
              <ProductGallery
                images={galleryImages}
                productName={product.name}
                onSale={product.onSale}
                stockStatus={priceInfo.stockStatus}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="min-w-0 flex flex-col gap-6">
              {/* Product Info */}
              <ProductInfo
                name={product.name}
                brand={primaryBrand}
                categories={product.productCategories}
                sku={product.sku}
                price={priceInfo.price}
                regularPrice={priceInfo.regularPrice}
                salePrice={priceInfo.salePrice}
                wholesalePrice={
                  product.type === "SIMPLE" ? product.wholesalePrice : undefined
                }
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
                shortDescription={product.shortDescription}
                stockStatus={priceInfo.stockStatus}
                stockQuantity={priceInfo.stockQuantity}
              />

              <Divider />

              {/* Variations (for variable products) */}
              {isVariableProduct && (
                <>
                  <ProductVariations
                    attributes={attributes}
                    variations={variations}
                    selectedAttributes={selectedAttributes}
                    onAttributeChange={handleAttributeChange}
                  />
                  <Divider />
                </>
              )}

              {/* Actions */}
              <ProductActions
                productId={product.databaseId}
                productName={product.name}
                productSlug={product.slug}
                productImage={product.image}
                price={parsedPrice}
                regularPrice={parsedRegularPrice}
                salePrice={parsedSalePrice}
                stockStatus={priceInfo.stockStatus}
                stockQuantity={priceInfo.stockQuantity}
                variation={selectedVariation}
                isVariableProduct={isVariableProduct}
                allVariationsSelected={allVariationsSelected}
              />

              {/* Additional Info */}
              <div className="mt-4 p-4 bg-gray-light border border-gray-border">
                <ul className="space-y-2 text-small text-gray-dark">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-primary flex-shrink-0" />
                    <span>Free shipping on orders over $75</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-primary flex-shrink-0" />
                    <span>30-day hassle-free returns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-primary flex-shrink-0" />
                    <span>Secure checkout with SSL encryption</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Product Tabs Section */}
      <section className="py-8 md:py-12 border-t border-gray-border">
        <Container>
          <ProductTabs
            description={product.description}
            attributes={isVariableProduct ? attributes : undefined}
            reviewCount={reviews.length}
          >
            <ProductReviews
              reviews={reviews}
              averageRating={product.averageRating}
              totalReviews={product.reviewCount}
              productId={product.databaseId}
              onSubmitReview={async (reviewData) => {
                // Mock submit - in production this would call an API
                console.log("Review submitted:", reviewData);
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }}
            />
          </ProductTabs>
        </Container>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-8 md:py-12 bg-gray-light">
          <Container>
            <ProductCarousel
              title="Related Products"
              products={relatedProducts}
              viewAllLink={`/shop/${primaryCategory?.slug || ""}`}
              viewAllText="View More"
            />
          </Container>
        </section>
      )}
    </main>
  );
}
