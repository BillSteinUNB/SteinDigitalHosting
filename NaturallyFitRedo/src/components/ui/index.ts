// ============================================
// UI COMPONENTS — Central Export
// ============================================

// Button
export { Button, IconButton } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize, IconButtonProps } from "./Button";

// Input
export { Input, Textarea, SearchInput } from "./Input";
export type { InputProps, TextareaProps, SearchInputProps } from "./Input";

// Select
export { Select, NativeSelect } from "./Select";
export type { SelectProps, SelectOption, NativeSelectProps } from "./Select";

// Badge
export { Badge, CountBadge, SaleBadge, StockBadge } from "./Badge";
export type {
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  CountBadgeProps,
  SaleBadgeProps,
  StockBadgeProps,
  StockStatus,
} from "./Badge";

// Star Rating
export { StarRating, StarRatingInput, RatingSummary } from "./StarRating";
export type {
  StarRatingProps,
  StarRatingInputProps,
  RatingSummaryProps,
} from "./StarRating";

// Price Display
export {
  PriceDisplay,
  PriceRangeDisplay,
  ComparePriceDisplay,
  SimplePrice,
} from "./PriceDisplay";
export type {
  PriceDisplayProps,
  PriceRangeDisplayProps,
  ComparePriceDisplayProps,
  SimplePriceProps,
} from "./PriceDisplay";

// Modal
export { Modal, ConfirmModal, Drawer } from "./Modal";
export type { ModalProps, ConfirmModalProps, DrawerProps } from "./Modal";

// Skeleton
export {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  CategoryCircleSkeleton,
  HeroBannerSkeleton,
  PromoBannerSkeleton,
  TableRowSkeleton,
  TextSkeleton,
  CartItemSkeleton,
  FilterSidebarSkeleton,
} from "./Skeleton";
export type {
  SkeletonProps,
  ProductCardSkeletonProps,
  ProductGridSkeletonProps,
  TableRowSkeletonProps,
  TextSkeletonProps,
} from "./Skeleton";

// Utilities
export {
  Spinner,
  LoadingOverlay,
  Divider,
  VisuallyHidden,
  Container,
  SectionHeading,
  QuantitySelector,
  EmptyState,
} from "./Utilities";
export type {
  SpinnerProps,
  LoadingOverlayProps,
  DividerProps,
  VisuallyHiddenProps,
  ContainerProps,
  SectionHeadingProps,
  QuantitySelectorProps,
  EmptyStateProps,
} from "./Utilities";
