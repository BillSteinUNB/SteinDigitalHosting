"use client";

// ============================================
// REGISTER FORM COMPONENT
// ============================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";

// ============================================
// VALIDATION SCHEMA
// ============================================

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
    newsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================
// PASSWORD STRENGTH INDICATOR
// ============================================

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;
  const strengthLabel =
    strength === 0
      ? ""
      : strength <= 2
      ? "Weak"
      : strength === 3
      ? "Medium"
      : "Strong";
  const strengthColor =
    strength <= 2 ? "bg-error" : strength === 3 ? "bg-yellow-500" : "bg-success";

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 transition-colors",
              i <= strength ? strengthColor : "bg-gray-border"
            )}
          />
        ))}
      </div>
      <p className="text-tiny text-gray-medium">
        Password strength: <span className="font-semibold">{strengthLabel}</span>
      </p>

      {/* Requirements list */}
      <ul className="space-y-1">
        {checks.map((check) => (
          <li
            key={check.label}
            className={cn(
              "text-tiny flex items-center gap-2",
              check.valid ? "text-success" : "text-gray-medium"
            )}
          >
            {check.valid ? (
              <Check size={12} strokeWidth={2} />
            ) : (
              <span className="w-3 h-3 rounded-full border border-current" />
            )}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export interface RegisterFormProps {
  className?: string;
  /** Callback after successful registration */
  onSuccess?: () => void;
}

/**
 * RegisterForm Component
 *
 * User registration form with validation, password strength indicator,
 * and terms acceptance.
 *
 * @example
 * <RegisterForm onSuccess={() => router.push('/account')} />
 */
export function RegisterForm({ className, onSuccess }: RegisterFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: undefined,
      newsletter: true,
    },
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // In production, this would call a registration API endpoint
      // For now, simulate a registration process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // After registration, automatically sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed
        // Redirect to login page
        router.push("/login?registered=true");
        return;
      }

      if (result?.ok) {
        onSuccess?.();
        router.push("/account?welcome=true");
        router.refresh();
      }
    } catch (error) {
      console.error("Registration error:", error);
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
            <p className="text-small font-semibold">Registration Failed</p>
            <p className="text-small">{serverError}</p>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          {...register("firstName")}
          type="text"
          label="First Name"
          placeholder="John"
          error={errors.firstName?.message}
          leftIcon={<User size={18} strokeWidth={1.5} />}
          autoComplete="given-name"
          disabled={isSubmitting}
        />
        <Input
          {...register("lastName")}
          type="text"
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName?.message}
          leftIcon={<User size={18} strokeWidth={1.5} />}
          autoComplete="family-name"
          disabled={isSubmitting}
        />
      </div>

      {/* Email Field */}
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
              placeholder="Create a strong password"
              autoComplete="new-password"
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
          <PasswordStrength password={password} />
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-small font-semibold text-black"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium pointer-events-none">
              <Lock size={18} strokeWidth={1.5} />
            </span>
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmPassword}
              className={cn(
                "w-full pl-10 pr-12 py-3 min-h-[44px]",
                "text-body font-body text-black",
                "bg-white border border-gray-border rounded-none",
                "placeholder:text-gray-medium",
                "transition-colors duration-200",
                "focus:outline-none focus:border-black",
                errors.confirmPassword && "border-error focus:border-error",
                isSubmitting && "bg-gray-light cursor-not-allowed opacity-60"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-black transition-colors p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} strokeWidth={1.5} />
              ) : (
                <Eye size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-tiny text-error" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Terms & Newsletter */}
      <div className="space-y-4">
        {/* Accept Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("acceptTerms")}
            type="checkbox"
            className="w-5 h-5 mt-0.5 accent-red-primary cursor-pointer flex-shrink-0"
            disabled={isSubmitting}
          />
          <span className="text-small">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-red-primary hover:underline"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-red-primary hover:underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-tiny text-error" role="alert">
            {errors.acceptTerms.message}
          </p>
        )}

        {/* Newsletter */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register("newsletter")}
            type="checkbox"
            className="w-5 h-5 mt-0.5 accent-red-primary cursor-pointer flex-shrink-0"
            disabled={isSubmitting}
          />
          <span className="text-small text-gray-dark">
            Send me exclusive deals, new product announcements, and fitness tips
          </span>
        </label>
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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>

      {/* Login Link */}
      <p className="text-center text-small text-gray-dark">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-red-primary font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
