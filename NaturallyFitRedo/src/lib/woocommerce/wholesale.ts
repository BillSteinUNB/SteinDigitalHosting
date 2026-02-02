import type { WholesaleInquiryInput } from "@/lib/wholesale/schema";
import { WooCommerceApiError, wooFetch } from "./rest";

type WooMeta = { id?: number; key: string; value: unknown };

interface WooCustomer {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  meta_data?: WooMeta[];
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: fullName.trim(), lastName: "" };
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

function hashToBase36(input: string): string {
  // Deterministic small hash (non-crypto) for usernames
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function makeUsername(email: string): string {
  const localPart = email.split("@")[0] || "wholesale";
  const base = localPart.toLowerCase().replace(/[^a-z0-9._-]+/g, "").slice(0, 20) || "wholesale";
  const suffix = hashToBase36(email).slice(0, 6);
  return `${base}-${suffix}`;
}

function buildWholesaleMeta(input: WholesaleInquiryInput): WooMeta[] {
  const submittedAt = new Date().toISOString();

  return [
    { key: "nf_wholesale_inquiry_status", value: "submitted" },
    { key: "nf_wholesale_inquiry_submitted_at", value: submittedAt },
    { key: "nf_wholesale_business_number", value: input.businessNumber },
    { key: "nf_wholesale_business_address", value: input.businessAddress },
    { key: "nf_wholesale_years_in_business", value: input.yearsInBusiness },
    { key: "nf_wholesale_brands_carried", value: input.brandsCarried },
    { key: "nf_wholesale_brands_interested", value: input.brandsInterested },
    { key: "nf_wholesale_additional_info", value: input.additionalInfo || "" },
    { key: "nf_wholesale_inquiry_source", value: "naturallyfit-nextjs" },
  ];
}

async function findCustomerByEmail(email: string): Promise<WooCustomer | null> {
  const customers = await wooFetch<WooCustomer[]>("/customers", {
    query: { email, per_page: 1 },
  });
  return customers[0] ?? null;
}

export async function upsertWholesaleInquiry(
  input: WholesaleInquiryInput
): Promise<{ customerId: number; created: boolean }> {
  const { firstName, lastName } = splitName(input.name);
  const meta = buildWholesaleMeta(input);

  // Update if customer already exists (e.g., they are already a retail customer)
  const existing = await findCustomerByEmail(input.email).catch(() => null);
  if (existing) {
    const updated = await wooFetch<WooCustomer>(`/customers/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        billing: {
          first_name: firstName,
          last_name: lastName,
          company: input.businessName,
          address_1: input.businessAddress,
          phone: input.phone,
          email: input.email,
        },
        meta_data: meta,
      }),
    });

    return { customerId: updated.id, created: false };
  }

  // Otherwise create a new customer record
  try {
    const created = await wooFetch<WooCustomer>("/customers", {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        username: makeUsername(input.email),
        first_name: firstName,
        last_name: lastName,
        billing: {
          first_name: firstName,
          last_name: lastName,
          company: input.businessName,
          address_1: input.businessAddress,
          phone: input.phone,
          email: input.email,
        },
        meta_data: meta,
      }),
    });

    return { customerId: created.id, created: true };
  } catch (err) {
    // If a customer exists but wasn’t returned by the email lookup (rare/paging),
    // retry as an update to avoid surfacing an unnecessary error to the user.
    if (err instanceof WooCommerceApiError && err.code?.includes("email")) {
      const retryExisting = await findCustomerByEmail(input.email);
      if (retryExisting) {
        const updated = await wooFetch<WooCustomer>(`/customers/${retryExisting.id}`, {
          method: "PUT",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            billing: {
              first_name: firstName,
              last_name: lastName,
              company: input.businessName,
              address_1: input.businessAddress,
              phone: input.phone,
              email: input.email,
            },
            meta_data: meta,
          }),
        });
        return { customerId: updated.id, created: false };
      }
    }
    throw err;
  }
}

