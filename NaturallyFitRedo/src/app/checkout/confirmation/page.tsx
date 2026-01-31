"use client";

// ============================================
// ORDER CONFIRMATION PAGE
// ============================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Mail,
  Printer,
  ArrowRight,
  Truck,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCheckoutStore } from "@/stores/checkout-store";

// ============================================
// COMPONENT
// ============================================

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderId, customerInfo, shippingInfo, resetCheckout } = useCheckoutStore();
  const [showDetails] = useState(true);

  // Redirect if no order
  useEffect(() => {
    if (!orderId) {
      router.push("/shop");
    }
  }, [orderId, router]);

  // Generate estimated delivery date (5-7 business days)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = 5;
    const maxDays = 7;

    const addBusinessDays = (date: Date, days: number) => {
      let count = 0;
      const result = new Date(date);
      while (count < days) {
        result.setDate(result.getDate() + 1);
        const dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
      }
      return result;
    };

    const minDate = addBusinessDays(today, minDays);
    const maxDate = addBusinessDays(today, maxDays);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-CA", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Clean up checkout state when leaving
  const handleContinueShopping = () => {
    resetCheckout();
    router.push("/shop");
  };

  if (!orderId) {
    return null;
  }

  return (
    <main className="py-12 lg:py-16 bg-gray-light min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} strokeWidth={1.5} className="text-success" />
            </div>

            <h1 className="font-heading font-bold text-2xl md:text-3xl uppercase mb-2">
              Thank You for Your Order!
            </h1>

            <p className="text-gray-dark mb-4">
              Your order has been successfully placed and is being processed.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-border">
              <Package size={18} strokeWidth={1.5} className="text-gray-medium" />
              <span className="text-small">Order Number:</span>
              <span className="font-bold font-mono">{orderId}</span>
            </div>
          </div>

          {/* Confirmation Card */}
          <div className="bg-white border border-gray-border mb-6">
            {/* Email Confirmation */}
            <div className="p-6 border-b border-gray-border">
              <div className="flex items-start gap-4">
                <Mail size={24} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                <div>
                  <h2 className="font-heading font-bold uppercase mb-1">
                    Confirmation Email Sent
                  </h2>
                  <p className="text-small text-gray-dark">
                    A confirmation email has been sent to{" "}
                    <strong>{customerInfo.email}</strong> with your order details and
                    tracking information.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="p-6 border-b border-gray-border">
              <div className="flex items-start gap-4">
                <Truck size={24} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                <div>
                  <h2 className="font-heading font-bold uppercase mb-1">
                    Estimated Delivery
                  </h2>
                  <p className="text-small text-gray-dark mb-2">
                    {getEstimatedDelivery()}
                  </p>
                  <p className="text-tiny text-gray-medium">
                    You will receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {showDetails && (
              <div className="p-6 border-b border-gray-border">
                <div className="flex items-start gap-4">
                  <MapPin size={24} strokeWidth={1.5} className="text-red-primary flex-shrink-0" />
                  <div>
                    <h2 className="font-heading font-bold uppercase mb-2">
                      Shipping To
                    </h2>
                    <address className="not-italic text-small text-gray-dark">
                      <p className="font-semibold">
                        {shippingInfo.shippingAddress.firstName}{" "}
                        {shippingInfo.shippingAddress.lastName}
                      </p>
                      {shippingInfo.shippingAddress.company && (
                        <p>{shippingInfo.shippingAddress.company}</p>
                      )}
                      <p>{shippingInfo.shippingAddress.address1}</p>
                      {shippingInfo.shippingAddress.address2 && (
                        <p>{shippingInfo.shippingAddress.address2}</p>
                      )}
                      <p>
                        {shippingInfo.shippingAddress.city},{" "}
                        {shippingInfo.shippingAddress.state}{" "}
                        {shippingInfo.shippingAddress.postcode}
                      </p>
                      <p>Canada</p>
                    </address>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="p-6">
              <h2 className="font-heading font-bold uppercase mb-4">What&apos;s Next?</h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-primary text-white text-small font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-small">Order Processing</p>
                    <p className="text-tiny text-gray-medium">
                      We&apos;re preparing your order for shipment
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gray-light text-gray-medium text-small font-bold flex items-center justify-center flex-shrink-0 border border-gray-border">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-small">Shipping</p>
                    <p className="text-tiny text-gray-medium">
                      You&apos;ll receive a tracking number via email
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gray-light text-gray-medium text-small font-bold flex items-center justify-center flex-shrink-0 border border-gray-border">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-small">Delivery</p>
                    <p className="text-tiny text-gray-medium">
                      Your order arrives at your doorstep
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} strokeWidth={1.5} />}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>

            <Button
              variant="outline"
              size="lg"
              leftIcon={<Printer size={18} strokeWidth={1.5} />}
              onClick={handlePrint}
            >
              Print Confirmation
            </Button>
          </div>

          {/* Account prompt for guests */}
          <div className="bg-black text-white p-6 text-center">
            <h3 className="font-heading font-bold uppercase mb-2">
              Create an Account
            </h3>
            <p className="text-small text-gray-light mb-4">
              Track your orders, save addresses, and checkout faster next time.
            </p>
            <Link
              href="/register"
              className={cn(
                "inline-flex items-center justify-center",
                "px-6 py-3 min-h-[44px]",
                "font-heading font-bold uppercase tracking-button text-small",
                "bg-white text-black hover:bg-gray-light",
                "transition-all duration-200"
              )}
            >
              Create Account
            </Link>
          </div>

          {/* Help Section */}
          <div className="text-center mt-8">
            <p className="text-small text-gray-dark mb-2">
              Questions about your order?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/faq"
                className="text-red-primary hover:underline text-small"
              >
                View FAQ
              </Link>
              <Link
                href="/contact"
                className="text-red-primary hover:underline text-small"
              >
                Contact Us
              </Link>
              <a
                href="tel:18005551234"
                className="text-red-primary hover:underline text-small"
              >
                Call 1-800-555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
