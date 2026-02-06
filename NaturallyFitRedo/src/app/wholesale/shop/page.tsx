import { redirect } from "next/navigation";
import { wholesaleLinks } from "@/lib/wholesale/links";

export default function WholesaleShopPage() {
  const target = wholesaleLinks.order;

  if (target && target !== "/wholesale/shop") {
    redirect(target);
  }

  redirect("/shop");
}
