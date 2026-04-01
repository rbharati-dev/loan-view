import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || "file:./dev.db",
    }),
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

