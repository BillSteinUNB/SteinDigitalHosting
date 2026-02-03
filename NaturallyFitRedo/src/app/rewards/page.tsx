import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { replaceWordPressBase } from "@/lib/config/wordpress";

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  title: "NF Rewards Program | Naturally Fit",
  description:
    "Earn NF Bucks on every purchase. Our rewards program lets you save on future orders.",
};

// ============================================
// WORDPRESS IMAGE REFERENCES
// ============================================

const WP_IMAGES = {
  // NF Rewards page images from WordPress
  rewardsHero: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2020/07/rewards.jpg"),
  nfBucks: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2020/07/nf-bucks-add-to-cart.png"),
};

// ============================================
// NF REWARDS PAGE
// ============================================

export default function RewardsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={WP_IMAGES.rewardsHero}
            alt="NF Rewards Program"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="text-red-primary font-heading uppercase tracking-wider mb-4">
              Earn While You Shop
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white mb-6">
              NF Rewards Program
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Join our rewards program and earn NF Bucks on every purchase.
              Save money on the supplements you love.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 border border-gray-200">
              <div className="w-16 h-16 bg-red-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">Shop</h3>
              <p className="text-gray-600">
                Make purchases online or in-store at any Naturally Fit location.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 border border-gray-200">
              <div className="w-16 h-16 bg-red-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">Earn</h3>
              <p className="text-gray-600">
                Earn NF Bucks on every dollar you spend. Points add up fast!
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 border border-gray-200">
              <div className="w-16 h-16 bg-red-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-heading font-bold uppercase mb-2">Save</h3>
              <p className="text-gray-600">
                Redeem your NF Bucks for discounts on future purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NF Bucks Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto">
              <Image
                src={WP_IMAGES.nfBucks}
                alt="NF Bucks"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-6">
                What Are NF Bucks?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                NF Bucks are our way of saying thank you for shopping with us. Every purchase
                earns you points that can be redeemed for real savings on your next order.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-primary font-bold">+</span>
                  Earn points on every purchase
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-primary font-bold">+</span>
                  No expiration on earned points
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-primary font-bold">+</span>
                  Exclusive member-only promotions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-primary font-bold">+</span>
                  Birthday bonus rewards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-4">
            Start Earning Today
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Create an account to automatically start earning NF Bucks on every purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold uppercase tracking-wide bg-white text-black hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold uppercase tracking-wide bg-transparent text-white border-2 border-white hover:bg-white hover:text-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
