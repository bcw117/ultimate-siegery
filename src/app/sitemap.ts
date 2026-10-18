import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Only the pages a signed-out visitor can reach
const publicPaths = ["/", "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
