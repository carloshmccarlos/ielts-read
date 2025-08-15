import { authClient } from "@/lib/auth/auth-client";
import type { Session as PrismaSession, User as PrismaUser } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Define the shape of the user and session objects with the added 'role' property
type UserWithRole = PrismaUser & { role: string | null };
type SessionWithRole = PrismaSession & { role: string | null };

// Define the structure of the session payload
type SessionPayload = {
	user: UserWithRole;
	session: SessionWithRole;
} | null;

// Define the wrapper object that getSession returns
type SessionResult = { data: SessionPayload };

const getSession = async (): Promise<SessionResult> => {
	const session = await authClient.getSession();
	return session as SessionResult;
};

/**
 * Enhanced session hook that uses TanStack Query to fetch and cache session data.
 */
export function useSession() {
	return useQuery<SessionResult, Error>({
		queryKey: ["session"],
		queryFn: getSession,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: true,
	});
}

/**
 * Hook to get current user data with enhanced utilities.
 */
export function useCurrentUser() {
	const { data: sessionResult, isPending, error } = useSession();
	const session = sessionResult?.data;

	return {
		user: session?.user || null,
		isLoggedIn: !!session?.user,
		isLoading: isPending,
		error: error,
		session: session,
	};
}

/**
 * Hook to get user ID specifically.
 */
export function useUserId() {
	const { user } = useCurrentUser();
	return user?.id || null;
}

/**
 * Hook for signing out the user.
 */
export function useSignOut() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: () => authClient.signOut(),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["session"] });
			router.push("/");
		},
	});
}
