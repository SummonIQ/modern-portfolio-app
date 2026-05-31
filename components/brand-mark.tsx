import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandMark({
  name = "Portfolio",
  href = "/",
  className,
}: {
  name?: string;
  href?: string;
  className?: string;
}) {
  // Initials from up to two words
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "P";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 font-semibold tracking-tight",
        className,
      )}
    >
      <span className="relative inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-[11px] font-bold text-white shadow-[0_4px_18px_-6px_rgba(139,92,246,0.6)] transition-transform group-hover:scale-105">
        {initials}
        <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-br from-brand-400/40 to-brand-600/30 blur-md opacity-60 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="text-foreground">{name}</span>
    </Link>
  );
}
