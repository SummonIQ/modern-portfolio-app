import * as React from "react";
import { marked } from "marked";
import { cn } from "@/lib/cn";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Renders the markdown content saved by PlateMarkdownEditor as styled HTML for
 * the public portfolio. Falls back to `fallback` when the body is empty.
 */
export function PlateRenderer({
  value,
  className,
  fallback,
}: {
  value: string | null | undefined;
  className?: string;
  fallback?: React.ReactNode;
}) {
  if (!value || !value.trim()) {
    return fallback ? (
      <div className={cn("prose-portfolio", className)}>{fallback}</div>
    ) : null;
  }

  const html = marked.parse(value, { async: false }) as string;

  return (
    <div
      className={cn("prose-portfolio", className)}
      // marked output is sanitized at write-time by the editor (admin-only).
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
