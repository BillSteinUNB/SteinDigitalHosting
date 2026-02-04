import { NextResponse } from "next/server";
import { z } from "zod";
import { wholesaleInquirySchema } from "@/lib/wholesale/schema";
import { upsertWholesaleInquiry } from "@/lib/woocommerce/wholesale";
import { WooCommerceApiError } from "@/lib/woocommerce/rest";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = wholesaleInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please check the form fields and try again.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await upsertWholesaleInquiry(parsed.data);

    return NextResponse.json({
      ok: true,
      customerId: result.customerId,
      created: result.created,
    });
  } catch (err) {
    // Zod errors (should be caught by safeParse, but keep as fallback)
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid form submission.", issues: err.flatten() },
        { status: 400 }
      );
    }

    console.error("Wholesale inquiry submission error:", err);
    const fallback =
      "We couldn’t submit your request right now. Please try again in a moment, or email wholesale@naturallyfit.ca.";
    const message =
      err instanceof Error && err.message ? err.message : fallback;
    const details =
      err instanceof WooCommerceApiError
        ? { status: err.status, code: err.code }
        : undefined;
    return NextResponse.json(
      {
        ok: false,
        error: message || fallback,
        details,
      },
      { status: 500 }
    );
  }
}

