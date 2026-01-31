// ============================================
// CART STORE (Zustand with Persist)
// ============================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Cart,
  CartItem,
  AddToCartInput,
  AppliedCoupon,
} from "@/types/cart";

// ============================================
// TYPES
// ============================================

interface CartStore {
  // State
  cart: Cart;
  isLoading: boolean;
  isOpen: boolean; // Mini cart drawer state

  // Cart Actions
  addItem: (input: AddToCartInput & { item: Omit<CartItem, "key" | "quantity" | "subtotal"> }) => void;
  updateItemQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;

  // Coupon Actions
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: (code: string) => void;

  // Shipping Actions
  setShippingMethod: (methodId: string) => void;

  // Mini Cart UI Actions
  openMiniCart: () => void;
  closeMiniCart: () => void;
  toggleMiniCart: () => void;

  // Utility
  getItemByKey: (key: string) => CartItem | undefined;
  isInCart: (productId: number, variationId?: number) => boolean;
}

// ============================================
// HELPERS
// ============================================

// Generate unique cart item key
function generateCartItemKey(productId: number, variationId?: number): string {
  return variationId ? `${productId}-${variationId}` : `${productId}`;
}

// Calculate cart totals
function calculateCartTotals(items: CartItem[], appliedCoupons: AppliedCoupon[]): {
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Calculate discount from coupons
  let discountTotal = 0;
  for (const coupon of appliedCoupons) {
    if (coupon.discountType === "percent") {
      discountTotal += subtotal * (coupon.discountAmount / 100);
    } else {
      discountTotal += coupon.discountAmount;
    }
  }

  // Ensure discount doesn't exceed subtotal
  discountTotal = Math.min(discountTotal, subtotal);

  const total = subtotal - discountTotal;

  return { itemCount, subtotal, discountTotal, total };
}

// ============================================
// EMPTY CART STATE
// ============================================

const emptyCart: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discountTotal: 0,
  shippingTotal: 0,
  taxTotal: 0,
  total: 0,
  appliedCoupons: [],
  needsShipping: true,
  shippingMethods: [
    { id: "flat_rate", label: "Flat Rate Shipping", cost: 9.99, description: "5-7 business days" },
    { id: "express", label: "Express Shipping", cost: 19.99, description: "2-3 business days" },
    { id: "free_shipping", label: "Free Shipping", cost: 0, description: "Orders over $75 (5-7 business days)" },
  ],
};

// ============================================
// MOCK COUPONS (for testing)
// ============================================

const mockCoupons: Record<string, AppliedCoupon> = {
  SAVE10: { code: "SAVE10", discountAmount: 10, discountType: "percent" },
  SAVE20: { code: "SAVE20", discountAmount: 20, discountType: "percent" },
  FLAT15: { code: "FLAT15", discountAmount: 15, discountType: "fixed_cart" },
  WELCOME: { code: "WELCOME", discountAmount: 15, discountType: "percent" },
};

// ============================================
// STORE
// ============================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial State
      cart: emptyCart,
      isLoading: false,
      isOpen: false,

      // Add item to cart
      addItem: (input) => {
        const { productId, variationId, quantity, item } = input;
        const key = generateCartItemKey(productId, variationId);

        set((state) => {
          const existingItemIndex = state.cart.items.findIndex((i) => i.key === key);
          let newItems: CartItem[];

          if (existingItemIndex > -1) {
            // Update existing item quantity
            newItems = state.cart.items.map((cartItem, index) => {
              if (index === existingItemIndex) {
                const newQuantity = cartItem.quantity + quantity;
                return {
                  ...cartItem,
                  quantity: newQuantity,
                  subtotal: cartItem.price * newQuantity,
                };
              }
              return cartItem;
            });
          } else {
            // Add new item
            const newItem: CartItem = {
              ...item,
              key,
              quantity,
              subtotal: item.price * quantity,
            };
            newItems = [...state.cart.items, newItem];
          }

          const totals = calculateCartTotals(newItems, state.cart.appliedCoupons);

          return {
            cart: {
              ...state.cart,
              items: newItems,
              ...totals,
            },
          };
        });
      },

      // Update item quantity
      updateItemQuantity: (key, quantity) => {
        if (quantity < 1) {
          get().removeItem(key);
          return;
        }

        set((state) => {
          const newItems = state.cart.items.map((item) => {
            if (item.key === key) {
              return {
                ...item,
                quantity,
                subtotal: item.price * quantity,
              };
            }
            return item;
          });

          const totals = calculateCartTotals(newItems, state.cart.appliedCoupons);

          return {
            cart: {
              ...state.cart,
              items: newItems,
              ...totals,
            },
          };
        });
      },

      // Remove item from cart
      removeItem: (key) => {
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.key !== key);
          const totals = calculateCartTotals(newItems, state.cart.appliedCoupons);

          return {
            cart: {
              ...state.cart,
              items: newItems,
              ...totals,
            },
          };
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({ cart: emptyCart });
      },

      // Apply coupon
      applyCoupon: async (code) => {
        const upperCode = code.toUpperCase();
        const coupon = mockCoupons[upperCode];

        if (!coupon) {
          return false;
        }

        // Check if coupon already applied
        const alreadyApplied = get().cart.appliedCoupons.some(
          (c) => c.code === upperCode
        );

        if (alreadyApplied) {
          return false;
        }

        set((state) => {
          const newCoupons = [...state.cart.appliedCoupons, coupon];
          const totals = calculateCartTotals(state.cart.items, newCoupons);

          return {
            cart: {
              ...state.cart,
              appliedCoupons: newCoupons,
              ...totals,
            },
          };
        });

        return true;
      },

      // Remove coupon
      removeCoupon: (code) => {
        set((state) => {
          const newCoupons = state.cart.appliedCoupons.filter(
            (c) => c.code !== code.toUpperCase()
          );
          const totals = calculateCartTotals(state.cart.items, newCoupons);

          return {
            cart: {
              ...state.cart,
              appliedCoupons: newCoupons,
              ...totals,
            },
          };
        });
      },

      // Set shipping method
      setShippingMethod: (methodId) => {
        set((state) => {
          const method = state.cart.shippingMethods?.find((m) => m.id === methodId);
          const shippingTotal = method?.cost || 0;

          return {
            cart: {
              ...state.cart,
              selectedShippingMethod: methodId,
              shippingTotal,
              total: state.cart.subtotal - state.cart.discountTotal + shippingTotal + state.cart.taxTotal,
            },
          };
        });
      },

      // Mini cart UI
      openMiniCart: () => set({ isOpen: true }),
      closeMiniCart: () => set({ isOpen: false }),
      toggleMiniCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Utility methods
      getItemByKey: (key) => {
        return get().cart.items.find((item) => item.key === key);
      },

      isInCart: (productId, variationId) => {
        const key = generateCartItemKey(productId, variationId);
        return get().cart.items.some((item) => item.key === key);
      },
    }),
    {
      name: "naturally-fit-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);

// ============================================
// SELECTORS (for performance optimization)
// ============================================

export const selectCartItems = (state: CartStore) => state.cart.items;
export const selectCartItemCount = (state: CartStore) => state.cart.itemCount;
export const selectCartSubtotal = (state: CartStore) => state.cart.subtotal;
export const selectCartTotal = (state: CartStore) => state.cart.total;
export const selectIsCartOpen = (state: CartStore) => state.isOpen;
export const selectAppliedCoupons = (state: CartStore) => state.cart.appliedCoupons;
