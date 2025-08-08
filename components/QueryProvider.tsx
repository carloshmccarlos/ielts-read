"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Cache for 5 minutes by default
			staleTime: 1000 * 60 * 5,
			// Keep in cache for 10 minutes (using gcTime for newer versions)
			gcTime: 1000 * 60 * 10,
			// Retry failed requests 2 times
			retry: 2,
			// Exponential backoff with max delay
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			// Don't refetch on window focus by default
			refetchOnWindowFocus: false,
			// Refetch on reconnect
			refetchOnReconnect: true,
		},
		mutations: {
			// Retry mutations once
			retry: 1,
			retryDelay: 1000,
		},
	},
});

export function QueryProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
} 