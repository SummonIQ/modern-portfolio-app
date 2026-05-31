import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (id === "new") return redirect("/admin/projects/new");
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return <ProjectForm project={project} />;
}
