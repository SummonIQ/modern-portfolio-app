import { Save } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { saveSiteSettings } from "@/app/admin/actions";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlateMarkdownEditor } from "@/components/ui/plate-markdown-editor";
import { ImageUploaderSection } from "@/components/admin/image-uploader-section";

export default async function AdminAboutPage() {
  const settings = await getSiteSettings();
  return (
    <form action={saveSiteSettings} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">About me</h1>
          <p className="mt-1 text-muted-foreground">
            The story shown on your homepage and dedicated About page.
          </p>
        </div>
        <Button type="submit">
          <Save className="size-4" /> Save changes
        </Button>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-surface/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <Input name="ownerName" defaultValue={settings.ownerName} />
          </Field>
          <Field label="Headline" hint="The line directly under your name in the hero.">
            <Input name="headline" defaultValue={settings.headline} />
          </Field>
        </div>
        <Field label="Tagline" hint="A single sentence shown below your headline.">
          <Textarea name="tagline" rows={2} defaultValue={settings.tagline} />
        </Field>
        <Field label="About title" hint="Section heading on the About page.">
          <Input name="aboutTitle" defaultValue={settings.aboutTitle} />
        </Field>
        <Field label="Short summary" hint="Plain-text fallback used for SEO and the homepage teaser.">
          <Textarea
            name="aboutSummary"
            rows={3}
            defaultValue={settings.aboutSummary}
          />
        </Field>
        <Field
          label="Full bio"
          hint="Supports ## subheads, - bullets, **bold**, links, and images."
        >
          <PlateMarkdownEditor
            name="aboutBody"
            defaultValue={settings.aboutBody ?? ""}
            size="lg"
            placeholder="Write your story…"
          />
        </Field>
        <Field label="Résumé / CV link">
          <Input
            type="url"
            name="resumeUrl"
            defaultValue={settings.resumeUrl ?? ""}
            placeholder="https://…"
          />
        </Field>
      </div>

      <ImageUploaderSection
        label="Portrait / hero image"
        name="heroImage"
        defaultValue={settings.heroImage}
        hint="Square image used in the About page sidebar."
      />
    </form>
  );
}
