import {
	customSessionClient,
	emailOTPClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
	fetchOptions: {
		timeout: 30000, // 30 seconds timeout
		retry: {
			type: "linear",
			attempts: 3,
			delay: 1000,
		},
		onError: async (context) => {
			const { response } = context;
			if (response.status === 429) {
				const retryAfter = response.headers.get("X-Retry-After");
				if (process.env.NODE_ENV === 'development') {
					console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
				}
			}
		},
	},
	plugins: [emailOTPClient(), customSessionClient<typeof auth>()],
});
