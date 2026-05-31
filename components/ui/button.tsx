import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 shadow-[0_8px_30px_-12px_rgba(139,92,246,0.6)] hover:shadow-[0_8px_40px_-8px_rgba(139,92,246,0.7)] focus-visible:ring-foreground/30",
  secondary:
    "bg-surface-2 text-foreground border border-border hover:bg-muted focus-visible:ring-ring",
  ghost:
    "bg-transparent text-foreground/80 hover:text-foreground hover:bg-muted",
  outline:
    "bg-transparent text-foreground border border-border hover:border-foreground/30 hover:bg-muted focus-visible:ring-ring",
  danger:
    "bg-danger text-danger-foreground hover:bg-danger/90 focus-visible:ring-danger",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-xl",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}
