export class WooCommerceApiError extends Error {
  status?: number;
  code?: string;
  data?: unknown;

  constructor(
    message: string,
    options?: { status?: number; code?: string; data?: unknown }
  ) {
    super(message);
    this.name = "WooCommerceApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.data = options?.data;
  }
}

const WC_API_BASE_PATH = "/wp-json/wc/v3";

function getWooConfig() {
  const baseUrl =
    process.env.WOOCOMMERCE_REST_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    "";
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

  if (!baseUrl) {
    throw new Error(
      "Missing WooCommerce REST base URL. Set WOOCOMMERCE_REST_URL (recommended) or NEXT_PUBLIC_WORDPRESS_URL."
    );
  }
  if (!consumerKey || !consumerSecret) {
    throw new Error(
      "Missing WooCommerce REST credentials. Set WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET."
    );
  }

  const authHeader =
    "Basic " + Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  return { baseUrl, authHeader };
}

type WooQueryValue = string | number | boolean | undefined | null;

export async function wooFetch<T>(
  path: string,
  options: RequestInit & { query?: Record<string, WooQueryValue> } = {}
): Promise<T> {
  const { query, headers, ...init } = options;
  const { baseUrl, authHeader } = getWooConfig();

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${WC_API_BASE_PATH}${normalizedPath}`, baseUrl);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...headers,
    },
  });

  const text = await response.text();
  const json = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const messageValue = getObjectProp(json, "message");
    const message =
      (typeof messageValue === "string" ? messageValue : undefined) ||
      `WooCommerce request failed (${response.status})`;
    const codeValue = getObjectProp(json, "code");
    const code =
      typeof codeValue === "string" || typeof codeValue === "number"
        ? String(codeValue)
        : undefined;

    throw new WooCommerceApiError(String(message), {
      status: response.status,
      code,
      data: json ?? text,
    });
  }

  return json as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getObjectProp(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
}

