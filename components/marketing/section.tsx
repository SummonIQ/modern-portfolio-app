import * as React from "react";
import { cn } from "@/lib/cn";

export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("mx-auto max-w-6xl px-6 py-16 sm:py-24", className)}
      {...props}
    />
  );
}

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      <span className="size-1 rounded-full bg-brand-400 shadow-[0_0_6px_rgba(167,139,250,0.9)]" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "space-y-3",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base text-muted-foreground sm:text-lg text-pretty",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
