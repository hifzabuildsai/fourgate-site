import type { MetadataRoute } from "next";
import { SITE_URL } from "@/site.config";

export const dynamic = "force-static";

const routes = ["/", "/demo", "/integrations", "/security", "/pricing", "/design-partner", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
