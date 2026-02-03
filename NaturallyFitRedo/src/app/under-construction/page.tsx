import { Metadata } from "next";
import Link from "next/link";
import { Construction, ArrowLeft, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Under Construction | Naturally Fit",
  description: "This page is currently under construction. Please check back soon!",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Construction size={48} className="text-red-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold uppercase text-black mb-4">
          Page Under Construction
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          We&apos;re working hard to bring you something amazing! 
          This page is currently being built and will be available soon.
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-none mb-8">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-yellow-800">
            Coming Soon
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-heading font-bold uppercase tracking-wide bg-red-primary text-white hover:bg-red-hover transition-colors"
          >
            <Home size={18} strokeWidth={1.5} />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-heading font-bold uppercase tracking-wide bg-transparent text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Browse Shop
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-2">
            Have questions in the meantime?
          </p>
          <Link
            href="/contact"
            className="text-red-primary hover:underline font-medium"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </main>
  );
}
