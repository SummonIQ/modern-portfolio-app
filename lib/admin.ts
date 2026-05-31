import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  const role = (session.user as { role?: string }).role;
  if (role && role !== "admin") redirect("/");
  return session;
}

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}
