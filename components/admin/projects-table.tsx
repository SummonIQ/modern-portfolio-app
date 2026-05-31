"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Edit3, ExternalLink, Star, Trash2 } from "lucide-react";
import { deleteProject } from "@/app/admin/actions";
import { Badge } from "@/components/ui/card";

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: Date;
  featured: boolean;
  published: boolean;
  updatedAt: Date;
};

export function ProjectsTable({ projects }: { projects: Row[] }) {
  const [pending, start] = useTransition();

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    start(() => {
      void deleteProject(id);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/60">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-muted/30">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  {p.featured && (
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  )}
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {p.title}
                  </Link>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">/{p.slug}</p>
              </td>
              <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
              <td className="px-5 py-3 text-muted-foreground">
                {new Date(p.date).toLocaleDateString()}
              </td>
              <td className="px-5 py-3">
                <Badge tone={p.published ? "success" : "warning"}>
                  {p.published ? "Published" : "Draft"}
                </Badge>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="View live"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Edit"
                  >
                    <Edit3 className="size-4" />
                  </Link>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onDelete(p.id, p.title)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
