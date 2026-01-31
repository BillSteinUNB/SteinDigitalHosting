"use client";

// ============================================
// LOGIN FORM COMPONENT
// ============================================

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";

// ============================================
// VALIDATION SCHEMA
// ============================================

const loginSchema = z.object({
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

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// COMPONENT
// ============================================

export interface LoginFormProps {
  className?: string;
  /** Callback after successful login */
  onSuccess?: () => void;
}

/**
 * LoginForm Component
 *
 * Email/password login form with validation, error handling,
 * and remember me functionality.
 *
 * @example
 * <LoginForm onSuccess={() => router.push('/account')} />
 */
export function LoginForm({ className, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError(result.error);
        setIsSubmitting(false);
        return;
      }

      if (result?.ok) {
        onSuccess?.();
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
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
          placeholder="you@example.com"
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
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>

      {/* Register Link */}
      <p className="text-center text-small text-gray-dark">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-red-primary font-semibold hover:underline"
        >
          Create one
        </Link>
      </p>

      {/* Demo Credentials */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 p-4 bg-gray-light border border-gray-border">
          <p className="text-tiny font-semibold text-gray-dark mb-2">
            Demo Credentials:
          </p>
          <ul className="text-tiny text-gray-medium space-y-1">
            <li>Customer: customer@example.com / password123</li>
            <li>Wholesale: wholesale@example.com / password123</li>
            <li>Admin: admin@example.com / admin123</li>
          </ul>
        </div>
      )}
    </form>
  );
}

export default LoginForm;
