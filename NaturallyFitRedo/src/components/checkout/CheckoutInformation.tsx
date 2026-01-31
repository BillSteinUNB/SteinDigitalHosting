"use client";

// ============================================
// CHECKOUT INFORMATION FORM
// ============================================

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCheckoutStore } from "@/stores/checkout-store";

// ============================================
// VALIDATION SCHEMA
// ============================================

const informationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  createAccount: z.boolean(),
  password: z.string().optional(),
}).refine((data) => {
  if (data.createAccount && (!data.password || data.password.length < 8)) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 8 characters",
  path: ["password"],
});

type InformationFormData = z.infer<typeof informationSchema>;

// ============================================
// COMPONENT
// ============================================

export function CheckoutInformation() {
  const { data: session } = useSession();
  const { customerInfo, updateCustomerInfo, goToNextStep } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InformationFormData>({
    resolver: zodResolver(informationSchema),
    defaultValues: {
      email: customerInfo.email || session?.user?.email || "",
      phone: customerInfo.phone || "",
      createAccount: customerInfo.createAccount,
      password: customerInfo.password || "",
    },
  });

  const createAccount = watch("createAccount");

  // Pre-fill from session
  useEffect(() => {
    if (session?.user?.email && !customerInfo.email) {
      setValue("email", session.user.email);
    }
  }, [session, customerInfo.email, setValue]);

  const onSubmit = (data: InformationFormData) => {
    updateCustomerInfo({
      email: data.email,
      phone: data.phone,
      createAccount: data.createAccount,
      password: data.createAccount ? data.password : undefined,
    });
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="font-heading font-bold uppercase text-xl mb-6">
          Contact Information
        </h2>

        {!session && (
          <p className="text-small text-gray-dark mb-4">
            Already have an account?{" "}
            <Link href="/login?redirect=/checkout" className="text-red-primary hover:underline">
              Log in
            </Link>
          </p>
        )}

        <div className="space-y-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Phone Number *"
            type="tel"
            placeholder="(555) 123-4567"
            hint="For delivery updates"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      {/* Create Account Option (only for guests) */}
      {!session && (
        <div className="border-t border-gray-border pt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-red-primary"
              {...register("createAccount")}
            />
            <div>
              <span className="text-small font-semibold">Create an account</span>
              <p className="text-tiny text-gray-medium mt-0.5">
                Save your information for faster checkout next time
              </p>
            </div>
          </label>

          {createAccount && (
            <div className="mt-4 pl-8">
              <Input
                label="Password *"
                type="password"
                placeholder="Create a password (min. 8 characters)"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} strokeWidth={1.5} />}
          className="w-full sm:w-auto"
        >
          Continue to Shipping
        </Button>
      </div>
    </form>
  );
}

export default CheckoutInformation;
