import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ContactForm } from "@/components/marketing/contact-form";
import { SocialIcons } from "@/components/marketing/social-icons";
import { getSiteSettings } from "@/lib/site-settings";
import { getSocialLinks } from "@/lib/portfolio";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [settings, socials] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);

  return (
    <Section className="pt-16">
      <SectionHeading
        eyebrow="Contact"
        title="Let's make something."
        subtitle={settings.contactBlurb}
      />

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Reach me at
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-70"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-400/10 text-brand-700 dark:text-brand-300">
                    <Mail className="size-4" />
                  </span>
                  {settings.contactEmail}
                </a>
              </li>
              {settings.contactPhone && (
                <li className="flex items-center gap-3 text-foreground">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-400/10 text-brand-700 dark:text-brand-300">
                    <Phone className="size-4" />
                  </span>
                  {settings.contactPhone}
                </li>
              )}
              {settings.contactLocation && (
                <li className="flex items-center gap-3 text-foreground">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-400/10 text-brand-700 dark:text-brand-300">
                    <MapPin className="size-4" />
                  </span>
                  {settings.contactLocation}
                </li>
              )}
            </ul>
          </div>
          {socials.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Elsewhere
              </h3>
              <SocialIcons links={socials} className="mt-4" />
            </div>
          )}
        </aside>

        <div className="rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
