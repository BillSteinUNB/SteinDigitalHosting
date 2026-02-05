// ============================================
// WOOCOMMERCE ORDER API
// ============================================

import { wooFetch } from "./rest";
import type { Address } from "@/types/user";
import type { CartItem } from "@/types/cart";

// ============================================
// TYPES
// ============================================

interface WooAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

interface WooLineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  // Override price (for wholesale)
  price?: number;
  subtotal?: string;
  total?: string;
  meta_data?: Array<{ key: string; value: string }>;
}

interface WooMeta {
  key: string;
  value: string | number | boolean;
}

export interface CreateOrderInput {
  // Customer info
  customerId?: number;
  customerEmail: string;
  customerPhone?: string;

  // Addresses
  billingAddress: Address;
  shippingAddress: Address;

  // Cart items
  items: CartItem[];

  // Pricing
  shippingMethodId?: string;
  shippingTotal?: number;
  couponCodes?: string[];

  // Wholesale
  isWholesale?: boolean;
  wholesaleRole?: string;

  // Payment
  paymentMethod?: string;
  paymentMethodTitle?: string;

  // Notes
  customerNote?: string;
}

export interface WooOrder {
  id: number;
  number: string;
  order_key: string;
  status: string;
  currency: string;
  date_created: string;
  total: string;
  customer_id: number;
  billing: WooAddress;
  shipping: WooAddress;
  payment_method: string;
  payment_method_title: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    subtotal: string;
    total: string;
  }>;
  meta_data: WooMeta[];
}

// ============================================
// HELPERS
// ============================================

function addressToWoo(address: Address): WooAddress {
  return {
    first_name: address.firstName,
    last_name: address.lastName,
    company: address.company || "",
    address_1: address.address1,
    address_2: address.address2 || "",
    city: address.city,
    state: address.state,
    postcode: address.postcode,
    country: address.country,
    phone: address.phone || "",
    email: address.email || "",
  };
}

function cartItemToLineItem(item: CartItem): WooLineItem {
  const lineItem: WooLineItem = {
    product_id: item.productId,
    quantity: item.quantity,
  };

  if (item.variationId) {
    lineItem.variation_id = item.variationId;
  }

  // For wholesale orders, set the price override
  // WooCommerce REST API uses subtotal/total for price overrides
  if (item.isWholesale && item.wholesalePrice !== undefined) {
    const itemSubtotal = (item.wholesalePrice * item.quantity).toFixed(2);
    lineItem.subtotal = itemSubtotal;
    lineItem.total = itemSubtotal;
    lineItem.meta_data = [
      { key: "_wholesale_price_applied", value: "yes" },
      { key: "_wholesale_unit_price", value: item.wholesalePrice.toFixed(2) },
    ];
  } else {
    // Use the price from cart (could be sale price)
    const itemSubtotal = (item.price * item.quantity).toFixed(2);
    lineItem.subtotal = itemSubtotal;
    lineItem.total = itemSubtotal;
  }

  return lineItem;
}

// ============================================
// CREATE ORDER
// ============================================

export async function createWooCommerceOrder(
  input: CreateOrderInput
): Promise<WooOrder> {
  const lineItems = input.items.map(cartItemToLineItem);

  // Build order metadata
  const metaData: WooMeta[] = [
    { key: "_order_source", value: "naturallyfit-nextjs" },
  ];

  // Add wholesale metadata if applicable
  if (input.isWholesale) {
    metaData.push(
      { key: "_is_wholesale_order", value: "yes" },
      { key: "_wholesale_customer_role", value: input.wholesaleRole || "wholesale_customer" }
    );
  }

  // Build order payload
  const orderPayload: Record<string, unknown> = {
    status: "pending", // Will change to "processing" after payment
    billing: {
      ...addressToWoo(input.billingAddress),
      email: input.customerEmail,
      phone: input.customerPhone || input.billingAddress.phone || "",
    },
    shipping: addressToWoo(input.shippingAddress),
    line_items: lineItems,
    meta_data: metaData,
    set_paid: false, // Payment will be handled separately
  };

  // Add customer ID if logged in
  if (input.customerId) {
    orderPayload.customer_id = input.customerId;
  }

  // Add payment method info (for display purposes)
  if (input.paymentMethod) {
    orderPayload.payment_method = input.paymentMethod;
    orderPayload.payment_method_title = input.paymentMethodTitle || input.paymentMethod;
  }

  // Add customer note
  if (input.customerNote) {
    orderPayload.customer_note = input.customerNote;
  }

  // Add shipping
  if (input.shippingMethodId) {
    orderPayload.shipping_lines = [
      {
        method_id: input.shippingMethodId,
        method_title: getShippingMethodTitle(input.shippingMethodId),
        total: (input.shippingTotal ?? 0).toFixed(2),
      },
    ];
  }

  // Add coupons
  if (input.couponCodes && input.couponCodes.length > 0) {
    orderPayload.coupon_lines = input.couponCodes.map((code) => ({
      code,
    }));
  }

  // Create the order in WooCommerce
  const order = await wooFetch<WooOrder>("/orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });

  return order;
}

// ============================================
// UPDATE ORDER STATUS
// ============================================

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "processing" | "on-hold" | "completed" | "cancelled" | "refunded" | "failed"
): Promise<WooOrder> {
  return wooFetch<WooOrder>(`/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ============================================
// MARK ORDER AS PAID
// ============================================

export async function markOrderAsPaid(
  orderId: number,
  transactionId?: string
): Promise<WooOrder> {
  const payload: Record<string, unknown> = {
    status: "processing",
    set_paid: true,
  };

  if (transactionId) {
    payload.transaction_id = transactionId;
  }

  return wooFetch<WooOrder>(`/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ============================================
// HELPERS
// ============================================

function getShippingMethodTitle(methodId: string): string {
  const titles: Record<string, string> = {
    flat_rate: "Flat Rate Shipping",
    express: "Express Shipping",
    free_shipping: "Free Shipping",
    local_pickup: "Local Pickup",
  };
  return titles[methodId] || methodId;
}
