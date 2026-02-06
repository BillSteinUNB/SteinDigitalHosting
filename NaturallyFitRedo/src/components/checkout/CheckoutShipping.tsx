"use client";

// ============================================
// CHECKOUT SHIPPING FORM
// ============================================

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Truck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCartStore } from "@/stores/cart-store";

// ============================================
// PROVINCE OPTIONS
// ============================================

const provinceOptions = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

// ============================================
// VALIDATION SCHEMA
// ============================================

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "Province is required"),
  postcode: z.string().min(1, "Postal code is required"),
  country: z.string().default("CA"),
});

const shippingSchema = z.object({
  shippingAddress: addressSchema,
  sameAsShipping: z.boolean(),
  billingAddress: addressSchema.optional(),
  shippingMethod: z.string().min(1, "Please select a shipping method"),
  shippingNotes: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

// ============================================
// ADDRESS FORM COMPONENT
// ============================================

interface AddressFormProps {
  prefix: "shippingAddress" | "billingAddress";
  register: ReturnType<typeof useForm<ShippingFormData>>["register"];
  errors: ReturnType<typeof useForm<ShippingFormData>>["formState"]["errors"];
}

function AddressForm({ prefix, register, errors }: AddressFormProps) {
  const addressErrors = prefix === "shippingAddress" 
    ? errors.shippingAddress 
    : errors.billingAddress;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="John"
          error={addressErrors?.firstName?.message}
          {...register(`${prefix}.firstName`)}
        />
        <Input
          label="Last Name *"
          placeholder="Smith"
          error={addressErrors?.lastName?.message}
          {...register(`${prefix}.lastName`)}
        />
      </div>

      <Input
        label="Company (optional)"
        placeholder="Company name"
        {...register(`${prefix}.company`)}
      />

      <Input
        label="Address *"
        placeholder="123 Main Street"
        error={addressErrors?.address1?.message}
        {...register(`${prefix}.address1`)}
      />

      <Input
        label="Apartment, suite, etc. (optional)"
        placeholder="Apt 4B"
        {...register(`${prefix}.address2`)}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Input
          label="City *"
          placeholder="Edmonton"
          error={addressErrors?.city?.message}
          {...register(`${prefix}.city`)}
        />
        <Select
          label="Province *"
          placeholder="Select"
          options={provinceOptions}
          error={addressErrors?.state?.message}
          {...register(`${prefix}.state`)}
        />
        <Input
          label="Postal Code *"
          placeholder="T5J 2R4"
          error={addressErrors?.postcode?.message}
          {...register(`${prefix}.postcode`)}
        />
      </div>
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export function CheckoutShipping() {
  const { shippingInfo, updateShippingInfo, goToNextStep, goToPreviousStep } = useCheckoutStore();
  const { cart, setShippingMethod } = useCartStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingAddress: shippingInfo.shippingAddress,
      billingAddress: shippingInfo.billingAddress,
      sameAsShipping: shippingInfo.sameAsShipping,
      shippingMethod: shippingInfo.shippingMethod || cart.selectedShippingMethod || "",
      shippingNotes: shippingInfo.shippingNotes || "",
    },
  });

  const sameAsShipping = watch("sameAsShipping");
  const selectedShippingMethod = watch("shippingMethod");

  // Free shipping policy: orders over $99
  const freeShippingMinimum = 100;
  const qualifiesForFreeShipping = cart.subtotal >= freeShippingMinimum;

  const onSubmit = (data: ShippingFormData) => {
    updateShippingInfo({
      shippingAddress: data.shippingAddress,
      billingAddress: data.sameAsShipping ? data.shippingAddress : data.billingAddress,
      sameAsShipping: data.sameAsShipping,
      shippingMethod: data.shippingMethod,
      shippingNotes: data.shippingNotes,
    });
    
    // Update cart shipping method
    setShippingMethod(data.shippingMethod);
    
    goToNextStep();
  };

  // Debug: log validation errors
  const onError = (formErrors: typeof errors) => {
    console.error("Shipping form validation errors:", formErrors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
      {/* Validation Error Summary */}
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error">
          <AlertCircle size={20} strokeWidth={1.5} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-error">Please fix the following errors:</p>
            <ul className="text-small text-error mt-1 list-disc list-inside">
              {errors.shippingAddress && <li>Shipping address has missing fields</li>}
              {errors.billingAddress && <li>Billing address has missing fields</li>}
              {errors.shippingMethod && <li>Please select a shipping method</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Shipping Address */}
      <div>
        <h2 className="font-heading font-bold uppercase text-xl mb-6">
          Shipping Address
        </h2>
        <AddressForm prefix="shippingAddress" register={register} errors={errors} />
      </div>

      {/* Billing Address */}
      <div className="border-t border-gray-border pt-8">
        <h2 className="font-heading font-bold uppercase text-xl mb-6">
          Billing Address
        </h2>

        <label className="flex items-center gap-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            className="w-5 h-5 accent-red-primary"
            {...register("sameAsShipping")}
          />
          <span className="text-small">Same as shipping address</span>
        </label>

        {!sameAsShipping && (
          <AddressForm prefix="billingAddress" register={register} errors={errors} />
        )}
      </div>

      {/* Shipping Method */}
      <div className="border-t border-gray-border pt-8">
        <h2 className="font-heading font-bold uppercase text-xl mb-6">
          Shipping Method
        </h2>

        {errors.shippingMethod && (
          <p className="text-error text-small mb-4">{errors.shippingMethod.message}</p>
        )}

        <div className="space-y-3">
          {cart.shippingMethods?.map((method) => {
            const isDisabled = method.id === "free_shipping" && !qualifiesForFreeShipping;
            const isSelected = selectedShippingMethod === method.id;

            return (
              <label
                key={method.id}
                className={cn(
                  "flex items-start gap-4 p-4 border cursor-pointer transition-colors",
                  isSelected ? "border-red-primary bg-red-primary/5" : "border-gray-border hover:border-gray-medium",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input
                  type="radio"
                  value={method.id}
                  disabled={isDisabled}
                  className="mt-1 w-5 h-5 accent-red-primary"
                  {...register("shippingMethod")}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Truck size={18} strokeWidth={1.5} className="text-gray-medium flex-shrink-0" />
                    <span className="font-semibold">{method.label}</span>
                  </div>
                  {method.description && (
                    <p className="text-small text-gray-medium mt-1">{method.description}</p>
                  )}
                  {isDisabled && (
                    <p className="text-small text-error mt-1">
                      Add {formatPrice(Math.max(freeShippingMinimum - cart.subtotal, 0))} more to qualify
                    </p>
                  )}
                </div>
                <span className="font-bold text-lg flex-shrink-0">
                  {method.cost === 0 ? "FREE" : formatPrice(method.cost)}
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-3 text-tiny text-gray-medium">
          *Wholesale orders may be charged shipping after order review.
        </p>
      </div>

      {/* Delivery Notes */}
      <div className="border-t border-gray-border pt-8">
        <h3 className="font-heading font-bold uppercase text-lg mb-4">
          Delivery Notes (optional)
        </h3>
        <textarea
          placeholder="Special delivery instructions, gate codes, etc."
          rows={3}
          className={cn(
            "w-full px-4 py-3",
            "text-body font-body text-black",
            "bg-white border border-gray-border rounded-none",
            "placeholder:text-gray-medium",
            "focus:outline-none focus:border-black",
            "resize-vertical min-h-[80px]"
          )}
          {...register("shippingNotes")}
        />
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
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}

export default CheckoutShipping;
