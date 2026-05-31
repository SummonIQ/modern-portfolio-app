"use client";

import { useMemo, useState } from "react";
import { ProjectCard, type ProjectCardData } from "@/components/marketing/project-card";
import { cn } from "@/lib/cn";

export function ProjectFilter({
  projects,
  categories,
}: {
  projects: ProjectCardData[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (active !== "all" && p.category !== active) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, active, query]);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Pill active={active === "all"} onClick={() => setActive("all")}>
            All
          </Pill>
          {categories.map((c) => (
            <Pill
              key={c}
              active={active === c}
              onClick={() => setActive(c)}
            >
              {c}
            </Pill>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring md:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-muted-foreground">
          No projects match that filter yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-foreground/30 bg-foreground text-background"
          : "border-border bg-surface-2/50 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
