// ============================================
// CART TYPES
// ============================================

import type { ProductImage, ProductVariation } from "./product";

export interface CartItem {
  key: string; // Unique cart item key
  productId: number;
  variationId?: number;
  name: string;
  slug: string;
  image?: ProductImage;
  price: number; // Unit price
  regularPrice: number;
  salePrice?: number;
  quantity: number;
  subtotal: number;
  variation?: Pick<ProductVariation, "name" | "attributes">;
  // Wholesale pricing (if applicable)
  wholesalePrice?: number;
  isWholesale?: boolean;
}

export interface Cart {
  items: CartItem[];
  itemCount: number; // Total number of items (sum of quantities)
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  // Applied coupons
  appliedCoupons: AppliedCoupon[];
  // Shipping
  needsShipping: boolean;
  shippingMethods?: ShippingMethod[];
  selectedShippingMethod?: string;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountType: "percent" | "fixed_cart" | "fixed_product";
}

export interface ShippingMethod {
  id: string;
  label: string;
  cost: number;
  description?: string;
}

// Cart mutations
export interface AddToCartInput {
  productId: number;
  variationId?: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  key: string;
  quantity: number;
}

export interface RemoveCartItemInput {
  key: string;
}

export interface ApplyCouponInput {
  code: string;
}

// Cart store state
export interface CartState {
  cart: Cart;
  isLoading: boolean;
  isOpen: boolean; // Mini cart open state
  // Actions
  addItem: (input: AddToCartInput) => Promise<void>;
  updateItem: (input: UpdateCartItemInput) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  setShippingMethod: (methodId: string) => void;
  toggleMiniCart: () => void;
  closeMiniCart: () => void;
  openMiniCart: () => void;
  // Sync with server
  syncCart: () => Promise<void>;
}

// Empty cart helper
export const EMPTY_CART: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discountTotal: 0,
  shippingTotal: 0,
  taxTotal: 0,
  total: 0,
  appliedCoupons: [],
  needsShipping: true,
};
