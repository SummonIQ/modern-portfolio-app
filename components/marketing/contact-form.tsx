"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      // Honeypot — bots will fill this; humans won't see it
      website: String(data.get("website") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not send message.");
      }
      setDone(true);
      (e.target as HTMLFormElement).reset();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Message sent.
        </h3>
        <p className="text-muted-foreground">
          I&apos;ll get back to you within a couple of days.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setDone(false)}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <Input name="name" required autoComplete="name" placeholder="Jane Doe" />
        </Field>
        <Field label="Email">
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
          />
        </Field>
      </div>
      <Field label="Subject">
        <Input name="subject" placeholder="What's on your mind?" />
      </Field>
      <Field label="Message">
        <Textarea
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project, timeline, or just say hello…"
        />
      </Field>
      {err && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          {err}
        </div>
      )}
      <Button type="submit" size="lg" disabled={busy} className="mt-2 w-full sm:w-auto">
        {busy ? "Sending…" : "Send message"}
        <Send className="size-4" />
      </Button>
    </form>
  );
}
