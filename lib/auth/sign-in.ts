import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export async function signIn({
	email,
	password,
}: { email: string; password: string }) {
	const { data, error } = await authClient.signIn.email(
		{
			/**
			 * The user email
			 */
			email,
			/**
			 * The user password
			 */
			password,
			/**
			 * A URL to redirect to after the user verifies their email (optional)
			 */
			callbackURL: "/",
			/**
			 * remember the user session after the browser is closed.
			 * @default true
			 */
			rememberMe: true,
		},
		{
			onError: (ctx) => {
				// Handle the error
				if (ctx.error.status === 403) {
					toast.error(
						"Please verify your email address, if expired, pleaser register again",
					);
				}

				//you can also show the original error message
			},
		},
	);

	return { data, error };
}

export async function signInWithEmailOTP({
	email,
	otp,
}: {
	email: string;
	otp: string;
}) {
	const { data, error } = await authClient.signIn.emailOtp({
		email,
		otp,
	});

	console.log(1);

	return { data, error };
}

// Custom response for email OTP sending
export interface EmailOTPResponse {
	error?: boolean;
	message?: string;
	remainingSeconds?: number;
	data?: { success: boolean } | null;
}

export async function sendEmailOTP({
	email,
}: {
	email: string;
}): Promise<EmailOTPResponse> {
	try {
		const response = await authClient.emailOtp.sendVerificationOtp({
			email,
			type: "sign-in",
		});

		// If there's an error from the auth client, format it for our UI
		if (response.error) {
			return {
				error: true,
				message: response.error.message || "Failed to send verification code",
				data: null,
			};
		}

		// If successful, return the data
		return {
			error: false,
			data: response.data,
		};
	} catch (err: unknown) {
		// Handle unexpected errors
		const error = err as Error;
		return {
			error: true,
			message: error.message || "An unexpected error occurred",
			data: null,
		};
	}
}
