import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role && role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image uploads aren't configured yet. Add BLOB_READ_WRITE_TOKEN in your env to enable Vercel Blob.",
      },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const key = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
