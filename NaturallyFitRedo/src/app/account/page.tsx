"use client";

// ============================================
// ACCOUNT DASHBOARD PAGE
// ============================================

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  MapPin,
  Heart,
  CreditCard,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

// ============================================
// MOCK DATA
// ============================================

const recentOrders = [
  {
    id: "NF-12345",
    date: "2024-01-15",
    status: "delivered",
    total: 129.99,
    items: 3,
  },
  {
    id: "NF-12344",
    date: "2024-01-10",
    status: "shipped",
    total: 89.50,
    items: 2,
  },
  {
    id: "NF-12343",
    date: "2024-01-05",
    status: "processing",
    total: 199.00,
    items: 4,
  },
];

const quickStats = [
  { label: "Total Orders", value: "12" },
  { label: "Wishlist Items", value: "5" },
  { label: "Reward Points", value: "450" },
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

export default function AccountDashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("welcome") === "true";

  return (
    <div className="space-y-8">
      {/* Welcome Message for New Users */}
      {isNewUser && (
        <div className="flex items-start gap-4 p-4 bg-success/10 border border-success">
          <CheckCircle size={24} strokeWidth={1.5} className="text-success flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-heading font-bold text-h4 uppercase text-success mb-1">
              Welcome to Naturally Fit!
            </h2>
            <p className="text-small text-gray-dark">
              Your account has been created successfully. Start exploring our products and enjoy exclusive member benefits.
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="bg-gray-light p-4 text-center">
            <p className="font-heading font-bold text-h2 text-red-primary mb-1">
              {stat.value}
            </p>
            <p className="text-tiny text-gray-medium uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="border border-gray-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
              <Package size={20} strokeWidth={1.5} />
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
              className="text-small text-red-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-3 bg-gray-light hover:bg-gray-200 transition-colors"
                >
                  <div>
                    <p className="text-small font-semibold">{order.id}</p>
                    <p className="text-tiny text-gray-medium">
                      {order.items} items • {new Date(order.date).toLocaleDateString()}
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
              No orders yet. <Link href="/shop" className="text-red-primary hover:underline">Start shopping</Link>
            </p>
          )}
        </div>

        {/* Addresses */}
        <div className="border border-gray-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
              <MapPin size={20} strokeWidth={1.5} />
              Addresses
            </h2>
            <Link
              href="/account/addresses"
              className="text-small text-red-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {/* Shipping Address */}
            <div className="p-3 bg-gray-light">
              <p className="text-tiny text-gray-medium uppercase mb-1">Shipping</p>
              <p className="text-small">
                {session?.user?.firstName} {session?.user?.lastName}<br />
                123 Main Street<br />
                Toronto, ON M5V 1A1<br />
                Canada
              </p>
            </div>
            {/* Billing Address */}
            <div className="p-3 bg-gray-light">
              <p className="text-tiny text-gray-medium uppercase mb-1">Billing</p>
              <p className="text-small text-gray-medium">Same as shipping</p>
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div className="border border-gray-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
              <Heart size={20} strokeWidth={1.5} />
              Wishlist
            </h2>
            <Link
              href="/account/wishlist"
              className="text-small text-red-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <p className="text-small text-gray-medium py-4 text-center">
            5 items saved. <Link href="/account/wishlist" className="text-red-primary hover:underline">View wishlist</Link>
          </p>
        </div>

        {/* Payment Methods */}
        <div className="border border-gray-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
              <CreditCard size={20} strokeWidth={1.5} />
              Payment Methods
            </h2>
            <Link
              href="/account/payment"
              className="text-small text-red-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="p-3 bg-gray-light flex items-center gap-3">
            <div className="w-12 h-8 bg-gray-border flex items-center justify-center text-tiny">
              VISA
            </div>
            <div>
              <p className="text-small font-semibold">•••• •••• •••• 4242</p>
              <p className="text-tiny text-gray-medium">Expires 12/25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border border-gray-border p-4">
        <h2 className="font-heading font-bold text-h4 uppercase mb-4">
          Quick Actions
        </h2>
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
