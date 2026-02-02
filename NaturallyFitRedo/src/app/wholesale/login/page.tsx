"use client";

// ============================================
// WHOLESALE LOGIN PAGE
// ============================================

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { Container } from "@/components/ui";

// ============================================
// VALIDATION SCHEMA
// ============================================

const wholesaleLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type WholesaleLoginFormData = z.infer<typeof wholesaleLoginSchema>;

// ============================================
// LOGIN FORM COMPONENT
// ============================================

function WholesaleLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/wholesale/shop";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WholesaleLoginFormData>({
    resolver: zodResolver(wholesaleLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: WholesaleLoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setServerError(result.error);
        setIsSubmitting(false);
        return;
      }

      if (result?.ok) {
        // Check if user is wholesale - if not, show error
        // This will be handled by the auth callback checking WholesaleX role
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="py-12 lg:py-16 min-h-[calc(100vh-200px)]">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} strokeWidth={1.5} className="text-red-primary" />
            </div>
            <h1 className="font-heading font-bold text-h1 uppercase mb-2">
              Wholesale Login
            </h1>
            <p className="text-body text-gray-medium">
              Sign in to your wholesale account to access exclusive pricing and bulk ordering.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white p-6 sm:p-8 border border-gray-border">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Server Error */}
              {serverError && (
                <div className="flex items-start gap-3 p-4 bg-error/10 border border-error text-error">
                  <AlertCircle size={20} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-small font-semibold">Login Failed</p>
                    <p className="text-small">{serverError}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <Input
                  {...register("email")}
                  type="email"
                  label="Email Address"
                  placeholder="wholesale@company.com"
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} strokeWidth={1.5} />}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-small font-semibold text-black">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium pointer-events-none">
                      <Lock size={18} strokeWidth={1.5} />
                    </span>
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.password}
                      className={cn(
                        "w-full pl-10 pr-12 py-3 min-h-[44px]",
                        "text-body font-body text-black",
                        "bg-white border border-gray-border rounded-none",
                        "placeholder:text-gray-medium",
                        "transition-colors duration-200",
                        "focus:outline-none focus:border-black",
                        errors.password && "border-error focus:border-error",
                        isSubmitting && "bg-gray-light cursor-not-allowed opacity-60"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-black transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.5} />
                      ) : (
                        <Eye size={18} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-tiny text-error" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("remember")}
                    type="checkbox"
                    className="w-5 h-5 accent-red-primary cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <span className="text-small">Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-small text-red-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In to Wholesale"}
              </Button>
            </form>
          </div>

          {/* Links */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-small text-gray-medium">
              Don&apos;t have a wholesale account?{" "}
              <Link
                href="/wholesale/register"
                className="text-red-primary font-semibold hover:underline"
              >
                Apply now
              </Link>
            </p>
            <p className="text-small text-gray-medium">
              Regular customer?{" "}
              <Link
                href="/login"
                className="text-red-primary font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}

// ============================================
// PAGE COMPONENT (with Suspense)
// ============================================

export default function WholesaleLoginPage() {
  return (
    <Suspense fallback={
      <main className="py-12 lg:py-16 min-h-[calc(100vh-200px)]">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="h-96 bg-gray-light animate-pulse" />
          </div>
        </Container>
      </main>
    }>
      <WholesaleLoginForm />
    </Suspense>
  );
}
