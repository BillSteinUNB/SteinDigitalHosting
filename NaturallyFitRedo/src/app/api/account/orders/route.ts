import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { wooFetch } from "@/lib/woocommerce/rest";

interface WooCustomer {
  id: number;
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
}

function parseMoney(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await wooFetch<WooCustomer[]>("/customers", {
      query: {
        email: session.user.email,
        per_page: 1,
      },
    });

    const customer = customers[0];
    if (!customer) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await wooFetch<WooOrder[]>("/orders", {
      query: {
        customer: customer.id,
        per_page: 50,
        order: "desc",
        orderby: "date",
      },
    });

    const mappedOrders = orders.map((order) => {
      const items = (order.line_items || []).map((item) => ({
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
    });

    return NextResponse.json({ orders: mappedOrders });
  } catch (error) {
    console.error("Failed to load account orders:", error);
    return NextResponse.json(
      { error: "Unable to load orders right now." },
      { status: 500 }
    );
  }
}
