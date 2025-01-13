import { PrismaClient } from "@prisma/client";

//* globalThis.prisma ensures that the Prisma client is resued across hot reloas during devlopment
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_KEY !== "production") {
  globalThis.prisma = db;
}
