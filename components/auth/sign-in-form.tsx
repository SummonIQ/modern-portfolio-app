"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);

    const data = new FormData(e.currentTarget);
    const res = await authClient.signIn.email({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (res.error) {
      setBusy(false);
      setErr(res.error.message ?? "Sign-in failed");
      return;
    }

    // Wait briefly for the cookie to land, then redirect.
    for (let i = 0; i < 5; i++) {
      const r = await fetch("/api/auth/get-session", {
        cache: "no-store",
        credentials: "include",
      });
      const session = r.ok ? await r.json().catch(() => null) : null;
      if (session?.session && session?.user) break;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
    window.location.replace("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field label="Email">
        <Input name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Password">
        <Input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      {err && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          {err}
        </div>
      )}
      <Button type="submit" disabled={busy} className="mt-1">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
