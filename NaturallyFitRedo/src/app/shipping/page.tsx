import { Metadata } from "next";
import Link from "next/link";
import { Truck, RefreshCw, Clock, MapPin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "Shipping & Returns | Naturally Fit",
  description:
    "Learn about our shipping options, delivery times, return policy, and how to initiate a return or exchange.",
};

// ============================================
// SECTION HEADING COMPONENT
// ============================================

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-heading font-bold uppercase text-black text-xl md:text-2xl",
        "flex items-center gap-3 mb-4",
        className
      )}
    >
      {children}
      <span className="w-2.5 h-2.5 bg-red-primary flex-shrink-0" aria-hidden="true" />
    </h2>
  );
}

// ============================================
// INFO CARD COMPONENT
// ============================================

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="bg-white p-6 border border-gray-border">
      <div className="w-12 h-12 bg-red-primary/10 flex items-center justify-center mb-4">
        <span className="text-red-primary">{icon}</span>
      </div>
      <h3 className="font-heading font-bold uppercase text-lg mb-2">{title}</h3>
      <p className="text-gray-dark">{description}</p>
    </div>
  );
}

// ============================================
// SHIPPING PAGE
// ============================================

export default function ShippingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
              Shipping & Returns
            </h1>
            <p className="text-gray-light">
              Everything you need to know about getting your supplements delivered and our
              hassle-free return policy.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={<Truck size={24} strokeWidth={1.5} />}
              title="Free Shipping"
              description="On all orders over $75 within Canada"
            />
            <InfoCard
              icon={<Clock size={24} strokeWidth={1.5} />}
              title="Same Day Processing"
              description="Orders placed before 2 PM MST"
            />
            <InfoCard
              icon={<RefreshCw size={24} strokeWidth={1.5} />}
              title="30-Day Returns"
              description="Easy returns on unopened products"
            />
            <InfoCard
              icon={<MapPin size={24} strokeWidth={1.5} />}
              title="In-Store Pickup"
              description="Ready within 2 hours at any location"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Shipping Section */}
            <div className="mb-16">
              <SectionHeading>Shipping Information</SectionHeading>

              {/* Shipping Rates */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                Shipping Rates
              </h3>
              <div className="bg-gray-light p-6 mb-6">
                <p className="text-lg font-heading uppercase text-red-primary mb-4">
                  Free Shipping on Orders Over $75!
                </p>
                <p className="text-gray-dark mb-4">
                  For orders under $75, the following rates apply:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-border">
                        <th className="py-3 pr-4 font-heading uppercase text-sm">
                          Shipping Method
                        </th>
                        <th className="py-3 pr-4 font-heading uppercase text-sm">
                          Delivery Time
                        </th>
                        <th className="py-3 font-heading uppercase text-sm">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-dark">
                      <tr className="border-b border-gray-border">
                        <td className="py-3 pr-4">Standard</td>
                        <td className="py-3 pr-4">5-7 business days</td>
                        <td className="py-3">$7.99</td>
                      </tr>
                      <tr className="border-b border-gray-border">
                        <td className="py-3 pr-4">Express</td>
                        <td className="py-3 pr-4">2-3 business days</td>
                        <td className="py-3">$12.99</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Priority</td>
                        <td className="py-3 pr-4">1-2 business days</td>
                        <td className="py-3">$19.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delivery Times */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                Estimated Delivery Times by Region
              </h3>
              <p className="text-gray-dark mb-4">
                Delivery times are estimates and depend on carrier performance. Times begin
                from when your order ships, not when it&apos;s placed.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-border">
                      <th className="py-3 pr-4 font-heading uppercase text-sm">Region</th>
                      <th className="py-3 font-heading uppercase text-sm">
                        Standard Delivery
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-dark">
                    <tr className="border-b border-gray-border">
                      <td className="py-3 pr-4">Alberta</td>
                      <td className="py-3">1-3 business days</td>
                    </tr>
                    <tr className="border-b border-gray-border">
                      <td className="py-3 pr-4">BC, Saskatchewan, Manitoba</td>
                      <td className="py-3">3-5 business days</td>
                    </tr>
                    <tr className="border-b border-gray-border">
                      <td className="py-3 pr-4">Ontario, Quebec</td>
                      <td className="py-3">5-7 business days</td>
                    </tr>
                    <tr className="border-b border-gray-border">
                      <td className="py-3 pr-4">Atlantic Provinces</td>
                      <td className="py-3">7-10 business days</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Territories</td>
                      <td className="py-3">10-14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Processing Time */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                Order Processing
              </h3>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-6">
                <li>
                  Orders placed <strong>before 2 PM MST</strong> (Monday-Friday) are
                  processed and shipped the same day
                </li>
                <li>
                  Orders placed after 2 PM MST or on weekends are processed the next
                  business day
                </li>
                <li>
                  You will receive a shipping confirmation email with tracking information
                  once your order ships
                </li>
              </ul>

              {/* In-Store Pickup */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                In-Store Pickup
              </h3>
              <p className="text-gray-dark mb-4">
                Choose &quot;In-Store Pickup&quot; at checkout for free pickup at any of
                our locations:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>Orders are typically ready within 2 hours during business hours</li>
                <li>
                  You&apos;ll receive an email notification when your order is ready
                </li>
                <li>
                  Please bring a valid ID and your order confirmation to collect your order
                </li>
                <li>Orders must be picked up within 7 days</li>
              </ul>
              <Link href="/contact#locations" className="text-red-primary hover:underline">
                View our store locations →
              </Link>
            </div>

            {/* Returns Section */}
            <div className="mb-16">
              <SectionHeading>Return Policy</SectionHeading>
              <p className="text-gray-dark mb-6">
                We want you to be completely satisfied with your purchase. If you&apos;re
                not happy, we&apos;re here to help.
              </p>

              {/* Return Eligibility */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                Return Eligibility
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-dark">Eligible for Return</p>
                    <ul className="text-gray-dark text-sm mt-1 space-y-1">
                      <li>• Unopened products in original packaging</li>
                      <li>• Returned within 30 days of delivery</li>
                      <li>• Products in resalable condition</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-dark">Not Eligible for Return</p>
                    <ul className="text-gray-dark text-sm mt-1 space-y-1">
                      <li>• Opened or used products (unless defective)</li>
                      <li>• Products returned after 30 days</li>
                      <li>• Clearance or final sale items</li>
                      <li>• Gift cards</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Return */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                How to Initiate a Return
              </h3>
              <div className="bg-gray-light p-6 mb-6">
                <ol className="list-decimal list-inside text-gray-dark space-y-4">
                  <li>
                    <strong>Log into your account</strong> and go to your Order History
                  </li>
                  <li>
                    <strong>Select the order</strong> containing the item(s) you wish to
                    return
                  </li>
                  <li>
                    <strong>Click &quot;Request Return&quot;</strong> and follow the
                    prompts to select items and reason
                  </li>
                  <li>
                    <strong>Print your prepaid return label</strong> (a $7.99 fee will be
                    deducted from your refund)
                  </li>
                  <li>
                    <strong>Package the item(s) securely</strong> and attach the label
                  </li>
                  <li>
                    <strong>Drop off at any Canada Post location</strong> within 14 days
                  </li>
                </ol>
              </div>

              <div className="flex gap-3 bg-yellow-50 border border-yellow-200 p-4 mb-6">
                <AlertCircle
                  size={20}
                  strokeWidth={1.5}
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-yellow-800">
                    Checked out as a guest?
                  </p>
                  <p className="text-yellow-800 text-sm">
                    Contact our support team at{" "}
                    <a
                      href="mailto:returns@naturallyfit.ca"
                      className="underline hover:no-underline"
                    >
                      returns@naturallyfit.ca
                    </a>{" "}
                    with your order number to initiate a return.
                  </p>
                </div>
              </div>

              {/* In-Store Returns */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                In-Store Returns
              </h3>
              <p className="text-gray-dark mb-4">
                You can also return items in person at any of our store locations:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>
                  Bring the item(s) in their original packaging with your receipt or order
                  confirmation
                </li>
                <li>No return shipping fee for in-store returns</li>
                <li>Refunds processed immediately to your original payment method</li>
              </ul>

              {/* Refunds */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                Refund Information
              </h3>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>
                  Refunds are processed within <strong>3-5 business days</strong> of
                  receiving your return
                </li>
                <li>
                  Refunds are credited to your original payment method
                </li>
                <li>
                  Allow an additional 5-10 business days for the refund to appear on your
                  statement
                </li>
                <li>
                  Original shipping costs are non-refundable unless the return is due to
                  our error
                </li>
                <li>
                  Return shipping label cost ($7.99) is deducted from your refund for
                  mail-in returns
                </li>
              </ul>

              {/* Defective Products */}
              <h3 className="font-heading font-bold uppercase text-lg mt-8 mb-4">
                Defective or Damaged Products
              </h3>
              <p className="text-gray-dark mb-4">
                If you received a defective or damaged product:
              </p>
              <ul className="list-disc list-inside text-gray-dark space-y-2 mb-4">
                <li>
                  Contact us within <strong>7 days</strong> of delivery
                </li>
                <li>
                  Include photos of the damage and your order number
                </li>
                <li>
                  We will arrange a free replacement or full refund, including shipping
                  costs
                </li>
                <li>
                  You may be asked to return the defective item (prepaid label provided)
                </li>
              </ul>
              <p className="text-gray-dark">
                Contact us at{" "}
                <a
                  href="mailto:support@naturallyfit.ca"
                  className="text-red-primary hover:underline"
                >
                  support@naturallyfit.ca
                </a>{" "}
                or call{" "}
                <a href="tel:18005551234" className="text-red-primary hover:underline">
                  1-800-555-1234
                </a>
                .
              </p>
            </div>

            {/* Exchanges */}
            <div className="mb-16">
              <SectionHeading>Exchanges</SectionHeading>
              <p className="text-gray-dark mb-4">
                We do not offer direct exchanges for online orders. To exchange a product:
              </p>
              <ol className="list-decimal list-inside text-gray-dark space-y-2 mb-4">
                <li>Return the original item for a refund (following the process above)</li>
                <li>Place a new order for the desired item</li>
              </ol>
              <p className="text-gray-dark">
                For in-store purchases, exchanges can be processed immediately at any of
                our locations.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-light p-6">
              <h3 className="font-heading font-bold uppercase text-lg mb-4">
                Questions About Shipping or Returns?
              </h3>
              <p className="text-gray-dark mb-4">
                Our customer service team is here to help Monday-Friday, 9 AM - 6 PM MST.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-6 py-3 min-h-[44px]",
                    "font-heading font-bold uppercase tracking-button text-small",
                    "bg-red-primary text-white hover:bg-red-hover",
                    "transition-all duration-200"
                  )}
                >
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-6 py-3 min-h-[44px]",
                    "font-heading font-bold uppercase tracking-button text-small",
                    "bg-transparent text-black border-2 border-black",
                    "hover:bg-black hover:text-white",
                    "transition-all duration-200"
                  )}
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
