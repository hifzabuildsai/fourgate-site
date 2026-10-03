import type { MetadataRoute } from "next";
import { docHref, docs } from "@/content/docs";
import { SITE_URL } from "@/site.config";

export const dynamic = "force-static";

// /blog is deliberately absent: its posts are drafts (noindex).
const routes = [
  "/",
  "/demo",
  "/integrations",
  "/security",
  "/pricing",
  "/design-partner",
  "/privacy",
  ...docs.map((d) => docHref(d.slug)),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
