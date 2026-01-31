// Product components barrel export

// Product Card
export { default as ProductCard, ProductCardSkeleton } from "./ProductCard";
export type { ProductCardProps } from "./ProductCard";

// Product Carousel/Grid
export { default as ProductCarousel, ProductGrid } from "./ProductCarousel";
export type { ProductCarouselProps, ProductGridProps } from "./ProductCarousel";

// Product Gallery
export { default as ProductGallery, ProductGallerySkeleton } from "./ProductGallery";
export type { ProductGalleryProps } from "./ProductGallery";

// Product Info
export { default as ProductInfo, ProductInfoSkeleton } from "./ProductInfo";
export type { ProductInfoProps } from "./ProductInfo";

// Product Variations
export {
  default as ProductVariations,
  VariationButtons,
  ProductVariationsSkeleton,
} from "./ProductVariations";
export type { ProductVariationsProps, VariationButtonsProps } from "./ProductVariations";

// Product Actions
export {
  default as ProductActions,
  BuyNowButton,
  ProductActionsSkeleton,
} from "./ProductActions";
export type { ProductActionsProps, BuyNowButtonProps } from "./ProductActions";

// Product Tabs
export {
  default as ProductTabs,
  AccordionTabs,
  ProductTabsSkeleton,
} from "./ProductTabs";
export type { ProductTabsProps, AccordionTabsProps, TabId } from "./ProductTabs";

// Product Reviews
export {
  default as ProductReviews,
  ProductReviewsSkeleton,
} from "./ProductReviews";
export type { ProductReviewsProps, ReviewFormData } from "./ProductReviews";
