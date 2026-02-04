"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, AlertCircle } from "lucide-react";
import { EmptyState, Spinner } from "@/components/ui";

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

interface AccountAddressesResponse {
  shipping: AccountAddress | null;
  billing: AccountAddress | null;
}

function AddressCard({
  title,
  address,
}: {
  title: string;
  address: AccountAddress | null;
}) {
  return (
    <div className="border border-gray-border p-4">
      <p className="text-tiny text-gray-medium uppercase mb-2 font-semibold">{title}</p>

      {address ? (
        <div className="text-small space-y-1">
          <p className="font-semibold">
            {[address.firstName, address.lastName].filter(Boolean).join(" ")}
          </p>
          {address.company && <p>{address.company}</p>}
          <p>{address.address1}</p>
          {address.address2 && <p>{address.address2}</p>}
          <p>
            {[address.city, address.state, address.postcode].filter(Boolean).join(", ")}
          </p>
          <p>{address.country}</p>
          {address.phone && <p className="text-gray-medium">{address.phone}</p>}
          {address.email && <p className="text-gray-medium">{address.email}</p>}
        </div>
      ) : (
        <p className="text-small text-gray-medium">No address on file.</p>
      )}
    </div>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AccountAddressesResponse>({
    shipping: null,
    billing: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAddresses() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch("/api/account/addresses", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load addresses.");
        }

        const data = (await response.json()) as AccountAddressesResponse;
        if (!isMounted) return;

        setAddresses({
          shipping: data.shipping || null,
          billing: data.billing || null,
        });
      } catch (error) {
        console.error("Addresses load error:", error);
        if (isMounted) {
          setLoadError("We couldn't load your addresses right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAddresses();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasAddresses = Boolean(addresses.shipping || addresses.billing);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-h2 uppercase mb-2">Addresses</h1>
          <p className="text-body text-gray-medium">Addresses from your WooCommerce account</p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] font-heading font-bold uppercase tracking-button border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200"
        >
          Need to update?
        </Link>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error text-error">
          <AlertCircle size={20} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-small font-semibold">Couldn&apos;t Load Addresses</p>
            <p className="text-small">{loadError}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : hasAddresses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddressCard title="Shipping Address" address={addresses.shipping} />
          <AddressCard title="Billing Address" address={addresses.billing} />
        </div>
      ) : (
        <EmptyState
          icon={<MapPin size={48} strokeWidth={1} />}
          title="No Addresses Yet"
          description="No shipping or billing address is saved on your account yet."
        />
      )}
    </div>
  );
}
