import type { DefaultSession } from "better-auth";

declare module "better-auth" {
	interface Session extends DefaultSession {
		role?: string;
	}
	interface User {
		role?: string;
	}
}
