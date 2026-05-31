import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = settings.siteUrl.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/auth"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
