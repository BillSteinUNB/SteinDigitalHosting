import type { CartItem } from "@/types/cart";
import { markWooCheckoutHandoffPending } from "@/lib/checkout/handoff-state";

interface HandoffResponse {
  ok: boolean;
  endpoint?: string;
  payload?: string;
  signature?: string;
  error?: string;
}

function createHiddenInput(name: string, value: string): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  return input;
}

export async function handoffCartToWooCheckout(items: CartItem[]): Promise<void> {
  if (!items.length) {
    throw new Error("Your cart is empty.");
  }

  const requestItems = items.map((item) => ({
    productId: item.productId,
    variationId: item.variationId,
    quantity: item.quantity,
    unitPrice: item.price,
  }));

  const response = await fetch("/api/checkout/handoff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: requestItems }),
  });

  const data = (await response.json().catch(() => null)) as HandoffResponse | null;

  if (!response.ok || !data?.ok || !data.endpoint || !data.payload || !data.signature) {
    throw new Error(data?.error || "Unable to start secure checkout handoff.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = data.endpoint;
  form.style.display = "none";

  form.appendChild(createHiddenInput("payload", data.payload));
  form.appendChild(createHiddenInput("signature", data.signature));

  document.body.appendChild(form);
  markWooCheckoutHandoffPending();
  form.submit();
}
