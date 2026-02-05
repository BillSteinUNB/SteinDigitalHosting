import type { CategoryWithCount } from "@/lib/graphql/categories";
import { buildAllowedCategoryTree } from "@/lib/shop-categories";
import type { MegaMenuCategory } from "@/lib/navigation";

const chunk = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) return [items];
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
};

export function buildMegaMenuCategories(
  categories: CategoryWithCount[]
): MegaMenuCategory[][] {
  const allowedTree = buildAllowedCategoryTree(categories);
  const menuCategories: MegaMenuCategory[] = allowedTree.map((category) => ({
    title: category.name,
    href: `/shop/${category.slug}`,
    items: (category.children || []).map((child) => ({
      label: child.name,
      href: `/shop/${child.slug}`,
    })),
  }));

  const columns = menuCategories.length > 8 ? 5 : 4;
  return chunk(menuCategories, columns);
}
