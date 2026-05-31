import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SignInForm } from "@/components/auth/sign-in-form";
import { DemoCredentials } from "@/components/auth/demo-credentials";
import { auth } from "@/lib/auth/server";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Sign in" };

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/admin");
  const settings = await getSiteSettings();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="bf-grid pointer-events-none absolute inset-0 opacity-30" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(139,92,246,0.20), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandMark name={settings.ownerName} />
        </div>
        <div className="rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-md shadow-[0_30px_60px_-30px_rgba(139,92,246,0.4)]">
          <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to manage your portfolio.
          </p>
          <div className="mt-5">
            <SignInForm />
          </div>
        </div>
        <DemoCredentials
          email={process.env.ADMIN_EMAIL ?? ""}
          password={process.env.ADMIN_PASSWORD ?? ""}
        />
      </div>
    </div>
  );
}
