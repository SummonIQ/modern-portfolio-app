import Link from "next/link";
import { SocialIcons } from "@/components/marketing/social-icons";

export function SiteFooter({
  ownerName,
  socials,
  contactEmail,
}: {
  ownerName: string;
  socials: Array<{ id: string; platform: string; url: string; icon?: string | null }>;
  contactEmail: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            © {year} {ownerName}. Built with Next.js & ☕.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a
              href={`mailto:${contactEmail}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {contactEmail}
            </a>
            <span className="text-border">·</span>
            <Link
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Get in touch
            </Link>
          </div>
        </div>
        <SocialIcons links={socials} />
      </div>
    </footer>
  );
}
