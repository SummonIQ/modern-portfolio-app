"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { PlateMarkdownEditor } from "@/components/ui/plate-markdown-editor";
import { saveProject } from "@/app/admin/actions";

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  category: string;
  date: Date;
  coverImage: string | null;
  link: string | null;
  gallery: unknown;
  tags: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export function ProjectForm({ project }: { project: Project | null }) {
  const isNew = !project;
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? null);
  const [galleryJson, setGalleryJson] = useState(
    project?.gallery ? JSON.stringify(project.gallery, null, 2) : "",
  );

  return (
    <form action={saveProject} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All projects
        </Link>
        <div className="flex items-center gap-2">
          <Button type="submit">
            <Save className="size-4" /> {isNew ? "Create project" : "Save changes"}
          </Button>
        </div>
      </div>

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {isNew ? "New project" : project!.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isNew
            ? "Add a new piece of work to your portfolio."
            : "Edit this project's details below."}
        </p>
      </div>

      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-2xl border border-border bg-surface/60 p-6">
          <Field label="Title">
            <Input
              name="title"
              required
              defaultValue={project?.title ?? ""}
              placeholder="e.g. Atlas — A modern design system"
            />
          </Field>
          <Field label="Slug" hint="Auto-generated from the title if left blank.">
            <Input
              name="slug"
              defaultValue={project?.slug ?? ""}
              placeholder="atlas-design-system"
            />
          </Field>
          <Field label="Short summary" hint="One paragraph shown on cards and SEO.">
            <Textarea
              name="summary"
              required
              rows={2}
              defaultValue={project?.summary ?? ""}
              placeholder="A token-driven design system that powers a multi-brand SaaS…"
            />
          </Field>
          <Field
            label="Full description"
            hint="Supports ## subheads, - bullets, **bold**, links, and `code`."
          >
            <PlateMarkdownEditor
              name="content"
              defaultValue={project?.content ?? ""}
              size="lg"
              placeholder="Tell the story behind this project…"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-border bg-surface/60 p-5">
            <ImageUploader
              label="Cover image"
              value={coverImage}
              onChange={setCoverImage}
              hint="Shown on the project card and detail page."
            />
            <input type="hidden" name="coverImage" value={coverImage ?? ""} />
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-surface/60 p-5">
            <Field label="Category">
              <Input
                name="category"
                required
                defaultValue={project?.category ?? ""}
                placeholder="Web · Design · Mobile…"
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                name="date"
                required
                defaultValue={
                  project?.date
                    ? new Date(project.date).toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10)
                }
              />
            </Field>
            <Field label="Project link">
              <Input
                name="link"
                type="url"
                defaultValue={project?.link ?? ""}
                placeholder="https://…"
              />
            </Field>
            <Field label="Tags / stack" hint="Comma-separated.">
              <Input
                name="tags"
                defaultValue={(project?.tags ?? []).join(", ")}
                placeholder="Next.js, TypeScript, Tailwind"
              />
            </Field>
            <Field label="Sort order" hint="Lower numbers appear first.">
              <Input
                type="number"
                name="sortOrder"
                defaultValue={project?.sortOrder ?? 0}
              />
            </Field>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-surface/60 p-5">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project?.featured ?? false}
                className="mt-0.5 size-4 rounded border-border"
              />
              <div>
                <p className="font-medium text-foreground">Featured</p>
                <p className="text-xs text-muted-foreground">
                  Highlight this on the homepage.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={project?.published ?? true}
                className="mt-0.5 size-4 rounded border-border"
              />
              <div>
                <p className="font-medium text-foreground">Published</p>
                <p className="text-xs text-muted-foreground">
                  Visible on the public site.
                </p>
              </div>
            </label>
          </div>

          <details className="rounded-2xl border border-border bg-surface/60 p-5">
            <summary className="cursor-pointer text-sm font-medium text-foreground/80">
              Gallery (advanced — JSON)
            </summary>
            <p className="mt-2 text-xs text-muted-foreground">
              Optional list of additional images. Format:{" "}
              <code className="rounded bg-muted px-1">{`[{"url":"https://…","caption":"…"}]`}</code>
            </p>
            <Textarea
              name="gallery"
              rows={5}
              className="mt-3 font-mono text-xs"
              value={galleryJson}
              onChange={(e) => setGalleryJson(e.target.value)}
              placeholder='[{"url":"…","caption":"…"}]'
            />
          </details>
        </div>
      </div>
    </form>
  );
}
