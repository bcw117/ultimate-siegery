import type { MetadataRoute } from "next";
import { privateRoutes, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", ...privateRoutes],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
