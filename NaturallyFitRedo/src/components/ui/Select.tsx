"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// ============================================
// SELECT COMPONENT
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

/**
 * Select Component
 * 
 * Dropdown select following NF design system.
 * Sharp corners, custom arrow icon.
 * 
 * @example
 * <Select
 *   label="Sort By"
 *   options={[
 *     { value: "default", label: "Default sorting" },
 *     { value: "price-asc", label: "Price: Low to High" },
 *   ]}
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder,
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-small font-semibold text-black"
          >
            {label}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            className={cn(
              // Base styles
              "w-full px-4 py-3 pr-10 min-h-[44px]",
              "text-body font-body text-black",
              "bg-white border border-gray-border rounded-none",
              "appearance-none cursor-pointer",
              "transition-colors duration-200",
              // Focus state
              "focus:outline-none focus:border-black",
              // Error state
              hasError && "border-error focus:border-error",
              // Disabled state
              disabled && "bg-gray-light cursor-not-allowed opacity-60",
              className
            )}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom arrow icon */}
          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5",
              "text-gray-medium pointer-events-none",
              disabled && "opacity-60"
            )}
            strokeWidth={1.5}
          />
        </div>

        {/* Error message */}
        {hasError && (
          <p id={`${selectId}-error`} className="text-tiny text-error" role="alert">
            {error}
          </p>
        )}

        {/* Hint text */}
        {hint && !hasError && (
          <p id={`${selectId}-hint`} className="text-tiny text-gray-medium">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// ============================================
// NATIVE SELECT (Minimal styling)
// ============================================

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Native Select Component
 * 
 * Minimal select without label/error handling.
 * Use for inline selects like sort dropdowns.
 * 
 * @example
 * <NativeSelect
 *   options={sortOptions}
 *   value={sortBy}
 *   onChange={(e) => setSortBy(e.target.value)}
 * />
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, options, placeholder, disabled, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            "px-4 py-2 pr-8 min-h-[40px]",
            "text-small font-body text-black",
            "bg-white border border-gray-border rounded-none",
            "appearance-none cursor-pointer",
            "transition-colors duration-200",
            // Focus state
            "focus:outline-none focus:border-black",
            // Disabled state
            disabled && "bg-gray-light cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4",
            "text-gray-medium pointer-events-none",
            disabled && "opacity-60"
          )}
          strokeWidth={1.5}
        />
      </div>
    );
  }
);

NativeSelect.displayName = "NativeSelect";
