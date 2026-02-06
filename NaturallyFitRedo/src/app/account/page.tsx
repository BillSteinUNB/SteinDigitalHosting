"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package, MapPin, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Spinner } from "@/components/ui";
import type { AccountOrder, AccountOrdersResponse } from "@/types/order";

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

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
    completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", className: "bg-gray-100 text-gray-800" },
  };

  const key = status.toLowerCase();
  const config = statusConfig[key] || statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-tiny font-semibold uppercase",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: AccountAddress | null;
}) {
  return (
    <div className="p-3 bg-gray-light">
      <p className="text-tiny text-gray-medium uppercase mb-1">{title}</p>
      {address ? (
        <p className="text-small">
          {[address.firstName, address.lastName].filter(Boolean).join(" ")}
          <br />
          {address.company && (
            <>
              {address.company}
              <br />
            </>
          )}
          {address.address1}
          {address.address2 && `, ${address.address2}`}
          <br />
          {[address.city, address.state, address.postcode].filter(Boolean).join(", ")}
          <br />
          {address.country || "Canada"}
        </p>
      ) : (
        <p className="text-small text-gray-medium">No address on file</p>
      )}
    </div>
  );
}

export default function AccountDashboardPage() {
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("welcome") === "true";

  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addresses, setAddresses] = useState<AccountAddressesResponse>({
    shipping: null,
    billing: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch("/api/account/orders", { cache: "no-store" }),
          fetch("/api/account/addresses", { cache: "no-store" }),
        ]);

        if (!ordersRes.ok || !addressesRes.ok) {
          throw new Error("Failed to load account data.");
        }

        const ordersData = (await ordersRes.json()) as Partial<AccountOrdersResponse>;
        const addressesData = (await addressesRes.json()) as AccountAddressesResponse;

        if (!isMounted) return;

        setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
        setAddresses({
          shipping: addressesData.shipping || null,
          billing: addressesData.billing || null,
        });
      } catch (error) {
        console.error("Account dashboard load error:", error);
        if (isMounted) {
          setLoadError("We couldn't load your account details right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAccountData();

    return () => {
      isMounted = false;
    };
  }, []);

  const quickStats = useMemo(
    () => [
      { label: "Total Orders", value: String(orders.length) },
      {
        label: "Saved Addresses",
        value: String([addresses.shipping, addresses.billing].filter(Boolean).length),
      },
    ],
    [addresses.billing, addresses.shipping, orders.length]
  );

  return (
    <div className="space-y-8">
      {isNewUser && (
        <div className="flex items-start gap-4 p-4 bg-success/10 border border-success">
          <CheckCircle size={24} strokeWidth={1.5} className="text-success flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading font-bold text-h4 uppercase text-success mb-1">
              Welcome to Naturally Fit!
            </h2>
            <p className="text-small text-gray-dark">
              Your account has been created successfully.
            </p>
          </div>
        </div>
      )}

      {loadError && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error text-error">
          <AlertCircle size={20} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-small font-semibold">Account Data Unavailable</p>
            <p className="text-small">{loadError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="bg-gray-light p-4 text-center">
            <p className="font-heading font-bold text-h2 text-red-primary mb-1">{stat.value}</p>
            <p className="text-tiny text-gray-medium uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-gray-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
              <Package size={20} strokeWidth={1.5} />
              Recent Orders
            </h2>
            <Link href="/account/orders" className="text-small text-red-primary hover:underline">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Spinner size="md" />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  href="/account/orders"
                  className="flex items-center justify-between p-3 bg-gray-light hover:bg-gray-200 transition-colors"
                >
                  <div>
                    <p className="text-small font-semibold">{order.orderNumber}</p>
                    <p className="text-tiny text-gray-medium">
                      {order.itemCount} items
                      {order.date ? ` - ${new Date(order.date).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-small font-bold">{formatPrice(order.total)}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-small text-gray-medium py-4 text-center">
              No orders yet.{" "}
              <Link href="/shop" className="text-red-primary hover:underline">
                Start shopping
              </Link>
            </p>
          )}
        </div>

        <div className="border border-gray-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
              <MapPin size={20} strokeWidth={1.5} />
              Addresses
            </h2>
            <Link href="/account/addresses" className="text-small text-red-primary hover:underline">
              View
            </Link>
          </div>
          <div className="space-y-3">
            <AddressBlock title="Shipping" address={addresses.shipping} />
            <AddressBlock title="Billing" address={addresses.billing} />
          </div>
        </div>
      </div>

      <div className="border border-gray-border p-4">
        <h2 className="font-heading font-bold text-h4 uppercase mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 p-4 bg-red-primary text-white font-heading font-bold uppercase text-small hover:bg-red-hover transition-colors"
          >
            Shop Now
            <ChevronRight size={16} strokeWidth={1.5} />
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center justify-center gap-2 p-4 bg-gray-light font-heading font-bold uppercase text-small hover:bg-gray-200 transition-colors"
          >
            Track Order
            <ChevronRight size={16} strokeWidth={1.5} />
          </Link>
          <Link
            href="/account/settings"
            className="flex items-center justify-center gap-2 p-4 bg-gray-light font-heading font-bold uppercase text-small hover:bg-gray-200 transition-colors"
          >
            Edit Profile
            <ChevronRight size={16} strokeWidth={1.5} />
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 p-4 bg-gray-light font-heading font-bold uppercase text-small hover:bg-gray-200 transition-colors"
          >
            Get Help
            <ChevronRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
