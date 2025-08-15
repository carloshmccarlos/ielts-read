import { authClient } from "@/lib/auth/auth-client";

/**
 * Enhanced session hook that wraps Better Auth's useSession with additional utilities
 * This provides a consistent interface while maintaining Better Auth's reactivity
 */
export function useSession() {
	return authClient.useSession();
}

/**
 * Hook to get current user data with enhanced utilities
 */
export function useCurrentUser() {
	const session = authClient.useSession();
	
	return {
		user: session.data?.user || null,
		isLoggedIn: !!session.data?.user,
		isLoading: session.isPending,
		error: session.error,
		session: session.data,
		raw: session, // Provide access to the raw session object
	};
}

/**
 * Hook to get user ID specifically
 */
export function useUserId() {
	const { user } = useCurrentUser();
	return user?.id || null;
}
