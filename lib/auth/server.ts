import "server-only";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db/client";

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3030";

export const config: BetterAuthOptions = {
  appName: "modern-portfolio-app",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookiePrefix: "portfolio",
    disableCSRFCheck: false,
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  database: prismaAdapter(db, { provider: "postgresql" }),
  logger: {
    disabled: process.env.NODE_ENV === "production",
    level: process.env.NODE_ENV === "production" ? "error" : "info",
  },
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    // sign-up disabled by route gating; admin is created via the seed script
    disableSignUp: true,
    maxPasswordLength: 128,
    minPasswordLength: 8,
  },
  plugins: [nextCookies()],
  session: {
    cookieCache: { enabled: false },
    expiresIn: 7 * 24 * 60 * 60,
    freshAge: 7 * 24 * 60 * 60,
    preserveSessionInDatabase: false,
    updateAge: 24 * 60 * 60,
  },
  trustedOrigins: [baseURL, "http://localhost:3030", "http://127.0.0.1:3030"],
  user: {
    modelName: "user",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "admin" },
    },
  },
};

export const auth = betterAuth(config);
