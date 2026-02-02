import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ============================================
// INPUT COMPONENT
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Input Component
 * 
 * Text input following NF design system.
 * Sharp corners, proper focus states, error handling.
 * 
 * @example
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * <Input error="This field is required" />
 * <Input leftIcon={<Search />} placeholder="Search products..." />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-small font-semibold text-black"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              // Base styles
              "w-full px-4 py-3 min-h-[44px]",
              "text-body font-body text-black",
              "bg-white border border-gray-border rounded-none",
              "placeholder:text-gray-medium",
              "transition-colors duration-200",
              // Focus state
              "focus:outline-none focus:border-black",
              // Error state
              hasError && "border-error focus:border-error",
              // Disabled state
              disabled && "bg-gray-light cursor-not-allowed opacity-60",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p id={`${inputId}-error`} className="text-tiny text-error" role="alert">
            {error}
          </p>
        )}

        {/* Hint text */}
        {hint && !hasError && (
          <p id={`${inputId}-hint`} className="text-tiny text-gray-medium">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ============================================
// TEXTAREA COMPONENT
// ============================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

/**
 * Textarea Component
 * 
 * Multi-line text input following NF design system.
 * 
 * @example
 * <Textarea label="Message" placeholder="Enter your message" rows={4} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      fullWidth = true,
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="text-small font-semibold text-black"
          >
            {label}
          </label>
        )}

        {/* Textarea field */}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          className={cn(
            // Base styles
            "w-full px-4 py-3",
            "text-body font-body text-black",
            "bg-white border border-gray-border rounded-none",
            "placeholder:text-gray-medium",
            "transition-colors duration-200",
            "resize-vertical min-h-[100px]",
            // Focus state
            "focus:outline-none focus:border-black",
            // Error state
            hasError && "border-error focus:border-error",
            // Disabled state
            disabled && "bg-gray-light cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        />

        {/* Error message */}
        {hasError && (
          <p id={`${textareaId}-error`} className="text-tiny text-error" role="alert">
            {error}
          </p>
        )}

        {/* Hint text */}
        {hint && !hasError && (
          <p id={`${textareaId}-hint`} className="text-tiny text-gray-medium">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ============================================
// SEARCH INPUT COMPONENT
// ============================================

export interface SearchInputProps extends Omit<InputProps, "type" | "leftIcon"> {
  onSearch?: (value: string) => void;
}

/**
 * Search Input Component
 * 
 * Specialized input for search functionality.
 * Rounded borders (exception to sharp corners rule for search).
 * 
 * @example
 * <SearchInput placeholder="Search products..." onSearch={handleSearch} />
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(e.currentTarget.value);
      }
      onKeyDown?.(e);
    };

    return (
      <div className="relative">
        {/* Search icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a] pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>

        <input
          ref={ref}
          type="search"
          onKeyDown={handleKeyDown}
          className={cn(
            // Base styles
            "w-full pl-4 pr-10 py-2.5 min-h-[40px]",
            "text-small font-body text-[#464646]",
            "bg-white border border-[#cfcfcf] rounded-full",
            "placeholder:text-[#9a9a9a]",
            "transition-colors duration-200",
            // Focus state
            "focus:outline-none focus:border-black",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
