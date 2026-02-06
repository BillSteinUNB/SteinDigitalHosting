import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AuthProvider } from "@/components/auth";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import CheckoutHandoffSync from "@/components/checkout/CheckoutHandoffSync";

// === FONT CONFIGURATION ===
// Plus Jakarta Sans: Primary font for header + body to match live site
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

// === METADATA ===
export const metadata: Metadata = {
  title: {
    default: "Naturally Fit | Canada's Supplement Store",
    template: "%s | Naturally Fit",
  },
  description:
    "Canada's premier supplement retailer since 1999. Veteran-owned, price-match guarantee. Shop protein, pre-workout, vitamins, and more. Serving Canada's supplement needs!",
  keywords: [
    "supplements",
    "protein",
    "pre-workout",
    "vitamins",
    "Canada",
    "Fredericton",
    "New Brunswick",
    "fitness",
    "bodybuilding",
    "wholesale",
  ],
  authors: [{ name: "Naturally Fit" }],
  creator: "Naturally Fit",
  publisher: "Naturally Fit",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://naturallyfit.ca",
    siteName: "Naturally Fit",
    title: "Naturally Fit | Canada's Supplement Store",
    description:
      "Canada's premier supplement retailer since 1999. Veteran-owned, price-match guarantee.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Naturally Fit - Canada's Supplement Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naturally Fit | Canada's Supplement Store",
    description:
      "Canada's premier supplement retailer since 1999. Veteran-owned, price-match guarantee.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// === ROOT LAYOUT ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ReactQueryProvider>
          <AuthProvider>
            <CheckoutHandoffSync />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
