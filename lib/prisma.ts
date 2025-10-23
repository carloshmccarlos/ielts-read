import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ 
	connectionString,
	// Note: Connection pooling is handled by Neon automatically
	// Custom pool configuration is not supported with PrismaNeon adapter
});

// Optimize Prisma client configuration
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
	adapter,
	log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	errorFormat: 'minimal',
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
