"use client";

import { useState } from "react";
import { Check, Copy, Info } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Visible on the sign-in page so reviewers / first-time visitors can sign in
 * straight away. Reads the seeded admin creds from NEXT_PUBLIC_DEMO_*.
 */
export function DemoCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, key: string) {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mt-5 rounded-2xl border border-brand-400/30 bg-brand-400/5 p-4 text-sm backdrop-blur-md">
      <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
        <Info className="size-4 shrink-0" />
        <span className="font-semibold">Demo credentials</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Click to copy, then paste into the form above.
      </p>
      <div className="mt-3 space-y-1.5">
        <CredRow
          label="Email"
          value={email}
          copied={copied === "email"}
          onCopy={() => copy(email, "email")}
        />
        <CredRow
          label="Password"
          value={password}
          copied={copied === "password"}
          onCopy={() => copy(password, "password")}
        />
      </div>
    </div>
  );
}

function CredRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-left transition-colors hover:border-brand-400/50 hover:bg-background/80",
      )}
    >
      <span className="w-16 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <code className="flex-1 truncate font-mono text-xs text-foreground">
        {value}
      </code>
      <span className="text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? (
          <Check className="size-4 text-emerald-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </span>
    </button>
  );
}
