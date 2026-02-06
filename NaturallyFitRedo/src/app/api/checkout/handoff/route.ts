import { randomBytes, createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface HandoffRequestItem {
  productId: number;
  variationId?: number;
  quantity: number;
}

interface HandoffRequestBody {
  items?: HandoffRequestItem[];
}

interface HandoffPayload {
  v: number;
  iat: number;
  exp: number;
  nonce: string;
  source: "naturallyfit-nextjs";
  user: {
    email: string | null;
    isWholesale: boolean;
    role: string | null;
  };
  items: Array<{
    productId: number;
    variationId?: number;
    quantity: number;
  }>;
}

const HANDOFF_TTL_SECONDS = 300;
const MAX_ITEMS = 100;
const MAX_QTY_PER_ITEM = 999;

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function resolveWordPressBaseUrl(): string {
  const raw =
    process.env.WOOCOMMERCE_REST_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    "https://wp.naturallyfit.ca";

  return raw.replace(/\/+$/, "");
}

function resolveHandoffEndpoint(): string {
  const override = process.env.WOO_HANDOFF_ENDPOINT_URL;
  if (override && override.trim()) {
    return override.trim();
  }

  const wpBase = resolveWordPressBaseUrl();
  return `${wpBase}/wp-admin/admin-post.php?action=nf_cart_handoff`;
}

function normalizeItems(body: HandoffRequestBody): HandoffRequestItem[] {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error("Cart items are required.");
  }

  if (body.items.length > MAX_ITEMS) {
    throw new Error(`Too many items in cart. Maximum is ${MAX_ITEMS}.`);
  }

  return body.items.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid item at index ${index}.`);
    }

    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const variationId =
      item.variationId !== undefined ? Number(item.variationId) : undefined;

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error(`Invalid product ID at item ${index + 1}.`);
    }

    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QTY_PER_ITEM) {
      throw new Error(`Invalid quantity at item ${index + 1}.`);
    }

    if (
      variationId !== undefined &&
      (!Number.isInteger(variationId) || variationId <= 0)
    ) {
      throw new Error(`Invalid variation ID at item ${index + 1}.`);
    }

    return {
      productId,
      variationId,
      quantity,
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.WOO_HANDOFF_SECRET || "";
    if (!secret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Checkout handoff is not configured. Missing WOO_HANDOFF_SECRET.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json().catch(() => null)) as HandoffRequestBody | null;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const items = normalizeItems(body);
    const session = await getServerSession(authOptions);
    const now = Math.floor(Date.now() / 1000);

    const payload: HandoffPayload = {
      v: 1,
      iat: now,
      exp: now + HANDOFF_TTL_SECONDS,
      nonce: randomBytes(12).toString("hex"),
      source: "naturallyfit-nextjs",
      user: {
        email: session?.user?.email || null,
        isWholesale: Boolean(session?.user?.isWholesale),
        role: session?.user?.role || null,
      },
      items,
    };

    const payloadJson = JSON.stringify(payload);
    const payloadEncoded = toBase64Url(payloadJson);
    const signature = signPayload(payloadEncoded, secret);
    const endpoint = resolveHandoffEndpoint();

    return NextResponse.json({
      ok: true,
      endpoint,
      payload: payloadEncoded,
      signature,
      expiresAt: new Date((payload.exp || now) * 1000).toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to prepare checkout handoff.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
