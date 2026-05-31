import "server-only";
import { db } from "@/lib/db/client";

const FALLBACK_SOCIALS: Array<{
  id: string;
  platform: string;
  url: string;
  icon: string | null;
}> = [];

const FALLBACK_PROJECTS: Array<{
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: Date;
  coverImage: string | null;
  tags: string[];
  featured: boolean;
  link: string | null;
}> = [
  {
    id: "demo-1",
    slug: "atlas-design-system",
    title: "Atlas — A modern design system",
    summary:
      "A token-driven design system that powers a multi-brand SaaS, with accessible primitives and a Figma kit kept in sync via codegen.",
    category: "Design System",
    date: new Date("2025-09-12"),
    coverImage: null,
    tags: ["Figma", "Tailwind", "TypeScript", "Radix"],
    featured: true,
    link: null,
  },
  {
    id: "demo-2",
    slug: "fieldnote-ios-app",
    title: "Fieldnote — A focus journal for iOS",
    summary:
      "An ambient daily journaling app with on-device transcription, mood graphs, and haptic micro-interactions.",
    category: "Mobile",
    date: new Date("2025-04-02"),
    coverImage: null,
    tags: ["SwiftUI", "CoreML", "Liquid Glass"],
    featured: true,
    link: null,
  },
  {
    id: "demo-3",
    slug: "low-orbit-marketing-site",
    title: "Low Orbit — Marketing site & brand",
    summary:
      "A satellite-tracking startup needed a brand-forward marketing site. Built with Next.js, Three.js, and a touch of restraint.",
    category: "Web",
    date: new Date("2024-11-22"),
    coverImage: null,
    tags: ["Next.js", "Three.js", "Branding"],
    featured: false,
    link: null,
  },
];

const FALLBACK_SKILLS = [
  { id: "s1", name: "TypeScript", category: "Languages", level: 95, sortOrder: 0 },
  { id: "s2", name: "React", category: "Frameworks", level: 95, sortOrder: 1 },
  { id: "s3", name: "Next.js", category: "Frameworks", level: 92, sortOrder: 2 },
  { id: "s4", name: "Tailwind CSS", category: "Styling", level: 92, sortOrder: 3 },
  { id: "s5", name: "Node.js", category: "Backend", level: 88, sortOrder: 4 },
  { id: "s6", name: "Postgres", category: "Backend", level: 85, sortOrder: 5 },
  { id: "s7", name: "Figma", category: "Design", level: 90, sortOrder: 6 },
  { id: "s8", name: "Motion design", category: "Design", level: 80, sortOrder: 7 },
];

export async function getPublishedProjects(opts?: { take?: number; featured?: boolean }) {
  try {
    return await db.project.findMany({
      where: {
        published: true,
        ...(opts?.featured ? { featured: true } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { date: "desc" }],
      take: opts?.take,
    });
  } catch {
    let projects = FALLBACK_PROJECTS;
    if (opts?.featured) projects = projects.filter((p) => p.featured);
    if (opts?.take) projects = projects.slice(0, opts.take);
    return projects.map((p) => ({
      ...p,
      content: null as string | null,
      gallery: null,
      published: true,
      sortOrder: 0,
      createdAt: p.date,
      updatedAt: p.date,
    }));
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    return await db.project.findFirst({
      where: { slug, published: true },
    });
  } catch {
    const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
    if (!fallback) return null;
    return {
      ...fallback,
      content: null as string | null,
      gallery: null,
      published: true,
      sortOrder: 0,
      createdAt: fallback.date,
      updatedAt: fallback.date,
    };
  }
}

export async function getSkills() {
  try {
    const skills = await db.skill.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (skills.length === 0) return FALLBACK_SKILLS;
    return skills;
  } catch {
    return FALLBACK_SKILLS;
  }
}

export async function getSocialLinks() {
  try {
    return await db.socialLink.findMany({
      orderBy: [{ sortOrder: "asc" }],
    });
  } catch {
    return FALLBACK_SOCIALS;
  }
}
