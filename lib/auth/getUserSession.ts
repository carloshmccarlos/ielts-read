import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function getUserSession(header: Headers) {
	// No caching - always fetch fresh session data
	return auth.api.getSession({
		headers: header,
	});
}
