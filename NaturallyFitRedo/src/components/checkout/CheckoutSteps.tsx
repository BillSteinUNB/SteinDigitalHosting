"use client";

// ============================================
// CHECKOUT STEPS INDICATOR
// ============================================

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckoutStore, type CheckoutStep } from "@/stores/checkout-store";

// ============================================
// TYPES
// ============================================

interface StepConfig {
  id: CheckoutStep;
  label: string;
  shortLabel: string;
}

const steps: StepConfig[] = [
  { id: "information", label: "Information", shortLabel: "Info" },
  { id: "shipping", label: "Shipping", shortLabel: "Ship" },
  { id: "payment", label: "Payment", shortLabel: "Pay" },
  { id: "review", label: "Review", shortLabel: "Review" },
];

// ============================================
// CHECKOUT STEPS COMPONENT
// ============================================

export function CheckoutSteps() {
  const { currentStep, completedSteps, setStep } = useCheckoutStore();

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || index <= currentIndex;

          return (
            <li key={step.id} className="relative flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-5 -left-1/2 w-full h-0.5 -z-10",
                    "hidden sm:block",
                    index <= currentIndex ? "bg-red-primary" : "bg-gray-border"
                  )}
                />
              )}

              {/* Step button */}
              <button
                type="button"
                onClick={() => isClickable && setStep(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center w-full",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed"
                )}
              >
                {/* Step circle */}
                <span
                  className={cn(
                    "w-10 h-10 flex items-center justify-center",
                    "font-heading font-bold text-small",
                    "transition-colors duration-200",
                    isCompleted
                      ? "bg-red-primary text-white"
                      : isCurrent
                        ? "bg-black text-white"
                        : "bg-gray-light text-gray-medium border border-gray-border"
                  )}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={2} />
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    "mt-2 text-tiny uppercase tracking-wide",
                    "hidden sm:block",
                    isCurrent || isCompleted
                      ? "text-black font-semibold"
                      : "text-gray-medium"
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    "mt-2 text-tiny uppercase tracking-wide",
                    "sm:hidden",
                    isCurrent || isCompleted
                      ? "text-black font-semibold"
                      : "text-gray-medium"
                  )}
                >
                  {step.shortLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default CheckoutSteps;
