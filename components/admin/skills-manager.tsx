"use client";

import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSkill, deleteSkill } from "@/app/admin/actions";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  sortOrder: number;
};

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [pending, start] = useTransition();

  function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    start(() => {
      void deleteSkill(id);
    });
  }

  return (
    <div className="space-y-6">
      {/* New skill form */}
      <form
        action={saveSkill}
        className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface/60 p-4"
      >
        <div className="grid flex-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Name
            </label>
            <Input name="name" required placeholder="TypeScript" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <Input name="category" defaultValue="General" placeholder="Languages" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Level (0–100)
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              name="level"
              defaultValue={80}
            />
          </div>
        </div>
        <Button type="submit">
          <Plus className="size-4" /> Add skill
        </Button>
      </form>

      {/* Existing skills */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/60">
        {skills.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No skills yet. Add your first one above.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {skills.map((s) => (
              <li key={s.id} className="p-4">
                <form
                  action={saveSkill}
                  className="grid items-center gap-3 sm:grid-cols-[1fr_1fr_120px_100px_auto]"
                >
                  <input type="hidden" name="id" value={s.id} />
                  <Input name="name" defaultValue={s.name} placeholder="Name" />
                  <Input name="category" defaultValue={s.category} placeholder="Category" />
                  <Input
                    type="number"
                    name="level"
                    min={0}
                    max={100}
                    defaultValue={s.level}
                  />
                  <Input
                    type="number"
                    name="sortOrder"
                    defaultValue={s.sortOrder}
                    placeholder="Order"
                  />
                  <div className="flex items-center justify-end gap-1">
                    <Button type="submit" size="sm" variant="secondary">
                      Save
                    </Button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onDelete(s.id, s.name)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
