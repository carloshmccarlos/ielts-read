"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePerformanceContext } from "./PerformanceProvider";

// Optimized query client configuration based on connection speed
function createOptimizedQueryClient(isSlowConnection: boolean) {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// Adjust stale time based on connection speed
				staleTime: isSlowConnection ? 10 * 60 * 1000 : 5 * 60 * 1000, // 10min vs 5min
				gcTime: isSlowConnection ? 20 * 60 * 1000 : 10 * 60 * 1000, // 20min vs 10min
				
				// Retry configuration for slow connections
				retry: isSlowConnection ? 1 : 3,
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
				
				// Network mode adjustments
				networkMode: isSlowConnection ? "offlineFirst" : "online",
				
				// Refetch configuration
				refetchOnWindowFocus: !isSlowConnection,
				refetchOnMount: true,
				refetchOnReconnect: true,
				
				// Background refetch intervals
				refetchInterval: isSlowConnection ? false : undefined,
				refetchIntervalInBackground: false,
			},
			mutations: {
				retry: isSlowConnection ? 1 : 2,
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
				networkMode: isSlowConnection ? "offlineFirst" : "online",
			},
		},
	});
}

interface OptimizedQueryProviderProps {
	children: React.ReactNode;
}

export default function OptimizedQueryProvider({ children }: OptimizedQueryProviderProps) {
	const { isSlowConnection } = usePerformanceContext();
	const [queryClient] = useState(() => createOptimizedQueryClient(isSlowConnection));

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
