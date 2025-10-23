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

				toast.error(ctx.error.message);
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
	try {
		// Cast authClient to access emailOtp methods
		const client = authClient as any;
		const result = await client.emailOtp.verifyOtp({
			email,
			otp,
		});
		
		return { data: result.data, error: result.error };
	} catch (error) {
		return { data: null, error: error as any };
	}
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
		// Cast authClient to access emailOtp methods
		const client = authClient as any;
		const response = await client.emailOtp.sendVerificationOtp({
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
