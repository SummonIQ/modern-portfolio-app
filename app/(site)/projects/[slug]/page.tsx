import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import { Section } from "@/components/marketing/section";
import { ProjectCard } from "@/components/marketing/project-card";
import { PlateRenderer } from "@/components/plate-renderer";
import { ButtonLink } from "@/components/ui/button";
import { getProjectBySlug, getPublishedProjects } from "@/lib/portfolio";

export const revalidate = 60;

type GalleryItem = { url: string; caption?: string };

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : [],
      type: "article",
    },
  };
}

export default async function ProjectDetailPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getPublishedProjects();
  const others = all
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const gallery: GalleryItem[] =
    Array.isArray(project.gallery) && project.gallery.length
      ? (project.gallery as GalleryItem[])
      : [];

  return (
    <>
      <Section className="pt-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to all work
        </Link>

        <header className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-brand-400/10 px-2.5 py-1 font-medium text-brand-700 ring-1 ring-brand-400/30 dark:text-brand-300">
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <time>
                  {new Date(project.date).toLocaleDateString("en", {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
              {project.summary}
            </p>
          </div>
          <div className="flex md:justify-end">
            {project.link && (
              <ButtonLink href={project.link} target="_blank" rel="noopener noreferrer">
                Visit project <ArrowUpRight className="size-4" />
              </ButtonLink>
            )}
          </div>
        </header>

        {project.coverImage && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        )}
      </Section>

      <Section className="py-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <article>
            <PlateRenderer
              value={project.content}
              fallback={<p>{project.summary}</p>}
            />
          </article>
          <aside className="space-y-5 md:sticky md:top-24 md:self-start">
            {project.tags.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface/60 p-5">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Tag className="size-3.5" /> Stack
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-md bg-muted px-2 py-1 text-xs text-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-2xl border border-border bg-surface/60 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Details
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">{project.category}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">
                    {new Date(project.date).toLocaleDateString("en", {
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      {gallery.length > 0 && (
        <Section className="py-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Gallery</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="group overflow-hidden rounded-2xl border border-border bg-muted"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={g.url}
                    alt={g.caption ?? project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                {g.caption && (
                  <figcaption className="border-t border-border bg-surface/60 px-4 py-2 text-sm text-muted-foreground">
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Section>
      )}

      {others.length > 0 && (
        <Section className="py-16">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight">More work</h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              See all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
