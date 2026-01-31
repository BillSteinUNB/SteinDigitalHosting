"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductAttribute } from "@/types/product";

// ============================================
// PRODUCT TABS COMPONENT
// ============================================

export type TabId = "description" | "additional" | "reviews";

export interface ProductTabsProps {
  description?: string;
  attributes?: ProductAttribute[];
  reviewCount?: number;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  children?: React.ReactNode; // For reviews content
  className?: string;
}

/**
 * ProductTabs Component
 *
 * Tabbed content area for product details:
 * - Description tab (HTML content)
 * - Additional Information tab (product attributes)
 * - Reviews tab (contains ProductReviews component)
 */
export default function ProductTabs({
  description,
  attributes,
  reviewCount = 0,
  activeTab: controlledTab,
  onTabChange,
  children,
  className,
}: ProductTabsProps) {
  const [internalTab, setInternalTab] = useState<TabId>("description");
  
  // Support both controlled and uncontrolled modes
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: TabId) => {
    onTabChange?.(tab);
    if (!controlledTab) {
      setInternalTab(tab);
    }
  };

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "description", label: "Description" },
    { id: "additional", label: "Additional Information" },
    { id: "reviews", label: "Reviews", count: reviewCount },
  ];

  return (
    <div className={cn("w-full", className)} id="product-tabs">
      {/* Tab Headers */}
      <div className="border-b border-gray-border">
        <div className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-4 text-small font-heading font-semibold uppercase tracking-wide",
                "border-b-2 transition-colors min-h-[52px]",
                activeTab === tab.id
                  ? "border-red-primary text-red-primary"
                  : "border-transparent text-gray-dark hover:text-black hover:border-gray-medium"
              )}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 text-gray-medium">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="py-8">
        {/* Description Tab */}
        <div
          role="tabpanel"
          id="tabpanel-description"
          aria-labelledby="tab-description"
          hidden={activeTab !== "description"}
        >
          {activeTab === "description" && (
            <DescriptionContent description={description} />
          )}
        </div>

        {/* Additional Information Tab */}
        <div
          role="tabpanel"
          id="tabpanel-additional"
          aria-labelledby="tab-additional"
          hidden={activeTab !== "additional"}
        >
          {activeTab === "additional" && (
            <AdditionalInfoContent attributes={attributes} />
          )}
        </div>

        {/* Reviews Tab */}
        <div
          role="tabpanel"
          id="tabpanel-reviews"
          aria-labelledby="tab-reviews"
          hidden={activeTab !== "reviews"}
        >
          {activeTab === "reviews" && children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DESCRIPTION CONTENT
// ============================================

interface DescriptionContentProps {
  description?: string;
}

function DescriptionContent({ description }: DescriptionContentProps) {
  if (!description) {
    return (
      <p className="text-body text-gray-medium italic">
        No description available for this product.
      </p>
    );
  }

  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-headings:text-black
        prose-p:text-gray-dark prose-p:leading-relaxed
        prose-ul:text-gray-dark prose-ol:text-gray-dark
        prose-li:marker:text-red-primary
        prose-strong:text-black
        prose-a:text-red-primary prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}

// ============================================
// ADDITIONAL INFO CONTENT
// ============================================

interface AdditionalInfoContentProps {
  attributes?: ProductAttribute[];
}

function AdditionalInfoContent({ attributes }: AdditionalInfoContentProps) {
  if (!attributes || attributes.length === 0) {
    return (
      <p className="text-body text-gray-medium italic">
        No additional information available for this product.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px] border-collapse">
        <tbody>
          {attributes.map((attr, index) => (
            <tr
              key={attr.name}
              className={cn(
                "border-b border-gray-border",
                index % 2 === 0 ? "bg-gray-light" : "bg-white"
              )}
            >
              <th
                scope="row"
                className="px-4 py-3 text-left text-small font-semibold text-black w-1/3"
              >
                {attr.name}
              </th>
              <td className="px-4 py-3 text-body text-gray-dark">
                {attr.options.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// ACCORDION TABS (Alternative for Mobile)
// ============================================

export interface AccordionTabsProps {
  description?: string;
  attributes?: ProductAttribute[];
  reviewCount?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * AccordionTabs Component
 *
 * Accordion-style tabs for mobile view.
 * Shows content in collapsible sections.
 */
export function AccordionTabs({
  description,
  attributes,
  reviewCount = 0,
  children,
  className,
}: AccordionTabsProps) {
  const [openSection, setOpenSection] = useState<TabId | null>("description");

  const toggleSection = (section: TabId) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className={cn("w-full divide-y divide-gray-border border-t border-b border-gray-border", className)}>
      {/* Description Accordion */}
      <AccordionSection
        title="Description"
        isOpen={openSection === "description"}
        onToggle={() => toggleSection("description")}
      >
        <DescriptionContent description={description} />
      </AccordionSection>

      {/* Additional Info Accordion */}
      <AccordionSection
        title="Additional Information"
        isOpen={openSection === "additional"}
        onToggle={() => toggleSection("additional")}
      >
        <AdditionalInfoContent attributes={attributes} />
      </AccordionSection>

      {/* Reviews Accordion */}
      <AccordionSection
        title={`Reviews (${reviewCount})`}
        isOpen={openSection === "reviews"}
        onToggle={() => toggleSection("reviews")}
      >
        {children}
      </AccordionSection>
    </div>
  );
}

// ============================================
// ACCORDION SECTION
// ============================================

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-body font-heading font-semibold uppercase">
          {title}
        </span>
        <span
          className={cn(
            "w-5 h-5 text-gray-dark transition-transform",
            isOpen && "rotate-180"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-6">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// SKELETON
// ============================================

export function ProductTabsSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Tab Headers */}
      <div className="border-b border-gray-border">
        <div className="flex gap-6 -mb-px">
          <div className="h-12 w-28 bg-gray-200" />
          <div className="h-12 w-44 bg-gray-200" />
          <div className="h-12 w-24 bg-gray-200" />
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8 space-y-4">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
