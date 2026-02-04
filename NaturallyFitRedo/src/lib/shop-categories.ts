import type { CategoryWithCount } from "@/lib/graphql/categories";

export interface CategoryTreeNode extends CategoryWithCount {
  children?: CategoryTreeNode[];
}

const ALLOWED_CATEGORY_TREE = [
  { name: "Fat Burners", children: ["Energy", "Weight Loss"] },
  { name: "Health & Balance", children: ["Wellness"] },
  { name: "Pre-Workout", children: ["Energy", "Pump"] },
  { name: "Protein", children: ["Bars", "Drinks", "Powder"] },
  { name: "Recovery", children: ["Amino Acids", "Creatine", "Hydration", "Post-Workout"] },
  { name: "Snacks & Drinks", children: ["Drinks", "Snacks"] },
  { name: "Supplements", children: ["General"] },
  { name: "Weight Gainer", children: ["Mass Gainer"] },
];

const normalizeCategoryName = (value: string) => value.trim().toLowerCase();

const slugifyCategory = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripNumericSuffix = (slug: string) => slug.replace(/-\d+$/, "");

const buildSlugVariants = (parent: string, child: string) => {
  const parentSlug = slugifyCategory(parent);
  const childSlug = slugifyCategory(child);
  const directVariants = [
    childSlug,
    `${parentSlug}-${childSlug}`,
    `${childSlug}-${parentSlug}`,
  ];

  return Array.from(
    new Set(directVariants.flatMap((variant) => [variant, stripNumericSuffix(variant)]))
  );
};

const parentSlugMap = new Map<string, string>();
const childSlugMap = new Map<string, { label: string; parentLabel: string }>();
const childLabelMap = new Map<string, string>();

for (const entry of ALLOWED_CATEGORY_TREE) {
  const parentSlug = slugifyCategory(entry.name);
  parentSlugMap.set(parentSlug, entry.name);
  parentSlugMap.set(stripNumericSuffix(parentSlug), entry.name);
  parentSlugMap.set(normalizeCategoryName(entry.name), entry.name);

  for (const child of entry.children) {
    const childKey = normalizeCategoryName(child);
    childLabelMap.set(childKey, child);
    const variants = buildSlugVariants(entry.name, child);
    for (const variant of variants) {
      childSlugMap.set(variant, { label: child, parentLabel: entry.name });
    }
  }
}

const matchesChildName = (category: CategoryWithCount, childName: string) =>
  normalizeCategoryName(category.name) === normalizeCategoryName(childName);

const matchesChildSlug = (category: CategoryWithCount, childName: string, parentName: string) => {
  const slugKey = stripNumericSuffix(slugifyCategory(category.slug));
  return buildSlugVariants(parentName, childName).includes(slugKey);
};

const matchesAllowedParent = (category: CategoryWithCount, parentName: string) => {
  const nameKey = normalizeCategoryName(category.name);
  const slugKey = stripNumericSuffix(slugifyCategory(category.slug));
  const parentSlug = slugifyCategory(parentName);
  return nameKey === normalizeCategoryName(parentName) || slugKey === parentSlug;
};

const matchesAllowedChild = (
  category: CategoryWithCount,
  childName: string,
  parentName: string
) =>
  matchesChildName(category, childName) || matchesChildSlug(category, childName, parentName);

export function isAllowedCategory(category: CategoryWithCount): boolean {
  const parentMatch = ALLOWED_CATEGORY_TREE.some((entry) =>
    matchesAllowedParent(category, entry.name)
  );
  if (parentMatch) {
    return true;
  }

  return ALLOWED_CATEGORY_TREE.some((entry) =>
    entry.children.some((child) => matchesAllowedChild(category, child, entry.name))
  );
}

export function filterAllowedCategories(
  categories: CategoryWithCount[]
): CategoryWithCount[] {
  return categories.filter(isAllowedCategory);
}

export function isAllowedCategorySlug(slug: string): boolean {
  const normalizedSlug = stripNumericSuffix(slugifyCategory(slug));
  return parentSlugMap.has(normalizedSlug) || childSlugMap.has(normalizedSlug);
}

export function getAllowedCategoryLabel(value: string): string | undefined {
  const normalizedSlug = stripNumericSuffix(slugifyCategory(value));
  const normalizedKey = normalizeCategoryName(value);
  return (
    parentSlugMap.get(normalizedSlug) ||
    childSlugMap.get(normalizedSlug)?.label ||
    childLabelMap.get(normalizedKey) ||
    parentSlugMap.get(normalizedKey)
  );
}

export function buildAllowedCategoryTree(
  categories: CategoryWithCount[]
): CategoryTreeNode[] {
  const tree: CategoryTreeNode[] = [];
  const usedChildSlugs = new Set<string>();

  for (const entry of ALLOWED_CATEGORY_TREE) {
    const parentCategory = categories.find((category) =>
      matchesAllowedParent(category, entry.name)
    );

    const parentSlug = parentCategory?.slug ?? slugifyCategory(entry.name);
    const parentNode: CategoryTreeNode = parentCategory
      ? { ...parentCategory }
      : {
          id: `virtual-${parentSlug}`,
          name: entry.name,
          slug: parentSlug,
          productCount: 0,
        };

    const children: CategoryTreeNode[] = entry.children
      .map((childName) => {
        const childCategory = categories.find((category) =>
          matchesAllowedChild(category, childName, entry.name)
        );

        if (childCategory) {
          return { ...childCategory };
        }

        const fallbackSlug = buildSlugVariants(entry.name, childName)[0];
        return {
          id: `virtual-${fallbackSlug}`,
          name: childName,
          slug: fallbackSlug,
          productCount: 0,
          parent: {
            id: parentNode.id,
            name: entry.name,
            slug: parentNode.slug,
          },
        };
      })
      .filter((child): child is CategoryTreeNode => Boolean(child));

    const uniqueChildren = children.filter((child) => {
      if (usedChildSlugs.has(child.slug)) {
        return false;
      }
      usedChildSlugs.add(child.slug);
      return true;
    });

    tree.push({ ...parentNode, children: uniqueChildren });
  }

  return tree;
}
