import { redirect } from "next/navigation";
import { wholesaleLinks } from "@/lib/wholesale/links";

export default function WholesaleLoginPage() {
  const target = wholesaleLinks.login;

  if (target && target !== "/wholesale/login") {
    redirect(target);
  }

  redirect("/login?callbackUrl=%2Fwholesale%2Fshop");
}
