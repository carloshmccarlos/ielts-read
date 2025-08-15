import { cache } from "react";
import { unstable_cache } from "next/cache";

// Enhanced caching wrapper for database queries
export function createOptimizedQuery<T extends any[], R>(
	queryFn: (...args: T) => Promise<R>,
	keyPrefix: string,
	options: {
		revalidate?: number;
		tags?: string[];
	} = {}
) {
	const { revalidate = 300, tags = [] } = options; // 5 minutes default

	// Use React cache for request-level deduplication
	const cachedQuery = cache(queryFn);

	// Use Next.js unstable_cache for persistent caching
	const persistentCachedQuery = unstable_cache(
		cachedQuery,
		[keyPrefix],
		{
			revalidate,
			tags: [keyPrefix, ...tags],
		}
	);

	return persistentCachedQuery;
}

// Batch query optimization
export class QueryBatcher {
	private batches = new Map<string, Promise<any>>();
	private timeouts = new Map<string, NodeJS.Timeout>();

	batch<T>(
		key: string,
		queryFn: () => Promise<T>,
		delay: number = 10
	): Promise<T> {
		// If query is already batched, return existing promise
		if (this.batches.has(key)) {
			return this.batches.get(key)!;
		}

		// Create new batched query
		const promise = new Promise<T>((resolve, reject) => {
			const timeout = setTimeout(async () => {
				try {
					const result = await queryFn();
					resolve(result);
				} catch (error) {
					reject(error);
				} finally {
					this.batches.delete(key);
					this.timeouts.delete(key);
				}
			}, delay);

			this.timeouts.set(key, timeout);
		});

		this.batches.set(key, promise);
		return promise;
	}

	clear(key?: string) {
		if (key) {
			const timeout = this.timeouts.get(key);
			if (timeout) {
				clearTimeout(timeout);
				this.timeouts.delete(key);
			}
			this.batches.delete(key);
		} else {
			// Clear all batches
			for (const timeout of this.timeouts.values()) {
				clearTimeout(timeout);
			}
			this.batches.clear();
			this.timeouts.clear();
		}
	}
}

export const queryBatcher = new QueryBatcher();

// Preload critical data
export function preloadCriticalData() {
	// This can be called in layout or page components to preload data
	if (typeof window === "undefined") {
		// Server-side preloading
		return {
			preloadArticles: () => import("@/lib/actions/article").then(m => m.getLatestArticles()),
			preloadCategories: () => import("@/lib/actions/category").then(m => m.getAllCategories()),
		};
	}
	return {};
}

// Query performance monitoring
export function withQueryPerformance<T extends any[], R>(
	queryFn: (...args: T) => Promise<R>,
	queryName: string
) {
	return async (...args: T): Promise<R> => {
		const start = performance.now();
		
		try {
			const result = await queryFn(...args);
			const duration = performance.now() - start;
			
			if (process.env.NODE_ENV === "development") {
				console.log(`🔍 Query ${queryName}: ${duration.toFixed(2)}ms`);
				
				if (duration > 1000) {
					console.warn(`⚠️ Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
				}
			}
			
			return result;
		} catch (error) {
			const duration = performance.now() - start;
			console.error(`❌ Query ${queryName} failed after ${duration.toFixed(2)}ms:`, error);
			throw error;
		}
	};
}
