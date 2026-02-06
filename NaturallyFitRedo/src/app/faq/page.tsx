"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, Package, CreditCard, Truck, RefreshCw, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "font-heading font-bold uppercase text-black",
        "flex items-center gap-3",
        className
      )}
    >
      {children}
      <span className="w-3 h-3 bg-red-primary flex-shrink-0" aria-hidden="true" />
    </h2>
  );
}

// ============================================
// ACCORDION COMPONENT
// ============================================

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-border">
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between gap-4 py-5 text-left",
          "transition-colors hover:text-red-primary",
          isOpen && "text-red-primary"
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-heading font-bold uppercase text-sm md:text-base min-w-0">
          {question}
        </span>
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          className={cn(
            "flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[1000px] pb-5" : "max-h-0"
        )}
      >
        <div className="text-gray-dark leading-relaxed pr-8">{answer}</div>
      </div>
    </div>
  );
}

// ============================================
// FAQ CATEGORY COMPONENT
// ============================================

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategoryProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  items: FAQItem[];
}

function FAQCategory({ id, icon, title, items }: FAQCategoryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-red-primary">{icon}</span>
        </div>
        <h3 className="font-heading font-bold uppercase text-xl">{title}</h3>
      </div>
      <div className="border-t border-gray-border">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================
// FAQ DATA
// ============================================

const faqCategories: FAQCategoryProps[] = [
  {
    id: "orders",
    icon: <Package size={20} strokeWidth={1.5} />,
    title: "Orders & Products",
    items: [
      {
        question: "How do I place an order?",
        answer: (
          <>
            <p className="mb-3">
              Placing an order is easy! Simply browse our products, add items to your cart,
              and proceed to checkout. You can checkout as a guest or create an account for
              faster future purchases.
            </p>
            <p>
              Need help? Call us at{" "}
              <a href="tel:18005551234" className="text-red-primary hover:underline">
                1-800-555-1234
              </a>{" "}
              and we&apos;ll be happy to place your order over the phone.
            </p>
          </>
        ),
      },
      {
        question: "Can I modify or cancel my order?",
        answer: (
          <p>
            We process orders quickly, so please contact us immediately if you need to make
            changes. We can usually modify or cancel orders within 1 hour of placement.
            Once an order has shipped, it cannot be modified—you&apos;ll need to initiate a
            return instead.
          </p>
        ),
      },
      {
        question: "Do you have a price match guarantee?",
        answer: (
          <>
            <p className="mb-3">
              Yes! We match prices from any authorized Canadian retailer. Simply show us the
              competitor&apos;s current price (must be in-stock) and we&apos;ll match it.
            </p>
            <p>
              Price matching applies to identical products (same brand, size, and flavor).
              Some exclusions may apply for clearance items and limited-time promotions.
            </p>
          </>
        ),
      },
      {
        question: "Are your products authentic?",
        answer: (
          <p>
            Absolutely. We are an authorized retailer for all brands we carry. All products
            are sourced directly from manufacturers or their authorized Canadian
            distributors. We never sell gray market or counterfeit products.
          </p>
        ),
      },
      {
        question: "How do I know if a product is right for me?",
        answer: (
          <>
            <p className="mb-3">
              Our staff are trained nutrition experts who can help you find the right
              products for your goals. Visit us in-store, call us, or use the live chat
              feature on our website.
            </p>
            <p>
              We also provide detailed product descriptions, ingredient lists, and customer
              reviews to help you make informed decisions.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "shipping",
    icon: <Truck size={20} strokeWidth={1.5} />,
    title: "Shipping & Delivery",
    items: [
      {
        question: "How much does shipping cost?",
        answer: (
          <>
            <p className="mb-3">
              <strong>FREE shipping</strong> on all orders over $99 within Canada!
            </p>
            <p className="mb-3">For orders under $99:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Standard Shipping: $7.99 (5-7 business days)</li>
              <li>Express Shipping: $12.99 (2-3 business days)</li>
              <li>Priority Shipping: $19.99 (1-2 business days)</li>
            </ul>
            <p className="mt-3 text-small text-gray-medium">
              *Wholesale orders may be charged shipping after order review.
            </p>
          </>
        ),
      },
      {
        question: "How long will my order take to arrive?",
        answer: (
          <>
            <p className="mb-3">
              Orders placed before 2 PM MST (Monday-Friday) are processed the same day.
              Delivery times depend on your location and shipping method:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Alberta: 1-3 business days</li>
              <li>BC, Saskatchewan, Manitoba: 3-5 business days</li>
              <li>Ontario, Quebec: 5-7 business days</li>
              <li>Atlantic provinces & territories: 7-10 business days</li>
            </ul>
          </>
        ),
      },
      {
        question: "Do you ship internationally?",
        answer: (
          <p>
            Currently, we only ship within Canada. We&apos;re working on expanding our
            shipping options in the future. Sign up for our newsletter to be notified when
            international shipping becomes available.
          </p>
        ),
      },
      {
        question: "Can I pick up my order in-store?",
        answer: (
          <p>
            Yes! Select &quot;In-Store Pickup&quot; at checkout and choose your preferred
            location. Orders are usually ready within 2 hours. You&apos;ll receive an email
            when your order is ready for pickup. Bring a valid ID to collect your order.
          </p>
        ),
      },
      {
        question: "How do I track my order?",
        answer: (
          <p>
            Once your order ships, you&apos;ll receive a tracking number via email. You can
            also track your order by logging into your account and viewing your order
            history. If you checked out as a guest, use the tracking link in your shipping
            confirmation email.
          </p>
        ),
      },
    ],
  },
  {
    id: "returns",
    icon: <RefreshCw size={20} strokeWidth={1.5} />,
    title: "Returns & Exchanges",
    items: [
      {
        question: "What is your return policy?",
        answer: (
          <>
            <p className="mb-3">
              We offer a 30-day return policy on unopened products in their original
              packaging. Items must be in resalable condition.
            </p>
            <p>
              For defective or damaged products, please contact us within 7 days of
              delivery and we&apos;ll arrange a replacement or full refund.
            </p>
          </>
        ),
      },
      {
        question: "How do I return a product?",
        answer: (
          <>
            <p className="mb-3">To initiate a return:</p>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              <li>Log into your account and go to Order History</li>
              <li>Select the order and click &quot;Request Return&quot;</li>
              <li>Follow the instructions to print your return label</li>
              <li>Ship the item back within 14 days</li>
            </ol>
            <p>
              You can also return items in-person at any of our store locations with your
              receipt or order confirmation.
            </p>
          </>
        ),
      },
      {
        question: "When will I receive my refund?",
        answer: (
          <p>
            Once we receive and inspect your return, refunds are processed within 3-5
            business days. The refund will be credited to your original payment method.
            Please allow an additional 5-10 business days for the refund to appear on your
            statement, depending on your financial institution.
          </p>
        ),
      },
      {
        question: "Can I exchange a product?",
        answer: (
          <p>
            We don&apos;t offer direct exchanges online. To exchange a product, please
            return the original item for a refund and place a new order for the desired
            item. For in-store exchanges, visit any of our locations with your receipt.
          </p>
        ),
      },
    ],
  },
  {
    id: "payment",
    icon: <CreditCard size={20} strokeWidth={1.5} />,
    title: "Payment & Security",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: (
          <>
            <p className="mb-3">We accept the following payment methods:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Visa, Mastercard, American Express</li>
              <li>PayPal</li>
              <li>Apple Pay & Google Pay</li>
              <li>Interac e-Transfer (for phone orders)</li>
              <li>Afterpay (buy now, pay later)</li>
            </ul>
          </>
        ),
      },
      {
        question: "Is my payment information secure?",
        answer: (
          <p>
            Yes, we take security seriously. Our website uses SSL encryption to protect
            your data. We are PCI-DSS compliant and never store your full credit card
            information on our servers. All payments are processed through secure,
            industry-leading payment processors.
          </p>
        ),
      },
      {
        question: "Do you offer financing or payment plans?",
        answer: (
          <p>
            Yes! We&apos;ve partnered with Afterpay to offer interest-free payment plans.
            Split your purchase into 4 equal payments with no hidden fees. Select Afterpay
            at checkout to see if you qualify.
          </p>
        ),
      },
    ],
  },
  {
    id: "account",
    icon: <User size={20} strokeWidth={1.5} />,
    title: "Account & Wholesale",
    items: [
      {
        question: "What are the benefits of creating an account?",
        answer: (
          <>
            <p className="mb-3">Account holders enjoy:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Faster checkout with saved addresses and payment methods</li>
              <li>Order history and easy reordering</li>
              <li>Exclusive member-only promotions</li>
              <li>Wishlist to save products for later</li>
              <li>Early access to sales and new products</li>
            </ul>
          </>
        ),
      },
      {
        question: "How do I apply for a wholesale account?",
        answer: (
          <>
            <p className="mb-3">
              Our wholesale program is available for gyms, fitness studios, retailers, and
              health professionals. Benefits include:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Discounted pricing (up to 40% off retail)</li>
              <li>Dedicated account manager</li>
              <li>Priority shipping</li>
              <li>Net-30 payment terms for qualified accounts</li>
            </ul>
            <p>
              <Link href="/wholesale" className="text-red-primary hover:underline">
                Apply for a wholesale account →
              </Link>
            </p>
          </>
        ),
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: (
          <p>
            Click &quot;Forgot Password&quot; on the login page and enter your email
            address. You&apos;ll receive a password reset link within a few minutes. If
            you don&apos;t see the email, check your spam folder or contact our support
            team for assistance.
          </p>
        ),
      },
    ],
  },
];

// ============================================
// FAQ PAGE
// ============================================

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search
  const filteredCategories = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0)
    : faqCategories;

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold uppercase text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-light mb-8">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search
                size={20}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-medium pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-4 min-h-[52px]",
                  "text-body font-body text-black",
                  "bg-white border-0 rounded-none",
                  "placeholder:text-gray-medium",
                  "focus:outline-none focus:ring-2 focus:ring-red-primary"
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-light py-8 border-b border-gray-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2",
                  "font-heading text-sm uppercase tracking-wide",
                  "bg-white border border-gray-border",
                  "hover:border-black hover:bg-black hover:text-white",
                  "transition-colors"
                )}
              >
                {category.icon}
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-16">
                {filteredCategories.map((category) => (
                  <FAQCategory key={category.id} {...category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle size={48} strokeWidth={1.5} className="mx-auto text-gray-medium mb-4" />
                <p className="text-lg text-gray-dark mb-4">
                  No questions found matching &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-red-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-gray-light py-16">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading className="text-2xl md:text-3xl justify-center mb-4">
            Still Have Questions?
          </SectionHeading>
          <p className="text-gray-dark max-w-2xl mx-auto mb-8">
            Can&apos;t find what you&apos;re looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button",
                "bg-red-primary text-white hover:bg-red-hover",
                "transition-all duration-200"
              )}
            >
              Contact Us
            </Link>
            <a
              href="tel:18005551234"
              className={cn(
                "inline-flex items-center justify-center",
                "px-8 py-4 min-h-[52px]",
                "font-heading font-bold uppercase tracking-button",
                "bg-transparent text-black border-2 border-black",
                "hover:bg-black hover:text-white",
                "transition-all duration-200"
              )}
            >
              Call 1-800-555-1234
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
