import "server-only";
import { db } from "@/lib/db/client";

const DEFAULTS = {
  ownerName: "Your Name",
  headline: "Designer & Developer",
  tagline: "I craft modern, accessible web experiences.",
  heroImage: null,
  aboutTitle: "About me",
  aboutBody: null as string | null,
  aboutSummary:
    "I'm a multi-disciplinary maker. I build thoughtful interfaces, ship resilient backends, and care a great deal about the small details.",
  resumeUrl: null,
  skillsTitle: "Skills",
  skillsSubtitle: "Tools and technologies I use day-to-day.",
  projectsTitle: "Selected work",
  projectsSubtitle: "A few things I've built recently.",
  contactEmail: "hello@example.com",
  contactPhone: null,
  contactLocation: null,
  contactBlurb: "Have a project in mind? Let's talk.",
  siteTitle: "Portfolio",
  siteDescription: "A personal portfolio.",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3030",
};

export type SettingsView = Awaited<ReturnType<typeof getSiteSettings>>;

export async function getSiteSettings() {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "site" } });
    if (!row) return { id: "site", ...DEFAULTS, updatedAt: new Date() };
    return row;
  } catch {
    // DB not migrated yet — keep the marketing site rendering with defaults.
    return { id: "site", ...DEFAULTS, updatedAt: new Date() };
  }
}
