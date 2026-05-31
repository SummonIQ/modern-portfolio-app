import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getSocialLinks } from "@/lib/portfolio";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, socials] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader ownerName={settings.ownerName} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        ownerName={settings.ownerName}
        socials={socials}
        contactEmail={settings.contactEmail}
      />
    </div>
  );
}
