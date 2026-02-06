"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, Search, AlertCircle } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Input, EmptyState, Spinner, Button } from "@/components/ui";
import type { AccountOrder, AccountOrdersResponse } from "@/types/order";

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
    completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", className: "bg-gray-100 text-gray-800" },
    "on-hold": { label: "On Hold", className: "bg-orange-100 text-orange-800" },
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch("/api/account/orders", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const data = (await response.json()) as Partial<AccountOrdersResponse>;
        if (!isMounted) return;

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (error) {
        console.error("Orders load error:", error);
        if (isMounted) {
          setLoadError("We couldn't load your order history right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusOptions = useMemo(() => {
    const allStatuses = Array.from(new Set(orders.map((order) => order.status)));
    return ["all", ...allStatuses];
  }, [orders]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          order.orderNumber.toLowerCase().includes(q) ||
          order.items.some((item) => item.name.toLowerCase().includes(q));
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
      }),
    [orders, searchQuery, selectedStatus]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-h2 uppercase mb-2">Order History</h1>
        <p className="text-body text-gray-medium">View and track all your orders</p>
      </div>

      {loadError && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error text-error">
          <AlertCircle size={20} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-small font-semibold">Couldn&apos;t Load Orders</p>
            <p className="text-small">{loadError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order # or product..."
            leftIcon={<Search size={18} strokeWidth={1.5} />}
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 min-h-[44px] border border-gray-border bg-white text-body focus:outline-none focus:border-black"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "all" ? "All Orders" : status.replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-border overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-light">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <p className="text-tiny text-gray-medium uppercase">Order</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-tiny text-gray-medium uppercase">Date</p>
                    <p className="text-small">
                      {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-tiny text-gray-medium uppercase">Total</p>
                    <p className="font-bold">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-tiny text-gray-medium uppercase">Status</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={`${order.id}-${idx}`} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-small font-semibold truncate">{item.name}</p>
                      <p className="text-tiny text-gray-medium">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-small font-semibold flex-shrink-0">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Package size={48} strokeWidth={1} />}
          title="No Orders Found"
          description={
            searchQuery || selectedStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You haven't placed any orders yet."
          }
          action={
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 font-heading font-bold uppercase tracking-button text-small bg-red-primary text-white hover:bg-red-hover transition-colors"
            >
              Start Shopping
            </Link>
          }
        />
      )}
    </div>
  );
}
