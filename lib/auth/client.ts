import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const resolvedBaseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL;

export const authClient = createAuthClient({
  baseURL: resolvedBaseUrl,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
      },
    }),
  ],
});

export const { signIn, signOut, useSession } = authClient;
