import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedDb: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? "";
  // Skip SSL for local Postgres URLs.
  const isLocal =
    connectionString.startsWith("postgres://localhost") ||
    connectionString.startsWith("postgresql://localhost") ||
    connectionString.includes("@localhost") ||
    connectionString.includes("@127.0.0.1") ||
    connectionString.includes("sslmode=disable");
  const adapter = new PrismaPg({
    connectionString,
    ...(isLocal ? {} : { ssl: { rejectUnauthorized: true } }),
  });
  return new PrismaClient({ adapter });
}

const db: PrismaClient =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (global.cachedDb ??= createPrismaClient());

export { db };
