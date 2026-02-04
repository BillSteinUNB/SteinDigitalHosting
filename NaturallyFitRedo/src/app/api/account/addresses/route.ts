import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { wooFetch } from "@/lib/woocommerce/rest";

interface WooCustomer {
  id: number;
  billing?: WooAddress;
  shipping?: WooAddress;
}

interface WooAddress {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
}

interface AccountAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

function mapAddress(address: WooAddress | undefined): AccountAddress | null {
  if (!address) return null;

  const mapped: AccountAddress = {
    firstName: address.first_name || "",
    lastName: address.last_name || "",
    company: address.company || undefined,
    address1: address.address_1 || "",
    address2: address.address_2 || undefined,
    city: address.city || "",
    state: address.state || "",
    postcode: address.postcode || "",
    country: address.country || "",
    phone: address.phone || undefined,
    email: address.email || undefined,
  };

  const hasAnyValue = Object.values(mapped).some((value) =>
    typeof value === "string" ? value.trim().length > 0 : Boolean(value)
  );

  return hasAnyValue ? mapped : null;
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

    const customerSummary = customers[0];
    if (!customerSummary) {
      return NextResponse.json({ shipping: null, billing: null });
    }

    const customer = await wooFetch<WooCustomer>(
      `/customers/${customerSummary.id}`
    );

    return NextResponse.json({
      shipping: mapAddress(customer.shipping),
      billing: mapAddress(customer.billing),
    });
  } catch (error) {
    console.error("Failed to load account addresses:", error);
    return NextResponse.json(
      { error: "Unable to load addresses right now." },
      { status: 500 }
    );
  }
}
