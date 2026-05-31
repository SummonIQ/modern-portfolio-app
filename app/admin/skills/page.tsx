import { db } from "@/lib/db/client";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const skills = await db.skill.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Skills</h1>
        <p className="mt-1 text-muted-foreground">
          Manage the skills that appear on your home and about pages.
        </p>
      </header>
      <SkillsManager skills={skills} />
    </div>
  );
}
