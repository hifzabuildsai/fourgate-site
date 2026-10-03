import type { Metadata } from "next";
import { docBySlug, docHref } from "@/content/docs";
import { SITE_NAME } from "@/site.config";

/** Per-page title, description, canonical URL and Open Graph/Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Adds `<meta name="robots" content="noindex, nofollow">`. Used for draft pages. */
  noindex?: boolean;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Fourgate: independent outcome verification for AI-agent actions" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image.png"],
    },
  };
}

/** Metadata for a docs page, taken from the docs registry so title, description and canonical path stay in one place. */
export function docMetadata(slug: string): Metadata {
  const d = docBySlug(slug);
  return pageMetadata({ title: slug ? `${d.title} | Docs` : "Documentation", description: d.description, path: docHref(slug) });
}
