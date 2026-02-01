"use client";

import { Suspense } from "react";
import ShopPageContent from "./ShopPageContent";

// ============================================
// SHOP PAGE - With Suspense Boundary
// ============================================

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageContent />
    </Suspense>
  );
}

// ============================================
// SKELETON LOADING STATE
// ============================================

function ShopPageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header Skeleton */}
      <section className="bg-gray-light py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </aside>

          {/* Products Skeleton */}
          <div className="flex-1 min-w-0">
            {/* Toolbar Skeleton */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-border">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-72 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
