// ============================================
// CREATE ORDER API ROUTE
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createWooCommerceOrder, type CreateOrderInput } from "@/lib/woocommerce/orders";
import type { CartItem } from "@/types/cart";
import type { Address } from "@/types/user";

// ============================================
// REQUEST TYPES
// ============================================

interface CreateOrderRequest {
  // Customer info
  email: string;
  phone?: string;

  // Addresses
  billingAddress: Address;
  shippingAddress: Address;

  // Cart
  items: CartItem[];

  // Shipping
  shippingMethodId?: string;
  shippingTotal?: number;

  // Coupons
  couponCodes?: string[];

  // Payment method (for display, actual payment handled separately)
  paymentMethod?: string;
  paymentMethodTitle?: string;

  // Notes
  customerNote?: string;
}

// ============================================
// VALIDATION
// ============================================

function validateRequest(body: unknown): CreateOrderRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const data = body as Record<string, unknown>;

  if (!data.email || typeof data.email !== "string") {
    throw new Error("Email is required");
  }

  if (!data.billingAddress || typeof data.billingAddress !== "object") {
    throw new Error("Billing address is required");
  }

  if (!data.shippingAddress || typeof data.shippingAddress !== "object") {
    throw new Error("Shipping address is required");
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Cart items are required");
  }

  return data as unknown as CreateOrderRequest;
}

// ============================================
// POST HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const orderData = validateRequest(body);

    // Get session for user info (optional - guest checkout supported)
    const session = await getServerSession(authOptions);
    const isWholesale = session?.user?.isWholesale ?? false;
    const userRole = session?.user?.role;

    // Mark items as wholesale if user is wholesale
    const itemsWithWholesaleFlag = orderData.items.map((item) => ({
      ...item,
      isWholesale: isWholesale || item.isWholesale,
    }));

    // Build order input
    const orderInput: CreateOrderInput = {
      customerEmail: orderData.email,
      customerPhone: orderData.phone,
      billingAddress: orderData.billingAddress,
      shippingAddress: orderData.shippingAddress,
      items: itemsWithWholesaleFlag,
      shippingMethodId: orderData.shippingMethodId,
      shippingTotal: orderData.shippingTotal,
      couponCodes: orderData.couponCodes,
      paymentMethod: orderData.paymentMethod,
      paymentMethodTitle: orderData.paymentMethodTitle,
      customerNote: orderData.customerNote,
      isWholesale,
      wholesaleRole: userRole,
    };

    // If user is logged in, try to get their WooCommerce customer ID
    // For now, we'll let WooCommerce match by email
    // TODO: Add customer ID lookup from session

    // Create the order in WooCommerce
    const order = await createWooCommerceOrder(orderInput);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      orderKey: order.order_key,
      total: order.total,
      status: order.status,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    const message = error instanceof Error ? error.message : "Failed to create order";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
