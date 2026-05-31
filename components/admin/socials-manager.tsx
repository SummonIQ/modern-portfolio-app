"use client";

import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSocial, deleteSocial } from "@/app/admin/actions";

type Social = {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  sortOrder: number;
};

const ICON_HINT =
  "Icon name (lowercase): github, linkedin, twitter, instagram, youtube, dribbble, figma, mail";

export function SocialsManager({ socials }: { socials: Social[] }) {
  const [pending, start] = useTransition();

  function onDelete(id: string, platform: string) {
    if (!confirm(`Remove "${platform}" link?`)) return;
    start(() => {
      void deleteSocial(id);
    });
  }

  return (
    <div className="space-y-6">
      <form
        action={saveSocial}
        className="space-y-3 rounded-2xl border border-border bg-surface/60 p-4"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Platform
            </label>
            <Input name="platform" required placeholder="GitHub" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              URL
            </label>
            <Input name="url" type="url" required placeholder="https://github.com/you" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Icon
            </label>
            <Input name="icon" placeholder="github" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{ICON_HINT}</p>
          <Button type="submit">
            <Plus className="size-4" /> Add link
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface/60">
        {socials.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No social links yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {socials.map((s) => (
              <li key={s.id} className="p-4">
                <form
                  action={saveSocial}
                  className="grid items-center gap-3 sm:grid-cols-[1fr_2fr_140px_100px_auto]"
                >
                  <input type="hidden" name="id" value={s.id} />
                  <Input name="platform" defaultValue={s.platform} placeholder="Platform" />
                  <Input name="url" defaultValue={s.url} placeholder="URL" />
                  <Input name="icon" defaultValue={s.icon ?? ""} placeholder="Icon" />
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
                      onClick={() => onDelete(s.id, s.platform)}
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
