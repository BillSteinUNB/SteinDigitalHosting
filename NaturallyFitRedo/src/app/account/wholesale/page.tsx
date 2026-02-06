import { redirect } from "next/navigation";

// Back-compat route to prevent legacy 404s (nav, old bookmarks, etc.)
export default function AccountWholesaleRedirectPage() {
  redirect("/wholesale/login");
}

