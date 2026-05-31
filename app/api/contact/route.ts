import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(1).max(4000),
  website: z.string().max(0).optional().default(""), // honeypot
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (parsed.website) {
    // Honeypot tripped — accept silently.
    return NextResponse.json({ ok: true });
  }
  try {
    await db.contactMessage.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        subject: parsed.subject || null,
        message: parsed.message,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not save your message — please email me directly." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
