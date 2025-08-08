"use client";

import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useAsyncPerformance } from "./usePerformance";

interface OptimizedQueryOptions<TData, TError = Error> extends Omit<UseQueryOptions<TData, TError>, 'queryFn'> {
	queryFn: () => Promise<TData>;
	prefetchOnHover?: boolean;
	backgroundRefetch?: boolean;
	optimisticUpdate?: (oldData: TData | undefined) => TData | undefined;
}

export function useOptimizedQuery<TData, TError = Error>({
	queryKey,
	queryFn,
	prefetchOnHover = false,
	backgroundRefetch = true,
	optimisticUpdate,
	...options
}: OptimizedQueryOptions<TData, TError>) {
	const queryClient = useQueryClient();
	const { measureAsync } = useAsyncPerformance();
	const prefetchTimeoutRef = useRef<NodeJS.Timeout>();

	// Wrap queryFn with performance monitoring
	const wrappedQueryFn = useCallback(async () => {
		return measureAsync(queryFn, `Query: ${JSON.stringify(queryKey)}`);
	}, [queryFn, queryKey, measureAsync]);

	const query = useQuery({
		queryKey,
		queryFn: wrappedQueryFn,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
		refetchOnWindowFocus: backgroundRefetch,
		...options,
	});

	// Prefetch on hover functionality
	const prefetchOnHoverHandler = useCallback(() => {
		if (!prefetchOnHover) return;

		prefetchTimeoutRef.current = setTimeout(() => {
			queryClient.prefetchQuery({
				queryKey,
				queryFn: wrappedQueryFn,
				staleTime: 1000 * 60 * 5,
			});
		}, 100); // Small delay to avoid unnecessary prefetches
	}, [prefetchOnHover, queryClient, queryKey, wrappedQueryFn]);

	const cancelPrefetch = useCallback(() => {
		if (prefetchTimeoutRef.current) {
			clearTimeout(prefetchTimeoutRef.current);
		}
	}, []);

	// Optimistic update functionality
	const updateOptimistically = useCallback((updater: (oldData: TData | undefined) => TData | undefined) => {
		queryClient.setQueryData(queryKey, updater);
	}, [queryClient, queryKey]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (prefetchTimeoutRef.current) {
				clearTimeout(prefetchTimeoutRef.current);
			}
		};
	}, []);

	return {
		...query,
		prefetchOnHover: prefetchOnHoverHandler,
		cancelPrefetch,
		updateOptimistically,
		// Additional utility methods
		invalidate: () => queryClient.invalidateQueries({ queryKey }),
		refetch: () => query.refetch(),
		remove: () => queryClient.removeQueries({ queryKey }),
	};
}

// Hook for batch queries with intelligent loading states
export function useBatchQueries<T extends Record<string, any>>(
	queries: Array<{
		key: string;
		queryKey: unknown[];
		queryFn: () => Promise<any>;
		enabled?: boolean;
	}>
) {
	const results = queries.map(({ key, queryKey, queryFn, enabled = true }) =>
		useOptimizedQuery({
			queryKey,
			queryFn,
			enabled,
		})
	);

	const data = queries.reduce((acc, { key }, index) => {
		acc[key] = results[index].data;
		return acc;
	}, {} as T);

	const isLoading = results.some(result => result.isLoading);
	const isError = results.some(result => result.isError);
	const errors = results.filter(result => result.error).map(result => result.error);

	return {
		data,
		isLoading,
		isError,
		errors,
		results,
		refetchAll: () => Promise.all(results.map(result => result.refetch())),
		invalidateAll: () => results.forEach(result => result.invalidate()),
	};
}

// Hook for infinite queries with optimizations
export function useOptimizedInfiniteQuery<TData>({
	queryKey,
	queryFn,
	getNextPageParam,
	initialPageParam = 0,
	...options
}: {
	queryKey: unknown[];
	queryFn: ({ pageParam }: { pageParam: any }) => Promise<TData>;
	getNextPageParam: (lastPage: TData, allPages: TData[], lastPageParam: any) => any;
	initialPageParam?: any;
} & Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>) {
	const { measureAsync } = useAsyncPerformance();

	const wrappedQueryFn = useCallback(async ({ pageParam }: { pageParam: any }) => {
		return measureAsync(
			() => queryFn({ pageParam }),
			`Infinite Query Page: ${JSON.stringify(queryKey)}-${pageParam}`
		);
	}, [queryFn, queryKey, measureAsync]);

	return useQuery({
		queryKey,
		queryFn: () => wrappedQueryFn({ pageParam: initialPageParam }),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		...options,
	});
}
