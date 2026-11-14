export const MAX_TITLE_LENGTH = 200;

/**
 * Whitespace in titles is intentional, so values are never trimmed or normalised;
 * only a completely empty title is rejected.
 */
export function validateTitle(title: string): string | null {
  if (title.length === 0) return "Title can't be empty.";
  if (title.length > MAX_TITLE_LENGTH) return `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  return null;
}
