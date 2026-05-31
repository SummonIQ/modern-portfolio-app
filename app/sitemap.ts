import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
  ]);
  const base = settings.siteUrl.replace(/\/$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/projects",
    "/contact",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...projectRoutes];
}
