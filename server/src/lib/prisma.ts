import { PrismaClient } from "@prisma/client";

export function getPrisma() {
  // Create fresh PrismaClient for each request (serverless-safe)
  return new PrismaClient();
}
