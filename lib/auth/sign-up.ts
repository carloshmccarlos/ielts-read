import { authClient } from "@/lib/auth/auth-client";

import { updateUserRoleByEmail } from "@/lib/data/user";
import type { Role } from "@prisma/client";
import { toast } from "sonner";

export async function signUp({
	email,
	password,
	name,
	image,
}: {
	email: string;
	password: string;
	name: string;
	image?: string;
}) {
	const { data, error } = await authClient.signUp.email(
		{
			email,
			password,
			name,
			image,
			callbackURL: "/auth/register-result", // A URL to redirect to after the user verifies their email (optional)
		},
		{
			onSuccess: (ctx) => {},
			onError: (ctx) => {
				// display the error message
				toast.error(ctx.error.message);
			},
		},
	);

	return { data, error };
}
