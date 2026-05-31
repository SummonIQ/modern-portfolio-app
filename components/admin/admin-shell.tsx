"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings2,
  Share2,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/socials", label: "Social links", icon: Share2 },
  { href: "/admin/about", label: "About me", icon: User },
  { href: "/admin/settings", label: "Site settings", icon: Settings2 },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminShell({
  children,
  userEmail,
  userName,
}: {
  children: React.ReactNode;
  userEmail: string;
  userName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await authClient.signOut();
    window.location.replace("/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface/40 backdrop-blur-md md:flex md:flex-col">
        <div className="flex h-16 items-center px-5">
          <BrandMark name="Admin" href="/admin" />
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={signOut}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </button>
          <Link
            href="/"
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            ← View public site
          </Link>
        </div>
      </aside>

      {/* Mobile bar */}
      <div className="md:hidden">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
          <BrandMark name="Admin" href="/admin" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <BrandMark name="Admin" href="/admin" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {NAV.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={signOut}
                className="mt-3 flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </nav>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
