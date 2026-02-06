"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { consumeWooCheckoutSuccessSignal } from "@/lib/checkout/handoff-state";

export default function CheckoutHandoffSync() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (consumeWooCheckoutSuccessSignal()) {
      clearCart();
    }
  }, [clearCart]);

  return null;
}
