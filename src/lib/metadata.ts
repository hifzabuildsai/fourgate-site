import type { Metadata } from "next";
import { SITE_NAME } from "@/site.config";

/** Per-page title, description, canonical URL and Open Graph/Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
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
