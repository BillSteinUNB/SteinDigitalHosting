"use client";

// ============================================
// CHECKOUT PAYMENT FORM
// ============================================

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, CreditCard, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCheckoutStore } from "@/stores/checkout-store";

// ============================================
// VALIDATION SCHEMA
// ============================================

const paymentSchema = z.object({
  paymentMethod: z.enum(["credit_card", "paypal", "afterpay"]),
  // Credit card fields (only validated if credit_card is selected)
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  savePaymentMethod: z.boolean(),
}).refine((data) => {
  if (data.paymentMethod === "credit_card") {
    return (
      data.cardName && data.cardName.length >= 2 &&
      data.cardNumber && data.cardNumber.replace(/\s/g, "").length >= 15 &&
      data.cardExpiry && /^\d{2}\/\d{2}$/.test(data.cardExpiry) &&
      data.cardCvc && data.cardCvc.length >= 3
    );
  }
  return true;
}, {
  message: "Please fill in all card details",
  path: ["cardNumber"],
});

type PaymentFormData = z.infer<typeof paymentSchema>;

// ============================================
// PAYMENT METHOD OPTION
// ============================================

interface PaymentOptionProps {
  id: "credit_card" | "paypal" | "afterpay";
  label: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

function PaymentOption({
  id,
  label,
  description,
  icon,
  isSelected,
  onSelect,
  children,
}: PaymentOptionProps) {
  return (
    <div
      className={cn(
        "border transition-colors",
        isSelected ? "border-red-primary" : "border-gray-border"
      )}
    >
      <label
        className={cn(
          "flex items-start gap-4 p-4 cursor-pointer",
          isSelected && "bg-red-primary/5"
        )}
      >
        <input
          type="radio"
          name="paymentMethod"
          value={id}
          checked={isSelected}
          onChange={onSelect}
          className="mt-1 w-5 h-5 accent-red-primary"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold">{label}</span>
          </div>
          <p className="text-small text-gray-medium mt-1">{description}</p>
        </div>
      </label>

      {/* Expanded content when selected */}
      {isSelected && children && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-border bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export function CheckoutPayment() {
  const { paymentInfo, updatePaymentInfo, goToNextStep, goToPreviousStep } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: paymentInfo.paymentMethod,
      cardName: paymentInfo.cardName || "",
      cardNumber: paymentInfo.cardNumber || "",
      cardExpiry: paymentInfo.cardExpiry || "",
      cardCvc: paymentInfo.cardCvc || "",
      savePaymentMethod: paymentInfo.savePaymentMethod,
    },
  });

  const selectedMethod = watch("paymentMethod");

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const onSubmit = (data: PaymentFormData) => {
    updatePaymentInfo({
      paymentMethod: data.paymentMethod,
      cardName: data.cardName,
      cardNumber: data.cardNumber,
      cardExpiry: data.cardExpiry,
      cardCvc: data.cardCvc,
      savePaymentMethod: data.savePaymentMethod,
    });
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="font-heading font-bold uppercase text-xl mb-6">
          Payment Method
        </h2>

        {/* Security note */}
        <div className="flex items-center gap-2 p-3 bg-gray-light mb-6">
          <Lock size={16} strokeWidth={1.5} className="text-gray-medium flex-shrink-0" />
          <span className="text-small text-gray-dark">
            Your payment information is encrypted and secure
          </span>
        </div>

        {errors.cardNumber && (
          <div className="flex items-center gap-2 p-3 bg-error/10 border border-error mb-6">
            <AlertCircle size={16} strokeWidth={1.5} className="text-error flex-shrink-0" />
            <span className="text-small text-error">{errors.cardNumber.message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Credit Card */}
          <PaymentOption
            id="credit_card"
            label="Credit Card"
            description="Visa, Mastercard, American Express"
            icon={
              <div className="flex items-center gap-1">
                <div className="w-8 h-5 bg-gray-light flex items-center justify-center border border-gray-border">
                  <CreditCard size={14} strokeWidth={1.5} />
                </div>
              </div>
            }
            isSelected={selectedMethod === "credit_card"}
            onSelect={() => setValue("paymentMethod", "credit_card")}
          >
            <div className="space-y-4 pt-2">
              <Input
                label="Name on Card *"
                placeholder="John Smith"
                {...register("cardName")}
              />

              <Input
                label="Card Number *"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                {...register("cardNumber", {
                  onChange: (e) => {
                    e.target.value = formatCardNumber(e.target.value);
                  },
                })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date *"
                  placeholder="MM/YY"
                  maxLength={5}
                  {...register("cardExpiry", {
                    onChange: (e) => {
                      e.target.value = formatExpiry(e.target.value);
                    },
                  })}
                />
                <Input
                  label="CVC *"
                  placeholder="123"
                  maxLength={4}
                  type="password"
                  {...register("cardCvc")}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-red-primary"
                  {...register("savePaymentMethod")}
                />
                <span className="text-small">Save card for future purchases</span>
              </label>
            </div>
          </PaymentOption>

          {/* PayPal */}
          <PaymentOption
            id="paypal"
            label="PayPal"
            description="Pay securely with your PayPal account"
            icon={
              <div className="w-16 h-5 bg-[#003087] flex items-center justify-center px-1">
                <span className="text-white text-xs font-bold">PayPal</span>
              </div>
            }
            isSelected={selectedMethod === "paypal"}
            onSelect={() => setValue("paymentMethod", "paypal")}
          >
            <p className="text-small text-gray-dark pt-2">
              You will be redirected to PayPal to complete your payment securely.
            </p>
          </PaymentOption>

          {/* Afterpay */}
          <PaymentOption
            id="afterpay"
            label="Afterpay"
            description="Pay in 4 interest-free installments"
            icon={
              <div className="w-16 h-5 bg-[#b2fce4] flex items-center justify-center px-1">
                <span className="text-black text-xs font-bold">Afterpay</span>
              </div>
            }
            isSelected={selectedMethod === "afterpay"}
            onSelect={() => setValue("paymentMethod", "afterpay")}
          >
            <div className="pt-2">
              <p className="text-small text-gray-dark mb-3">
                Split your purchase into 4 interest-free payments. No fees when you pay on time.
              </p>
              <div className="flex items-center gap-2 p-2 bg-gray-light">
                <span className="text-tiny text-gray-medium">
                  You will be redirected to Afterpay to complete your purchase.
                </span>
              </div>
            </div>
          </PaymentOption>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="border-t border-gray-border pt-6">
        <p className="text-small text-gray-medium mb-3">We accept:</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-2 bg-gray-light border border-gray-border text-tiny font-semibold">
            VISA
          </div>
          <div className="px-3 py-2 bg-gray-light border border-gray-border text-tiny font-semibold">
            MASTERCARD
          </div>
          <div className="px-3 py-2 bg-gray-light border border-gray-border text-tiny font-semibold">
            AMEX
          </div>
          <div className="px-3 py-2 bg-gray-light border border-gray-border text-tiny font-semibold">
            PAYPAL
          </div>
          <div className="px-3 py-2 bg-gray-light border border-gray-border text-tiny font-semibold">
            AFTERPAY
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          leftIcon={<ArrowLeft size={18} strokeWidth={1.5} />}
          onClick={goToPreviousStep}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} strokeWidth={1.5} />}
          className="sm:ml-auto"
        >
          Review Order
        </Button>
      </div>
    </form>
  );
}

export default CheckoutPayment;
