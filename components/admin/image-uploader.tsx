"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  hint,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Upload failed");
      onChange(body.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground/80">{label}</p>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <div className="relative aspect-[16/9]">
            <Image
              src={value}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border bg-surface/80 px-3 py-2">
            <span className="truncate text-xs text-muted-foreground" title={value}>
              {value}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange(null)}
            >
              <X className="size-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 text-muted-foreground transition-colors hover:border-brand-400/40 hover:bg-brand-400/5 hover:text-foreground disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Upload className="size-5" />
          )}
          <span className="text-sm">
            {busy ? "Uploading…" : "Click to upload an image"}
          </span>
          <span className="text-xs opacity-70">PNG, JPG, WEBP, GIF · max 8MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      <div className="flex items-center gap-2">
        <Input
          placeholder="…or paste an image URL"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {err && (
        <p className="text-xs text-rose-600 dark:text-rose-300">{err}</p>
      )}
    </div>
  );
}
