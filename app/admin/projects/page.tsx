import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db/client";
import { ButtonLink } from "@/components/ui/button";
import { ProjectsTable } from "@/components/admin/projects-table";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Add, edit, and reorder the projects shown on your site.
          </p>
        </div>
        <ButtonLink href="/admin/projects/new">
          <Plus className="size-4" /> New project
        </ButtonLink>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <p className="text-muted-foreground">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="mt-3 inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <ProjectsTable projects={projects} />
      )}
    </div>
  );
}
