"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/admin";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseJsonOrNull(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseTags(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function bumpAll() {
  revalidatePath("/", "layout");
}

// ─── Projects ──────────────────────────────────────────────────

const ProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120),
  summary: z.string().min(1).max(500),
  category: z.string().min(1).max(80),
  date: z.string().min(1),
  coverImage: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int(),
  content: z.string().nullable().optional(),
  gallery: z.unknown().nullable().optional(),
});

export async function saveProject(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const titleRaw = String(formData.get("title") ?? "");
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = (slugRaw ? slugify(slugRaw) : slugify(titleRaw)) || "untitled";

  const parsed = ProjectSchema.parse({
    title: titleRaw,
    slug,
    summary: String(formData.get("summary") ?? ""),
    category: String(formData.get("category") ?? ""),
    date: String(formData.get("date") ?? ""),
    coverImage: (formData.get("coverImage") as string) || null,
    link: (formData.get("link") as string) || null,
    tags: parseTags(formData.get("tags")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    content: (formData.get("content") as string) || null,
    gallery: parseJsonOrNull(formData.get("gallery")),
  });

  const data = {
    title: parsed.title,
    slug: parsed.slug,
    summary: parsed.summary,
    category: parsed.category,
    date: new Date(parsed.date),
    coverImage: parsed.coverImage || null,
    link: parsed.link || null,
    tags: parsed.tags,
    featured: parsed.featured,
    published: parsed.published,
    sortOrder: parsed.sortOrder,
    content: parsed.content ?? null,
    gallery: parsed.gallery as never,
  };

  if (id && typeof id === "string" && id !== "new") {
    await db.project.update({ where: { id }, data });
  } else {
    await db.project.create({ data });
  }

  bumpAll();
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  bumpAll();
  revalidatePath("/admin/projects");
}

// ─── Skills ────────────────────────────────────────────────────

export async function saveSkill(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const data = {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "General").trim() || "General",
    level: Math.min(100, Math.max(0, Number(formData.get("level") ?? 80))),
    icon: (String(formData.get("icon") ?? "") || null) as string | null,
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };
  if (!data.name) return;

  if (id && typeof id === "string" && id !== "new") {
    await db.skill.update({ where: { id }, data });
  } else {
    await db.skill.create({ data });
  }
  bumpAll();
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await db.skill.delete({ where: { id } });
  bumpAll();
  revalidatePath("/admin/skills");
}

// ─── Social links ──────────────────────────────────────────────

export async function saveSocial(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const data = {
    platform: String(formData.get("platform") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    icon: (String(formData.get("icon") ?? "") || null) as string | null,
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };
  if (!data.platform || !data.url) return;

  if (id && typeof id === "string" && id !== "new") {
    await db.socialLink.update({ where: { id }, data });
  } else {
    await db.socialLink.create({ data });
  }
  bumpAll();
  revalidatePath("/admin/socials");
}

export async function deleteSocial(id: string) {
  await requireAdmin();
  await db.socialLink.delete({ where: { id } });
  bumpAll();
  revalidatePath("/admin/socials");
}

// ─── Site settings (about, contact, SEO) ───────────────────────

const FIELD_KEYS = [
  "ownerName",
  "headline",
  "tagline",
  "heroImage",
  "aboutTitle",
  "aboutSummary",
  "resumeUrl",
  "skillsTitle",
  "skillsSubtitle",
  "projectsTitle",
  "projectsSubtitle",
  "contactEmail",
  "contactPhone",
  "contactLocation",
  "contactBlurb",
  "siteTitle",
  "siteDescription",
  "siteUrl",
] as const;

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const data: Record<string, unknown> = {};
  for (const key of FIELD_KEYS) {
    const v = formData.get(key);
    if (typeof v === "string") {
      data[key] = v.length === 0 ? null : v;
    }
  }
  // aboutBody is PlateJS markdown text
  const aboutBody = formData.get("aboutBody");
  data.aboutBody = typeof aboutBody === "string" ? aboutBody : null;

  await db.siteSettings.upsert({
    where: { id: "site" },
    update: data,
    create: { id: "site", ...(data as object) },
  });
  bumpAll();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/about");
}

// ─── Messages ──────────────────────────────────────────────────

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await db.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
