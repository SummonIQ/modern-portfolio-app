import { Save } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { saveSiteSettings } from "@/app/admin/actions";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();
  return (
    <form action={saveSiteSettings} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Site settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Section copy, contact info, and SEO metadata.
          </p>
        </div>
        <Button type="submit">
          <Save className="size-4" /> Save changes
        </Button>
      </div>

      <div className="mx-auto w-[97%] space-y-4 rounded-2xl border-y border-border bg-surface/60 py-6 pl-10 pr-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Section copy
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Skills section title">
            <Input name="skillsTitle" defaultValue={s.skillsTitle} />
          </Field>
          <Field label="Skills subtitle">
            <Input name="skillsSubtitle" defaultValue={s.skillsSubtitle} />
          </Field>
          <Field label="Projects section title">
            <Input name="projectsTitle" defaultValue={s.projectsTitle} />
          </Field>
          <Field label="Projects subtitle">
            <Input name="projectsSubtitle" defaultValue={s.projectsSubtitle} />
          </Field>
        </div>
      </div>

      <div className="mx-auto w-[97%] space-y-4 rounded-2xl border-y border-border bg-surface/60 py-6 pl-10 pr-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Contact
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email">
            <Input
              name="contactEmail"
              type="email"
              defaultValue={s.contactEmail}
            />
          </Field>
          <Field label="Phone (optional)">
            <Input name="contactPhone" defaultValue={s.contactPhone ?? ""} />
          </Field>
          <Field label="Location (optional)">
            <Input
              name="contactLocation"
              defaultValue={s.contactLocation ?? ""}
              placeholder="Brooklyn, NY"
            />
          </Field>
        </div>
        <Field label="Contact blurb">
          <Textarea
            name="contactBlurb"
            rows={2}
            defaultValue={s.contactBlurb}
          />
        </Field>
      </div>

      <div className="mx-auto w-[97%] space-y-4 rounded-2xl border-y border-border bg-surface/60 py-6 pl-10 pr-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          SEO
        </h2>
        <Field label="Site title">
          <Input name="siteTitle" defaultValue={s.siteTitle} />
        </Field>
        <Field label="Site description" hint="One short sentence; used for OpenGraph + meta description.">
          <Textarea
            name="siteDescription"
            rows={2}
            defaultValue={s.siteDescription}
          />
        </Field>
        <Field
          label="Site URL"
          hint="The canonical URL of your portfolio (no trailing slash)."
        >
          <Input
            name="siteUrl"
            type="url"
            defaultValue={s.siteUrl}
            placeholder="https://yourdomain.com"
          />
        </Field>
      </div>

    </form>
  );
}
