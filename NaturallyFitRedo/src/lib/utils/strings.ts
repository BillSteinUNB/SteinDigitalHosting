/**
 * Convert a string to a URL-friendly slug
 *
 * @param text - The text to slugify
 * @returns URL-friendly slug
 *
 * @example
 * slugify("Protein Powder") // "protein-powder"
 * slugify("BCAA's & EAA's") // "bcaas-eaas"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a maximum length with ellipsis
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * truncate("This is a long product name", 20) // "This is a long pr..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3).trim() + "...";
}

/**
 * Strip HTML tags from a string
 *
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Capitalize the first letter of each word
 *
 * @param text - The text to capitalize
 * @returns Text with first letter of each word capitalized
 *
 * @example
 * capitalizeWords("protein powder") // "Protein Powder"
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate initials from a name
 *
 * @param name - Full name
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials string
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("John Michael Doe") // "JM"
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  return name
    .split(" ")
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
