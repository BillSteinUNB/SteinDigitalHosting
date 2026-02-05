"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/graphql/categories";
import { buildMegaMenuCategories } from "@/lib/shop-menu";
import type { MegaMenuCategory } from "@/lib/navigation";

export default function useMegaMenuCategories(): MegaMenuCategory[][] {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return useMemo(
    () => buildMegaMenuCategories(categories ?? []),
    [categories]
  );
}
