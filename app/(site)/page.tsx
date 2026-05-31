import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { ProjectCard } from "@/components/marketing/project-card";
import { Section, SectionHeading } from "@/components/marketing/section";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublishedProjects, getSkills, getSocialLinks } from "@/lib/portfolio";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, socials, featured, allProjects, skills] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
    getPublishedProjects({ featured: true, take: 4 }),
    getPublishedProjects({ take: 6 }),
    getSkills(),
  ]);

  const projects = featured.length > 0 ? featured : allProjects.slice(0, 4);

  // Group skills by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <Hero
        ownerName={settings.ownerName}
        headline={settings.headline}
        tagline={settings.tagline}
        socials={socials}
      />

      {/* About teaser */}
      <Section id="below-fold" className="py-20">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_2fr]">
          <SectionHeading
            eyebrow="About"
            title={settings.aboutTitle}
            subtitle={null}
          />
          <div className="space-y-4 text-pretty text-lg text-foreground/85 leading-relaxed">
            <p>{settings.aboutSummary}</p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              More about me
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Toolkit"
          title={settings.skillsTitle}
          subtitle={settings.skillsSubtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(grouped).map(([category, list], i) => {
            const palette = [
              { rgb: "139, 92, 246" },   // violet
              { rgb: "251, 146, 60" },   // peach
              { rgb: "34, 211, 238" },   // cyan
              { rgb: "236, 72, 153" },   // pink
              { rgb: "163, 230, 53" },   // lime
              { rgb: "129, 140, 248" },  // indigo
            ];
            const c = palette[i % palette.length];
            return (
              <div
                key={category}
                className="group relative rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  boxShadow: `-40px -40px 120px -20px rgba(${c.rgb}, 0.28), -10px -10px 60px -10px rgba(${c.rgb}, 0.18)`,
                  ["--g" as string]: c.rgb,
                }}
              >
                {/* Outer atmospheric glow at the top-left corner — sits behind the card */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-16 -z-10 opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                  style={{
                    background: `radial-gradient(40% 40% at 0% 0%, rgba(${c.rgb}, 0.55), rgba(${c.rgb}, 0) 70%)`,
                  }}
                />
                {/* Corner gradient (inside the card) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
                >
                  <span
                    className="absolute -top-24 -left-24 size-56 rounded-full opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(closest-side, rgba(${c.rgb}, 0.65), rgba(${c.rgb}, 0) 70%)`,
                    }}
                  />
                </span>
                {/* Subtle border highlight on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 0 1px rgba(${c.rgb}, 0.35)`,
                  }}
                />
                <div className="relative">
                  <h3
                    className="text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: `rgba(${c.rgb}, 1)` }}
                  >
                    {category}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {list.map((s) => (
                      <li
                        key={s.id}
                        className="rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm text-foreground transition-colors"
                        style={{
                          borderColor: `rgba(${c.rgb}, 0.18)`,
                        }}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Featured projects */}
      <Section className="py-16">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title={settings.projectsTitle}
            subtitle={settings.projectsSubtitle}
          />
          <Link
            href="/projects"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground transition-opacity hover:opacity-70 sm:inline-flex"
          >
            All work <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              priority={i < 2}
              className={i === 0 && projects.length > 2 ? "sm:col-span-2" : ""}
            />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-500/10 via-surface to-accent2-400/10 p-10 sm:p-16">
          <div className="bf-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative max-w-2xl">
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl text-balance">
              Have something in mind? Let&apos;s build it together.
            </h3>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {settings.contactBlurb}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">
                Start a project
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${settings.contactEmail}`}
                size="lg"
                variant="outline"
              >
                Email me directly
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
