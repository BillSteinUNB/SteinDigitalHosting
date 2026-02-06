import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { wooFetch } from "@/lib/woocommerce/rest";
import type { AccountOrder, AccountOrderItem } from "@/types/order";

export const dynamic = "force-dynamic";

interface WooCustomer {
  id: number;
  email?: string;
}

interface WooOrderLineItem {
  name?: string;
  quantity?: number;
  total?: string;
}

interface WooOrder {
  id: number;
  number?: string;
  status?: string;
  date_created?: string;
  total?: string;
  line_items?: WooOrderLineItem[];
  billing?: {
    email?: string;
  };
}

const CUSTOMER_SEARCH_LIMIT = 20;
const ORDER_PAGE_SIZE = 50;

function parseMoney(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeEmail(email: string | null | undefined): string {
  return (email || "").trim().toLowerCase();
}

async function findCustomerByEmail(rawEmail: string): Promise<WooCustomer | null> {
  const email = rawEmail.trim();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const exactMatch = await wooFetch<WooCustomer[]>("/customers", {
    query: {
      email,
      per_page: 1,
    },
  });

  if (exactMatch[0]) {
    return exactMatch[0];
  }

  if (normalizedEmail !== email) {
    const normalizedMatch = await wooFetch<WooCustomer[]>("/customers", {
      query: {
        email: normalizedEmail,
        per_page: 1,
      },
    });

    if (normalizedMatch[0]) {
      return normalizedMatch[0];
    }
  }

  const candidates = await wooFetch<WooCustomer[]>("/customers", {
    query: {
      search: normalizedEmail,
      per_page: CUSTOMER_SEARCH_LIMIT,
    },
  });

  return (
    candidates.find(
      (candidate) => normalizeEmail(candidate.email) === normalizedEmail
    ) ||
    null
  );
}

async function findOrdersByCustomerId(customerId: number): Promise<WooOrder[]> {
  return wooFetch<WooOrder[]>("/orders", {
    query: {
      customer: customerId,
      per_page: ORDER_PAGE_SIZE,
      order: "desc",
      orderby: "date",
    },
  });
}

async function findOrdersByBillingEmail(rawEmail: string): Promise<WooOrder[]> {
  const email = rawEmail.trim();
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return [];

  const candidateOrders = await wooFetch<WooOrder[]>("/orders", {
    query: {
      search: email,
      per_page: ORDER_PAGE_SIZE,
      order: "desc",
      orderby: "date",
    },
  });

  return candidateOrders.filter(
    (order) => normalizeEmail(order.billing?.email) === normalizedEmail
  );
}

function mapWooOrderToAccountOrder(order: WooOrder): AccountOrder {
  const items: AccountOrderItem[] = (order.line_items || []).map((item) => ({
    name: item.name || "Product",
    quantity: item.quantity || 0,
    total: parseMoney(item.total),
  }));

  return {
    id: String(order.id),
    orderNumber: order.number ? `#${order.number}` : `#${order.id}`,
    date: order.date_created || "",
    status: order.status || "pending",
    total: parseMoney(order.total),
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionEmail = session.user.email.trim();
    const normalizedSessionEmail = normalizeEmail(sessionEmail);
    if (!normalizedSessionEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Orders API] Session email:", normalizedSessionEmail);

    const customer = await findCustomerByEmail(sessionEmail);
    let orders: WooOrder[] = [];

    if (customer) {
      console.log("[Orders API] Customer ID:", customer.id);
      orders = await findOrdersByCustomerId(customer.id);
      console.log("[Orders API] Orders by customer ID:", orders.length);
    } else {
      console.log(
        "[Orders API] No customer found for email:",
        normalizedSessionEmail
      );
    }

    if (orders.length === 0) {
      const emailOrders = await findOrdersByBillingEmail(sessionEmail);
      console.log("[Orders API] Orders by billing email:", emailOrders.length);
      orders = emailOrders;
    }

    const mappedOrders = orders.map(mapWooOrderToAccountOrder);

    return NextResponse.json({ orders: mappedOrders });
  } catch (error) {
    console.error("[Orders API] Failed to load account orders:", error);
    return NextResponse.json(
      { error: "Unable to load orders right now." },
      { status: 500 }
    );
  }
}
