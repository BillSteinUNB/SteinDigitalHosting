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

interface AllowedChildEntry {
  name: string;
  nameKey: string;
  slug: string;
  combinedSlug: string;
}

interface AllowedParentEntry {
  name: string;
  nameKey: string;
  slug: string;
  children: AllowedChildEntry[];
}

const allowedParentEntries: AllowedParentEntry[] = ALLOWED_CATEGORY_TREE.map((entry) => {
  const parentSlug = slugifyCategory(entry.name);
  return {
    name: entry.name,
    nameKey: normalizeCategoryName(entry.name),
    slug: parentSlug,
    children: entry.children.map((child) => {
      const childSlug = slugifyCategory(child);
      return {
        name: child,
        nameKey: normalizeCategoryName(child),
        slug: childSlug,
        combinedSlug: `${parentSlug}-${childSlug}`,
      };
    }),
  };
});

const allowedLabelBySlug = new Map<string, string>();

for (const parentEntry of allowedParentEntries) {
  allowedLabelBySlug.set(parentEntry.slug, parentEntry.name);
  for (const childEntry of parentEntry.children) {
    allowedLabelBySlug.set(childEntry.slug, childEntry.name);
    allowedLabelBySlug.set(childEntry.combinedSlug, childEntry.name);
  }
}

function matchesParentEntry(category: CategoryWithCount, entry: AllowedParentEntry): boolean {
  const nameKey = normalizeCategoryName(category.name);
  const slugKey = slugifyCategory(category.slug);
  return nameKey === entry.nameKey || slugKey === entry.slug;
}

function matchesChildEntry(category: CategoryWithCount, entry: AllowedChildEntry): boolean {
  const nameKey = normalizeCategoryName(category.name);
  const slugKey = slugifyCategory(category.slug);
  return (
    nameKey === entry.nameKey || slugKey === entry.slug || slugKey === entry.combinedSlug
  );
}

function matchesParentReference(
  parent: CategoryWithCount["parent"],
  reference: CategoryWithCount
): boolean {
  if (!parent) return false;
  const parentNameKey = normalizeCategoryName(parent.name);
  const parentSlugKey = slugifyCategory(parent.slug);
  return (
    parentNameKey === normalizeCategoryName(reference.name) ||
    parentSlugKey === slugifyCategory(reference.slug)
  );
}

export function isAllowedCategory(category: CategoryWithCount): boolean {
  if (!category.parent) {
    return allowedParentEntries.some((entry) => matchesParentEntry(category, entry));
  }

  const parentEntry = allowedParentEntries.find((entry) => {
    const parentNameKey = normalizeCategoryName(category.parent?.name || "");
    const parentSlugKey = slugifyCategory(category.parent?.slug || "");
    return parentNameKey === entry.nameKey || parentSlugKey === entry.slug;
  });

  if (!parentEntry) {
    return false;
  }

  return parentEntry.children.some((child) => matchesChildEntry(category, child));
}

export function filterAllowedCategories(
  categories: CategoryWithCount[]
): CategoryWithCount[] {
  return categories.filter(isAllowedCategory);
}

function findParentCategory(
  categories: CategoryWithCount[],
  parentEntry: AllowedParentEntry
): CategoryWithCount | undefined {
  return categories.find(
    (category) => !category.parent && matchesParentEntry(category, parentEntry)
  );
}

function findChildCategory(
  categories: CategoryWithCount[],
  parentCategory: CategoryWithCount,
  childEntry: AllowedChildEntry
): CategoryWithCount | undefined {
  return categories.find(
    (category) =>
      Boolean(category.parent) &&
      matchesParentReference(category.parent, parentCategory) &&
      matchesChildEntry(category, childEntry)
  );
}

export function buildAllowedCategoryTree(
  categories: CategoryWithCount[]
): CategoryTreeNode[] {
  const tree: CategoryTreeNode[] = [];

  for (const parentEntry of allowedParentEntries) {
    const parent = findParentCategory(categories, parentEntry);
    if (!parent) {
      continue;
    }

    const children = parentEntry.children
      .map((childEntry) => findChildCategory(categories, parent, childEntry))
      .filter((child): child is CategoryWithCount => Boolean(child))
      .map((child) => ({ ...child }));

    tree.push({ ...parent, children });
  }

  return tree;
}

export function getAllowedCategoryLabel(slug: string): string | undefined {
  return allowedLabelBySlug.get(slug);
}
