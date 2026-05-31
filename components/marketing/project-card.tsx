import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: Date;
  coverImage: string | null;
  tags: string[];
  featured?: boolean;
};

export function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: ProjectCardData;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-[0_30px_60px_-30px_rgba(139,92,246,0.45)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-500/15 via-brand-700/10 to-accent2-400/10">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl font-semibold text-foreground/15">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-30" />
        <div className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-md transition-all group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-brand-400/10 px-2 py-0.5 font-medium text-brand-700 ring-1 ring-brand-400/30 dark:text-brand-300">
            {project.category}
          </span>
          <span>·</span>
          <time>
            {new Date(project.date).toLocaleDateString("en", {
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground text-pretty">
          {project.summary}
        </p>
        {project.tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((t) => (
              <li
                key={t}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
