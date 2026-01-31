"use client";

// ============================================
// ACCOUNT SETTINGS PAGE
// ============================================

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ============================================
// PAGE COMPONENT
// ============================================

export default function SettingsPage() {
  const { data: session } = useSession();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: true,
    productAlerts: false,
  });

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      email: session?.user?.email || "",
      phone: "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (_data: ProfileFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const onPasswordSubmit = async (_data: PasswordFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPasswordSuccess(true);
    resetPassword();
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-h2 uppercase mb-2">
          Account Settings
        </h1>
        <p className="text-body text-gray-medium">
          Manage your profile, password, and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <section className="border border-gray-border">
        <div className="p-4 bg-gray-light border-b border-gray-border">
          <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
            <User size={20} strokeWidth={1.5} />
            Profile Information
          </h2>
        </div>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-6">
          {profileSuccess && (
            <div className="flex items-center gap-2 p-4 bg-success/10 border border-success text-success mb-6">
              <Check size={18} strokeWidth={1.5} />
              <span className="text-small font-semibold">Profile updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input
              {...registerProfile("firstName")}
              label="First Name"
              error={profileErrors.firstName?.message}
              leftIcon={<User size={18} strokeWidth={1.5} />}
              disabled={isProfileSubmitting}
            />
            <Input
              {...registerProfile("lastName")}
              label="Last Name"
              error={profileErrors.lastName?.message}
              leftIcon={<User size={18} strokeWidth={1.5} />}
              disabled={isProfileSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input
              {...registerProfile("email")}
              type="email"
              label="Email Address"
              error={profileErrors.email?.message}
              leftIcon={<Mail size={18} strokeWidth={1.5} />}
              disabled={isProfileSubmitting}
            />
            <Input
              {...registerProfile("phone")}
              type="tel"
              label="Phone Number (Optional)"
              placeholder="(123) 456-7890"
              disabled={isProfileSubmitting}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isProfileSubmitting}
            disabled={isProfileSubmitting}
          >
            Save Changes
          </Button>
        </form>
      </section>

      {/* Password Settings */}
      <section className="border border-gray-border">
        <div className="p-4 bg-gray-light border-b border-gray-border">
          <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
            <Lock size={20} strokeWidth={1.5} />
            Change Password
          </h2>
        </div>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6">
          {passwordSuccess && (
            <div className="flex items-center gap-2 p-4 bg-success/10 border border-success text-success mb-6">
              <Check size={18} strokeWidth={1.5} />
              <span className="text-small font-semibold">Password changed successfully!</span>
            </div>
          )}

          <div className="space-y-4 mb-6 max-w-md">
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="currentPassword" className="text-small font-semibold">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium">
                  <Lock size={18} strokeWidth={1.5} />
                </span>
                <input
                  {...registerPassword("currentPassword")}
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  disabled={isPasswordSubmitting}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 min-h-[44px]",
                    "text-body bg-white border border-gray-border rounded-none",
                    "focus:outline-none focus:border-black",
                    passwordErrors.currentPassword && "border-error"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-black p-1"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-tiny text-error">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-small font-semibold">
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium">
                  <Lock size={18} strokeWidth={1.5} />
                </span>
                <input
                  {...registerPassword("newPassword")}
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  disabled={isPasswordSubmitting}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 min-h-[44px]",
                    "text-body bg-white border border-gray-border rounded-none",
                    "focus:outline-none focus:border-black",
                    passwordErrors.newPassword && "border-error"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-black p-1"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-tiny text-error">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              {...registerPassword("confirmPassword")}
              type="password"
              label="Confirm New Password"
              error={passwordErrors.confirmPassword?.message}
              leftIcon={<Lock size={18} strokeWidth={1.5} />}
              disabled={isPasswordSubmitting}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isPasswordSubmitting}
            disabled={isPasswordSubmitting}
          >
            Update Password
          </Button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="border border-gray-border">
        <div className="p-4 bg-gray-light border-b border-gray-border">
          <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
            <Bell size={20} strokeWidth={1.5} />
            Notification Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            {
              key: "orderUpdates" as const,
              label: "Order Updates",
              description: "Receive notifications about your order status",
            },
            {
              key: "promotions" as const,
              label: "Promotions & Offers",
              description: "Get notified about sales and special deals",
            },
            {
              key: "newsletter" as const,
              label: "Newsletter",
              description: "Weekly fitness tips and product highlights",
            },
            {
              key: "productAlerts" as const,
              label: "Back in Stock Alerts",
              description: "Be notified when wishlist items are available",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start gap-4 cursor-pointer p-4 bg-gray-light hover:bg-gray-200 transition-colors"
            >
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={() => handleNotificationChange(item.key)}
                className="w-5 h-5 mt-0.5 accent-red-primary cursor-pointer flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-small font-semibold">{item.label}</p>
                <p className="text-tiny text-gray-medium">{item.description}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Account Security */}
      <section className="border border-gray-border">
        <div className="p-4 bg-gray-light border-b border-gray-border">
          <h2 className="font-heading font-bold text-h4 uppercase flex items-center gap-2">
            <Shield size={20} strokeWidth={1.5} />
            Account Security
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 mb-4">
            <AlertCircle size={20} strokeWidth={1.5} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-semibold text-yellow-800">
                Two-Factor Authentication
              </p>
              <p className="text-tiny text-yellow-700">
                Add an extra layer of security to your account by enabling 2FA.
              </p>
            </div>
          </div>
          <Button variant="outline">Enable Two-Factor Authentication</Button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border border-error">
        <div className="p-4 bg-error/10 border-b border-error">
          <h2 className="font-heading font-bold text-h4 uppercase text-error">
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <p className="text-small text-gray-medium mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="border-error text-error hover:bg-error hover:text-white">
            Delete Account
          </Button>
        </div>
      </section>
    </div>
  );
}
