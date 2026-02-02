"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

// ============================================
// NEWSLETTER SIGNUP COMPONENT
// ============================================

export interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: "default" | "compact" | "dark";
  className?: string;
}

/**
 * Newsletter Component
 *
 * Email signup form for newsletter subscriptions.
 * Includes success/error states.
 */
export default function Newsletter({
  title = "Join Our Newsletter",
  description = "Subscribe for exclusive deals, new product alerts, and fitness tips delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  variant = "default",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success
      setStatus("success");
      setMessage("Thanks for subscribing! Check your inbox for a confirmation email.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const variantStyles = {
    default: "bg-white py-16",
    compact: "bg-white py-8 border-y border-gray-border",
    dark: "bg-black py-16",
  };

  const textColorClass = variant === "dark" ? "text-white" : "text-black";
  const descColorClass = variant === "dark" ? "text-gray-400" : "text-gray-medium";

  return (
    <section className={cn(variantStyles[variant], className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                "w-14 h-14 flex items-center justify-center",
                variant === "dark" ? "bg-red-primary" : "bg-red-primary"
              )}
            >
              <Mail size={24} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h2
            className={cn(
              "font-heading font-bold uppercase text-2xl md:text-3xl mb-3",
              textColorClass
            )}
          >
            {title}
          </h2>

          {/* Description */}
          <p className={cn("text-base mb-6", descColorClass)}>{description}</p>

          {/* Form */}
          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={placeholder}
                  disabled={status === "loading"}
                  className={cn(
                    "flex-1 px-4 py-3 min-h-[48px]",
                    "font-body text-body",
                    "border border-gray-border",
                    "focus:outline-none focus:ring-2 focus:ring-red-primary focus:border-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    variant === "dark"
                      ? "bg-gray-dark text-white placeholder:text-gray-medium"
                      : "bg-white text-black placeholder:text-gray-medium"
                  )}
                />
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={status === "loading"}
                  className="sm:w-auto w-full"
                >
                  {buttonText}
                </Button>
              </div>

              {/* Error Message */}
              {status === "error" && message && (
                <div className="flex items-center justify-center gap-2 mt-3 text-error">
                  <AlertCircle size={16} />
                  <span className="text-sm">{message}</span>
                </div>
              )}
            </form>
          ) : (
            /* Success Message */
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center bg-success/10 rounded-full">
                <CheckCircle size={24} className="text-success" />
              </div>
              <p className={cn("text-base", textColorClass)}>{message}</p>
            </div>
          )}

          {/* Privacy Note */}
          <p className={cn("text-tiny mt-4", descColorClass)}>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// INLINE NEWSLETTER (For footer/sidebar)
// ============================================

export interface InlineNewsletterProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

/**
 * InlineNewsletter Component
 *
 * Compact inline newsletter signup for footer/sidebar.
 */
export function InlineNewsletter({
  placeholder = "Your email",
  buttonText = "Subscribe",
  className,
}: InlineNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={cn("flex items-center gap-2 text-success text-sm", className)}>
        <CheckCircle size={16} />
        <span>Subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        disabled={status === "loading"}
        className={cn(
          "flex-1 min-w-0 px-3 py-2 text-sm",
          "bg-gray-800 text-white placeholder:text-gray-500",
          "border border-gray-700",
          "focus:outline-none focus:ring-1 focus:ring-red-primary",
          "disabled:opacity-50"
        )}
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        isLoading={status === "loading"}
      >
        {buttonText}
      </Button>
    </form>
  );
}
