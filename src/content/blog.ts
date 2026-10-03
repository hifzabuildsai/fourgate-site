export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  /** Posts are drafts until this is removed. Drafts are noindex and excluded from the sitemap, nav and home page. */
  draft: boolean;
};

export const posts: BlogPostMeta[] = [
  {
    slug: "mcp-servers-field-record",
    title: "What we found testing 4 official MCP servers",
    description: "The field record as of 2026-10-01: three of four servers returned API failures as successful tool results, and we have seen no read-back-proven silent success.",
    draft: true,
  },
  {
    slug: "unknown-is-never-pass",
    title: "Why UNKNOWN is never PASS",
    description: "What each verdict means, what ends up UNKNOWN, and why Fourgate fails open per call but refuses to start on an invalid contract.",
    draft: true,
  },
];

export const postBySlug = (slug: string): BlogPostMeta => {
  const p = posts.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown post: ${slug}`);
  return p;
};
