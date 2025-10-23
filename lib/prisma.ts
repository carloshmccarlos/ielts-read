import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ 
	connectionString,
	// Optimize connection pooling
	pool: {
		max: 10,
		min: 2,
		acquireTimeoutMillis: 30000,
		createTimeoutMillis: 30000,
		destroyTimeoutMillis: 5000,
		idleTimeoutMillis: 30000,
		reapIntervalMillis: 1000,
		createRetryIntervalMillis: 200,
	}
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
