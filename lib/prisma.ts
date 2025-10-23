import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ 
	connectionString,
});

// Optimize Prisma client configuration
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Use type assertion to handle adapter type compatibility
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
	adapter: adapter as any,
	log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	errorFormat: 'minimal',
} as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
