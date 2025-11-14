// Constants
export const SLUG_RULES = { minLength: 3, maxLength: 50 } as const;

// Types
type ValidateSlugResult = { valid: true } | { valid: false; error: string }

/**
 * Sanitize a slug by normalizing, removing accents, and replacing non-alphanumeric characters
 * @param {string} slug - The raw slug to sanitize
 * @returns {string} The sanitized slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
      .toLowerCase()
      // Normalize to NFD (Canonical Decomposition) - separates characters from their diacritics (é becomes e + ´)
      .normalize('NFD')
      // Replace all diacritical marks (accents) with empty string to remove them
      .replace(/[\u0300-\u036f]/g, '')
      // Replace any sequence of non-alphanumeric characters with a single hyphen
      .replace(/[^a-z0-9]+/g, '-')
      // Replace leading and trailing hyphens with empty string
      .replace(/^-+|-+$/g, '')
      // Replace multiple consecutive hyphens with a single hyphen
      .replace(/-+/g, '-')
}

/**
 * Sanitize a slug for live input (keeps trailing hyphens to allow continued typing)
 * @param {string} slug - The raw slug to sanitize
 * @returns {string} The sanitized slug with trailing hyphens preserved
 */
export function sanitizeSlugLive(slug: string): string {
  return slug
      .toLowerCase()
      // Normalize to NFD (Canonical Decomposition) - separates characters from their diacritics (é becomes e + ´)
      .normalize('NFD')
      // Replace all diacritical marks (accents) with empty string to remove them
      .replace(/[\u0300-\u036f]/g, '')
      // Replace any sequence of non-alphanumeric characters with a single hyphen
      .replace(/[^a-z0-9]+/g, '-')
      // Replace multiple consecutive hyphens with a single hyphen
      .replace(/-+/g, '-')
      // Remove leading hyphens only (keep trailing ones for continued typing)
      .replace(/^-+/g, '')
}

/**
 * Validate a slug according to defined rules
 * @param {string} slug - The slug to validate
 * @returns {ValidateSlugResult} Validation result with error message if invalid
 */
export function validateSlug(slug: string): ValidateSlugResult {

    if (!slug || slug.length < SLUG_RULES.minLength) {
        return { valid: false, error: `Trop court ! Entrez au moins ${SLUG_RULES.minLength} caractères` }
    }

    else if (slug.length > SLUG_RULES.maxLength) {
        return { valid: false, error: `Trop long ! Entrez au maximum ${SLUG_RULES.maxLength} caractères` }
    }

    return { valid: true }
}
