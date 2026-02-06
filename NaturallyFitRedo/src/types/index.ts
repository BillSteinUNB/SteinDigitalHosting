// ============================================
// CENTRAL TYPE EXPORTS
// ============================================

// Product types
export type {
  ProductImage,
  ProductCategory,
  ProductBrand,
  ProductVariation,
  VariationAttribute,
  ProductAttribute,
  StockStatus,
  ProductType,
  ProductBase,
  SimpleProduct,
  VariableProduct,
  Product,
  ProductCardData,
  ProductFilters,
  ProductSortOption,
  PaginatedProducts,
} from "./product";

// Cart types
export type {
  CartItem,
  Cart,
  AppliedCoupon,
  ShippingMethod,
  AddToCartInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  ApplyCouponInput,
  CartState,
} from "./cart";
export { EMPTY_CART } from "./cart";

// User types
export type {
  UserRole,
  User,
  WholesaleStatus,
  Address,
  UserSession,
  LoginCredentials,
  RegisterData,
  WholesaleApplicationData,
  AuthState,
} from "./user";

// Order types
export type {
  AccountOrderItem,
  AccountOrder,
  AccountOrdersResponse,
} from "./order";
