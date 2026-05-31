/**
 * Seeds the admin user and placeholder content.
 * Idempotent: running it twice updates the existing admin password.
 *
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… bun run seed
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "";
const isLocal =
  connectionString.includes("@localhost") ||
  connectionString.includes("@127.0.0.1") ||
  connectionString.includes("sslmode=disable");
const adapter = new PrismaPg({
  connectionString,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: true } }),
});
const db = new PrismaClient({ adapter });

const auth = betterAuth({
  appName: "modern-portfolio-app",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3030",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
});

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    console.error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment. Set them in .env.local first.",
    );
    process.exit(1);
  }

  console.log(`▸ Seeding admin user ${email}…`);

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Reset the password by updating the stored credential
    const account = await db.account.findFirst({
      where: { userId: existing.id, providerId: "credential" },
    });
    const ctx = await (auth as never as { $context: Promise<{ password: { hash: (p: string) => Promise<string> } } > }).$context;
    const hashed = await ctx.password.hash(password);
    if (account) {
      await db.account.update({
        where: { id: account.id },
        data: { password: hashed },
      });
    } else {
      await db.account.create({
        data: {
          id: `${existing.id}-credential`,
          userId: existing.id,
          accountId: existing.id,
          providerId: "credential",
          password: hashed,
        },
      });
    }
    await db.user.update({
      where: { id: existing.id },
      data: { name, role: "admin", emailVerified: true },
    });
    console.log("  ✓ Updated existing admin password.");
  } else {
    // better-auth will hash + create the credential account
    const res = await auth.api.signUpEmail({
      body: { email, password, name },
    });
    if (!res?.user) {
      console.error("Failed to create admin:", res);
      process.exit(1);
    }
    await db.user.update({
      where: { id: res.user.id },
      data: { role: "admin", emailVerified: true },
    });
    console.log("  ✓ Created admin user.");
  }

  // Seed site settings (only if missing — never overwrite existing copy).
  const existingSite = await db.siteSettings.findUnique({ where: { id: "site" } });
  if (!existingSite) {
    await db.siteSettings.create({
      data: {
        id: "site",
        ownerName: name,
        headline: "Designer & Developer",
        tagline:
          "I craft modern, accessible web experiences with care for detail and craft.",
        aboutTitle: "About me",
        aboutSummary:
          "I'm a multi-disciplinary maker. I build thoughtful interfaces, ship resilient backends, and care a great deal about the small details.",
        skillsTitle: "Skills",
        skillsSubtitle: "Tools and technologies I use day-to-day.",
        projectsTitle: "Selected work",
        projectsSubtitle: "A few things I've built recently.",
        contactEmail: email,
        contactBlurb: "Have a project in mind? Let's talk.",
        siteTitle: name,
        siteDescription: `Personal portfolio of ${name}.`,
        siteUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3030",
      },
    });
    console.log("  ✓ Seeded default site settings.");
  } else {
    console.log("  • Site settings already present — skipped.");
  }

  // Skills
  const skillCount = await db.skill.count();
  if (skillCount === 0) {
    const skills = [
      { name: "TypeScript", category: "Languages", level: 95, sortOrder: 0 },
      { name: "JavaScript", category: "Languages", level: 95, sortOrder: 1 },
      { name: "React", category: "Frameworks", level: 95, sortOrder: 2 },
      { name: "Next.js", category: "Frameworks", level: 92, sortOrder: 3 },
      { name: "Tailwind CSS", category: "Styling", level: 92, sortOrder: 4 },
      { name: "Node.js", category: "Backend", level: 88, sortOrder: 5 },
      { name: "Postgres", category: "Backend", level: 85, sortOrder: 6 },
      { name: "Prisma", category: "Backend", level: 88, sortOrder: 7 },
      { name: "Figma", category: "Design", level: 90, sortOrder: 8 },
      { name: "Motion design", category: "Design", level: 80, sortOrder: 9 },
    ];
    await db.skill.createMany({ data: skills });
    console.log(`  ✓ Seeded ${skills.length} skills.`);
  } else {
    console.log("  • Skills already present — skipped.");
  }

  // Social links
  const socialCount = await db.socialLink.count();
  if (socialCount === 0) {
    await db.socialLink.createMany({
      data: [
        {
          platform: "GitHub",
          url: "https://github.com",
          icon: "github",
          sortOrder: 0,
        },
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: "linkedin",
          sortOrder: 1,
        },
        {
          platform: "Twitter",
          url: "https://twitter.com",
          icon: "twitter",
          sortOrder: 2,
        },
      ],
    });
    console.log("  ✓ Seeded sample social links.");
  } else {
    console.log("  • Social links already present — skipped.");
  }

  // Sample projects
  const projectCount = await db.project.count();
  if (projectCount === 0) {
    await db.project.createMany({
      data: [
        {
          slug: "atlas-design-system",
          title: "Atlas — A modern design system",
          summary:
            "A token-driven design system that powers a multi-brand SaaS, with accessible primitives and a Figma kit kept in sync via codegen.",
          content:
            "## Overview\n\nAtlas is a multi-brand design system shipped to three product surfaces. It powers ~250 components across web and native shells.\n\n## Highlights\n\n- Token-driven theming with light, dark, and brand variants\n- Accessibility audited components (WCAG AA)\n- Figma kit kept in sync via codegen\n\n## Outcome\n\nReduced design-to-code iteration time by **48%** and cut new-feature ramp by 2 weeks per surface.",
          category: "Design System",
          date: new Date("2025-09-12"),
          tags: ["Figma", "Tailwind", "TypeScript", "Radix"],
          featured: true,
          published: true,
          sortOrder: 0,
        },
        {
          slug: "fieldnote-ios-app",
          title: "Fieldnote — A focus journal for iOS",
          summary:
            "An ambient daily journaling app with on-device transcription, mood graphs, and haptic micro-interactions.",
          content:
            "## Concept\n\nA gentle daily journaling app — capture short voice notes, get on-device transcription, and watch moods bloom over time.\n\n## What I built\n\n- SwiftUI + Liquid Glass UI\n- CoreML transcription pipeline\n- Subtle haptic feedback for moments of focus",
          category: "Mobile",
          date: new Date("2025-04-02"),
          tags: ["SwiftUI", "CoreML", "Liquid Glass"],
          featured: true,
          published: true,
          sortOrder: 1,
        },
        {
          slug: "low-orbit-marketing-site",
          title: "Low Orbit — Marketing site & brand",
          summary:
            "A satellite-tracking startup needed a brand-forward marketing site. Built with Next.js, Three.js, and a touch of restraint.",
          content:
            "## Brief\n\nA satellite-tracking startup wanted a marketing site that felt grounded but excited.\n\n## Build\n\n- Next.js + RSC for fast, content-driven pages\n- A small Three.js orbit scene for the hero\n- An MDX-powered blog for engineering deep-dives",
          category: "Web",
          date: new Date("2024-11-22"),
          tags: ["Next.js", "Three.js", "Branding"],
          featured: false,
          published: true,
          sortOrder: 2,
        },
      ],
    });
    console.log("  ✓ Seeded 3 sample projects.");
  } else {
    console.log("  • Projects already present — skipped.");
  }

  console.log("\n✓ Seed complete. You can sign in at /sign-in.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
