"use client";

// ============================================
// ORDERS PAGE
// ============================================

import { useState } from "react";
import Link from "next/link";
import { Package, Search, ChevronRight, Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Input, EmptyState } from "@/components/ui";

// ============================================
// MOCK DATA
// ============================================

const mockOrders = [
  {
    id: "NF-12345",
    date: "2024-01-15",
    status: "delivered",
    total: 129.99,
    items: [
      { name: "Optimum Nutrition Gold Standard Whey - Chocolate", quantity: 1, price: 79.99 },
      { name: "C4 Original Pre-Workout - Blue Raspberry", quantity: 2, price: 25.00 },
    ],
    shippingAddress: "123 Main St, Toronto, ON M5V 1A1",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "NF-12344",
    date: "2024-01-10",
    status: "shipped",
    total: 89.50,
    items: [
      { name: "BCAAs - Fruit Punch", quantity: 2, price: 44.75 },
    ],
    shippingAddress: "123 Main St, Toronto, ON M5V 1A1",
    trackingNumber: "1Z999AA10123456785",
  },
  {
    id: "NF-12343",
    date: "2024-01-05",
    status: "processing",
    total: 199.00,
    items: [
      { name: "Mass Gainer - Vanilla", quantity: 1, price: 119.00 },
      { name: "Creatine Monohydrate", quantity: 2, price: 40.00 },
    ],
    shippingAddress: "123 Main St, Toronto, ON M5V 1A1",
  },
  {
    id: "NF-12342",
    date: "2023-12-20",
    status: "delivered",
    total: 65.00,
    items: [
      { name: "Fish Oil - 120 Softgels", quantity: 1, price: 35.00 },
      { name: "Vitamin D3 - 1000 IU", quantity: 1, price: 30.00 },
    ],
    shippingAddress: "123 Main St, Toronto, ON M5V 1A1",
    trackingNumber: "1Z999AA10123456786",
  },
];

// ============================================
// STATUS BADGE
// ============================================

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", className: "bg-gray-100 text-gray-800" },
  };

  const config = statusConfig[status] || statusConfig.pending;

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

// ============================================
// PAGE COMPONENT
// ============================================

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-h2 uppercase mb-2">
          Order History
        </h1>
        <p className="text-body text-gray-medium">
          View and track all your orders
        </p>
      </div>

      {/* Filters */}
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
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-border overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-light">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <p className="text-tiny text-gray-medium uppercase">Order</p>
                    <p className="font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-tiny text-gray-medium uppercase">Date</p>
                    <p className="text-small">{new Date(order.date).toLocaleDateString()}</p>
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
                <div className="flex items-center gap-2">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 px-3 py-2 text-tiny font-semibold uppercase bg-white border border-gray-border hover:border-black transition-colors"
                  >
                    <Eye size={14} strokeWidth={1.5} />
                    Details
                  </Link>
                  {order.status === "delivered" && (
                    <button className="inline-flex items-center gap-1 px-3 py-2 text-tiny font-semibold uppercase bg-white border border-gray-border hover:border-black transition-colors">
                      <RotateCcw size={14} strokeWidth={1.5} />
                      Reorder
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-gray-light flex-shrink-0 flex items-center justify-center">
                        <span className="text-tiny text-gray-medium">IMG</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-small font-semibold truncate">
                          {item.name}
                        </p>
                        <p className="text-tiny text-gray-medium">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-small font-semibold flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="px-4 pb-4">
                  <Link
                    href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-small text-red-primary hover:underline"
                  >
                    Track Package: {order.trackingNumber}
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </Link>
                </div>
              )}
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
