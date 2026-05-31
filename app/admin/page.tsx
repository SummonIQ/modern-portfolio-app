import Link from "next/link";
import { ArrowUpRight, FolderKanban, Mail, Sparkles } from "lucide-react";
import { db } from "@/lib/db/client";

export default async function AdminOverviewPage() {
  const [projectCount, skillCount, unreadMessages, recentMessages, recentProjects] =
    await Promise.all([
      db.project.count(),
      db.skill.count(),
      db.contactMessage.count({ where: { read: false } }),
      db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    ]);

  const stats = [
    { label: "Projects", value: projectCount, href: "/admin/projects", icon: FolderKanban },
    { label: "Skills", value: skillCount, href: "/admin/skills", icon: Sparkles },
    {
      label: "Unread messages",
      value: unreadMessages,
      href: "/admin/messages",
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s a quick snapshot of your portfolio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-surface"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <s.icon className="size-4" />
              <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="font-display text-4xl font-semibold tabular-nums">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface/60 p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recent projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-sm text-foreground transition-opacity hover:opacity-70"
            >
              All →
            </Link>
          </header>
          <ul className="mt-4 divide-y divide-border">
            {recentProjects.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No projects yet —{" "}
                <Link href="/admin/projects/new" className="underline">
                  add your first one
                </Link>
                .
              </li>
            )}
            {recentProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="min-w-0 flex-1 truncate text-foreground hover:underline"
                >
                  {p.title}
                </Link>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface/60 p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recent messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-sm text-foreground transition-opacity hover:opacity-70"
            >
              All →
            </Link>
          </header>
          <ul className="mt-4 divide-y divide-border">
            {recentMessages.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No messages yet.
              </li>
            )}
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {m.name}
                    {!m.read && (
                      <span className="ml-2 inline-block size-1.5 rounded-full bg-brand-400" />
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.subject || m.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
