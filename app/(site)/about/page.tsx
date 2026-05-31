import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { PlateRenderer } from "@/components/plate-renderer";
import { ButtonLink } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";
import { getSkills, getSocialLinks } from "@/lib/portfolio";

export const revalidate = 60;

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, skills, socials] = await Promise.all([
    getSiteSettings(),
    getSkills(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Section className="pt-16">
        <SectionHeading
          eyebrow="About"
          title={`I'm ${settings.ownerName}.`}
          subtitle={settings.tagline}
        />
        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="space-y-5">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-400/15 to-accent2-400/10">
              {settings.heroImage ? (
                <Image
                  src={settings.heroImage}
                  alt={settings.ownerName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-display text-9xl text-foreground/10">
                  {settings.ownerName.charAt(0)}
                </div>
              )}
            </div>
            {settings.resumeUrl && (
              <ButtonLink
                href={settings.resumeUrl}
                variant="outline"
                className="w-full"
              >
                Download résumé <ArrowUpRight className="size-4" />
              </ButtonLink>
            )}
            {socials.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Find me online
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {socials.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-foreground transition-opacity hover:opacity-70"
                      >
                        {s.platform}
                        <ArrowUpRight className="size-3.5 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <PlateRenderer
              value={settings.aboutBody}
              className="text-base sm:text-lg"
              fallback={
                <p className="text-pretty leading-relaxed">
                  {settings.aboutSummary}
                </p>
              }
            />
          </div>
        </div>
      </Section>

      {/* Detailed skill list */}
      <Section className="py-16">
        <SectionHeading
          eyebrow="Capabilities"
          title="Skills, in detail"
          subtitle={settings.skillsSubtitle}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {skills.map((s) => (
            <div
              key={s.id}
              className="group rounded-xl border border-border bg-surface/60 p-4 transition-colors hover:border-brand-400/30"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {s.category}
                  </p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {s.level}
                  <span className="opacity-60">/100</span>
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-accent2-400 transition-[width] duration-700 ease-out"
                  style={{ width: `${Math.max(0, Math.min(100, s.level))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
