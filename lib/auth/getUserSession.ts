import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getUserSession = cache(async () => {
	// Per-request cache to dedupe repeated session lookups.
	return auth.api.getSession({
		headers: await headers(),
	});
});
