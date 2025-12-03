import {getPrisma} from "./prisma.js"
export function withPrisma(handler) {
  return async (req, res) => {
    const prisma = getPrisma();
    try {
      return await handler(req, res, prisma);
    } finally {
      await prisma.$disconnect();
    }
  };
}
