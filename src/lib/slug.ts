/** Heading text to anchor id. Used by the MDX heading components and the table-of-contents parser, so both agree. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
