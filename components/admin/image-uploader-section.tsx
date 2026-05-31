"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";

/**
 * Wraps ImageUploader in a card with a hidden form input so it can be used as
 * a controlled field inside server-action <form>s.
 */
export function ImageUploaderSection({
  label,
  name,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string | null | undefined;
  hint?: string;
}) {
  const [value, setValue] = useState<string | null>(defaultValue ?? null);
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6">
      <ImageUploader
        label={label}
        value={value}
        onChange={setValue}
        hint={hint}
      />
      <input type="hidden" name={name} value={value ?? ""} />
    </div>
  );
}
