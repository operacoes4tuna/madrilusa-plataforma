import { PrismaClient } from '@prisma/client';

// Singleton pattern para Prisma Client
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client instance
export const prisma = globalThis.__prisma || new PrismaClient({
  log: ['error', 'warn'],
});

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 