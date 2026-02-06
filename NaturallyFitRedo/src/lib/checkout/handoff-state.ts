const HANDOFF_PENDING_KEY = "nf_checkout_handoff_pending";
const HANDOFF_PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const CHECKOUT_STATUS_PARAM = "nf_checkout";
const CHECKOUT_ORDER_PARAM = "nf_order_id";
const CHECKOUT_SUCCESS_VALUE = "success";

interface HandoffState {
  startedAt: number;
}

function readPendingState(): HandoffState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(HANDOFF_PENDING_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<HandoffState>;
    if (!parsed || typeof parsed.startedAt !== "number") {
      window.localStorage.removeItem(HANDOFF_PENDING_KEY);
      return null;
    }

    const ageMs = Date.now() - parsed.startedAt;
    if (ageMs < 0 || ageMs > HANDOFF_PENDING_TTL_MS) {
      window.localStorage.removeItem(HANDOFF_PENDING_KEY);
      return null;
    }

    return { startedAt: parsed.startedAt };
  } catch {
    window.localStorage.removeItem(HANDOFF_PENDING_KEY);
    return null;
  }
}

export function markWooCheckoutHandoffPending(): void {
  if (typeof window === "undefined") {
    return;
  }

  const state: HandoffState = {
    startedAt: Date.now(),
  };

  window.localStorage.setItem(HANDOFF_PENDING_KEY, JSON.stringify(state));
}

export function clearWooCheckoutHandoffPending(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(HANDOFF_PENDING_KEY);
}

function isWooSuccessReferrer(referrer: string): boolean {
  if (!referrer) {
    return false;
  }

  return /order-received|thank-?you/i.test(referrer);
}

function cleanSuccessParams(url: URL): void {
  url.searchParams.delete(CHECKOUT_STATUS_PARAM);
  url.searchParams.delete(CHECKOUT_ORDER_PARAM);

  const query = url.searchParams.toString();
  const cleanUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
  window.history.replaceState({}, "", cleanUrl);
}

export function consumeWooCheckoutSuccessSignal(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const url = new URL(window.location.href);
  const isExplicitSuccess =
    url.searchParams.get(CHECKOUT_STATUS_PARAM) === CHECKOUT_SUCCESS_VALUE;
  const hasPendingHandoff = readPendingState() !== null;
  const hasSuccessReferrer =
    hasPendingHandoff && isWooSuccessReferrer(document.referrer || "");

  if (!isExplicitSuccess && !hasSuccessReferrer) {
    return false;
  }

  clearWooCheckoutHandoffPending();

  if (isExplicitSuccess) {
    cleanSuccessParams(url);
  }

  return true;
}
