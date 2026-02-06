"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { NativeSelect } from "@/components/ui";
import type { ProductAttribute, ProductVariation } from "@/types/product";

// ============================================
// PRODUCT VARIATIONS COMPONENT
// ============================================

export interface ProductVariationsProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  selectedAttributes: Record<string, string>;
  onAttributeChange: (attributeName: string, value: string) => void;
  className?: string;
}

function normalizeAttributeName(name: string): string {
  return name.toLowerCase().replace(/^pa_/, "").replace(/[^a-z0-9]/g, "");
}

function getSelectedAttributeValue(
  selectedAttributes: Record<string, string>,
  attributeName: string
): string | undefined {
  if (selectedAttributes[attributeName]) {
    return selectedAttributes[attributeName];
  }

  const normalizedTarget = normalizeAttributeName(attributeName);
  for (const [key, value] of Object.entries(selectedAttributes)) {
    if (normalizeAttributeName(key) === normalizedTarget) {
      return value;
    }
  }

  return undefined;
}

/**
 * ProductVariations Component
 *
 * Handles variation selection for variable products.
 * Features:
 * - Dropdown selects for each attribute (Size, Flavor, etc.)
 * - Disables out-of-stock combinations
 * - Shows stock status for selected variation
 */
export default function ProductVariations({
  attributes,
  variations,
  selectedAttributes,
  onAttributeChange,
  className,
}: ProductVariationsProps) {
  // Get available options for each attribute based on current selections
  const getAvailableOptions = useMemo(() => {
    return (attributeName: string): { value: string; disabled: boolean; outOfStock: boolean }[] => {
      const attribute = attributes.find((a) => a.name === attributeName);
      if (!attribute) return [];

      return attribute.options.map((option) => {
        // Check if this option is available with current other selections
        const testSelection = { ...selectedAttributes, [attributeName]: option };
        
        // Find matching variation
        const matchingVariation = variations.find((variation) =>
          variation.attributes.every((attr) => {
            const selectedValue = getSelectedAttributeValue(testSelection, attr.name);
            // If no value selected for this attribute, any value is valid
            if (!selectedValue) return true;
            return attr.value === selectedValue;
          })
        );

        const isOutOfStock = matchingVariation?.stockStatus === "OUT_OF_STOCK";
        const isAvailable = matchingVariation !== undefined;

        return {
          value: option,
          disabled: !isAvailable,
          outOfStock: isOutOfStock,
        };
      });
    };
  }, [attributes, variations, selectedAttributes]);

  // Get the currently selected variation
  const selectedVariation = useMemo(() => {
    // Check if all attributes are selected
    const allSelected = attributes
      .filter((attr) => attr.variation)
      .every((attr) => Boolean(getSelectedAttributeValue(selectedAttributes, attr.name)));
    if (!allSelected) return null;

    return variations.find((variation) =>
      variation.attributes.every(
        (attr) => attr.value === getSelectedAttributeValue(selectedAttributes, attr.name)
      )
    );
  }, [attributes, variations, selectedAttributes]);

  if (attributes.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {attributes
        .filter((attr) => attr.variation) // Only show variation attributes
        .map((attribute) => {
          const options = getAvailableOptions(attribute.name);

          return (
            <div key={attribute.name} className="flex flex-col gap-2">
              <label
                htmlFor={`variation-${attribute.name}`}
                className="text-small font-semibold text-black uppercase tracking-wide"
              >
                {attribute.name}
                {selectedAttributes[attribute.name] && (
                  <span className="font-normal text-gray-dark ml-2">
                    : {selectedAttributes[attribute.name]}
                  </span>
                )}
              </label>

              <NativeSelect
                id={`variation-${attribute.name}`}
                value={selectedAttributes[attribute.name] || ""}
                onChange={(e) => onAttributeChange(attribute.name, e.target.value)}
                placeholder={`Choose ${attribute.name}`}
                options={options.map((opt) => ({
                  value: opt.value,
                  label: opt.outOfStock ? `${opt.value} (Out of Stock)` : opt.value,
                  disabled: opt.disabled,
                }))}
                className="w-full md:w-auto md:min-w-[200px]"
              />
            </div>
          );
        })}

      {/* Selected Variation Info */}
      {selectedVariation && (
        <SelectedVariationInfo variation={selectedVariation} />
      )}
    </div>
  );
}

// ============================================
// SELECTED VARIATION INFO
// ============================================

interface SelectedVariationInfoProps {
  variation: ProductVariation;
}

function SelectedVariationInfo({ variation }: SelectedVariationInfoProps) {
  const isOutOfStock = variation.stockStatus === "OUT_OF_STOCK";

  return (
    <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-gray-light border-l-4 border-red-primary">
      {/* Price for selected variation */}
      <div className="flex items-center gap-2">
        <span className="text-small text-gray-medium">Price:</span>
        {variation.salePrice ? (
          <>
            <span className="text-body font-bold text-red-primary">
              {variation.salePrice}
            </span>
            <span className="text-small text-gray-medium line-through">
              {variation.regularPrice}
            </span>
          </>
        ) : (
          <span className="text-body font-bold text-black">
            {variation.price}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className="text-small text-gray-medium">Availability:</span>
        {isOutOfStock ? (
          <span className="text-small font-semibold text-error">Out of Stock</span>
        ) : (
          <span className="text-small font-semibold text-success">In Stock</span>
        )}
      </div>
    </div>
  );
}

// ============================================
// VARIATION SELECTOR BUTTONS (Alternative Style)
// ============================================

export interface VariationButtonsProps {
  attributeName: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabledOptions?: string[];
  className?: string;
}

/**
 * VariationButtons Component
 *
 * Alternative button-based variation selector.
 * Good for fewer options like Size (S, M, L, XL).
 */
export function VariationButtons({
  attributeName,
  options,
  selectedValue,
  onChange,
  disabledOptions = [],
  className,
}: VariationButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-small font-semibold text-black uppercase tracking-wide">
        {attributeName}
        {selectedValue && (
          <span className="font-normal text-gray-dark ml-2">: {selectedValue}</span>
        )}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isDisabled = disabledOptions.includes(option);
          const isSelected = option === selectedValue;

          return (
            <button
              key={option}
              type="button"
              onClick={() => !isDisabled && onChange(option)}
              disabled={isDisabled}
              className={cn(
                "px-4 py-2 min-w-[44px] min-h-[44px]",
                "text-small font-semibold",
                "border transition-colors",
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-border hover:border-black",
                isDisabled && "opacity-50 cursor-not-allowed line-through"
              )}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// SKELETON
// ============================================

export function ProductVariationsSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* First attribute */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-10 w-48 bg-gray-200 rounded" />
      </div>

      {/* Second attribute */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-10 w-48 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
