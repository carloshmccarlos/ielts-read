import { authClient } from "@/lib/auth/auth-client";
import type {
	Session as PrismaSession,
	User as PrismaUser,
} from "@prisma/client";
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

/**
 * Enhanced session hook that uses Better Auth's native useSession hook.
 */
export function useSession() {
	return authClient.useSession();
}

/**
 * Hook to get current user data with enhanced utilities.
 */
export function useCurrentUser() {
	const { data: session, isPending, error } = useSession();

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
