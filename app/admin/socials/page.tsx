import { db } from "@/lib/db/client";
import { SocialsManager } from "@/components/admin/socials-manager";

export default async function AdminSocialsPage() {
  const socials = await db.socialLink.findMany({
    orderBy: [{ sortOrder: "asc" }],
  });
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Social links</h1>
        <p className="mt-1 text-muted-foreground">
          Links shown in your header, footer, and contact page.
        </p>
      </header>
      <SocialsManager socials={socials} />
    </div>
  );
}
