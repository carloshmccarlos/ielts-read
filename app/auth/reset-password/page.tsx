"use client";

import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { RequestResetForm } from "@/components/auth/ResetPasswordForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { checkUserExist } from "@/lib/actions/articles-with-user";
import {
	deleteSendEmailTime,
	getSendEmailTime,
	updateSendEmailTime,
} from "@/lib/actions/email-check";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Extended error interface for rate limiting
interface ExtendedError {
	code?: string;
	message?: string;
	status: number;
	statusText: string;
	remainingSeconds?: number;
}

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
	const [message, setMessage] = useState("");
	const [cooldownRemaining, setCooldownRemaining] = useState(0);

	const isResetForm = !!token;

	// Countdown timer effect
	useEffect(() => {
		if (cooldownRemaining <= 0) return;

		const timer = setInterval(() => {
			setCooldownRemaining((prev) => {
				const newValue = prev - 1;
				return newValue > 0 ? newValue : 0;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [cooldownRemaining]);

	const handleRequestReset = async (values: { email: string }) => {
		if (loading) return;

		setLoading(true);
		setStatus("idle");
		setMessage("");

		try {
			// Check if there's a cooldown period for this email
			const cooldownRecord = await getSendEmailTime({ email: values.email });

			if (cooldownRecord) {
				const timeDiff =
					new Date().getTime() - cooldownRecord.lastEmailSentAt.getTime();
				const secondsPassed = Math.floor(timeDiff / 1000);

				// If less than 60 seconds have passed since the last email
				if (secondsPassed < 60) {
					const remainingTime = 60 - secondsPassed;
					setCooldownRemaining(remainingTime);
					setLoading(false);
					toast.error(
						`Please wait ${remainingTime} seconds before requesting another reset link.`,
					);
					return;
				}

				// Reset cooldown if it's expired
				await deleteSendEmailTime({ email: values.email });
			}

			const existUser = await checkUserExist(values.email);
			if (!existUser) {
				toast.error("User does not exist or not verified!");
				return;
			}

			const { data, error } = await authClient.requestPasswordReset({
				email: values.email,
				redirectTo: "/auth/reset-password",
			});

			if (error) {
				const extendedError = error as ExtendedError;
				if (
					extendedError.message?.includes("Rate limit") &&
					extendedError.remainingSeconds
				) {
					// Set cooldown from server response if available
					setCooldownRemaining(extendedError.remainingSeconds);
				}

				setStatus("error");
				setMessage(
					error.message || "Failed to send reset link. Please try again.",
				);
				console.error("Reset password request failed:", error);
				return;
			}

			// Update the email sent time
			await updateSendEmailTime({ email: values.email });
			setCooldownRemaining(60);

			setStatus("success");
			setMessage("Reset password link has been sent to your email!");
			toast.success("Reset password link sent successfully!");
		} catch (error) {
			console.error("Reset password request exception:", error);
			setStatus("error");

			// More specific error handling based on error type
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to send reset link. Please try again later.";

			setMessage(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = async (values: {
		password: string;
		confirmPassword: string;
	}) => {
		if (loading) return;

		setLoading(true);
		setStatus("idle");
		setMessage("");
		const { password, confirmPassword } = values;

		if (password !== confirmPassword) {
			setStatus("error");
			setMessage("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const { data, error } = await authClient.resetPassword({
				newPassword: password,
				token: token || undefined,
			});

			if (error) {
				setStatus("error");
				setMessage(
					error.message || "Failed to reset password. Please try again.",
				);
				console.error("Reset password failed:", error);
				return;
			}

			setStatus("success");
			setMessage("Password has been reset successfully!");
		} catch (error) {
			console.error("Reset password exception:", error);
			setStatus("error");

			// More specific error handling based on error type
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to reset password. Please try again later.";

			setMessage(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center  py-24 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl text-center">
						{status !== "success" &&
							(isResetForm ? "Reset Your Password" : "Forgot Password")}
					</CardTitle>
					<CardDescription className="text-center">
						{status !== "success" &&
							(isResetForm
								? "Enter your new password"
								: "Enter your email to reset your password")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{status === "success" ? (
						<div className="text-center">
							<p className="text-green-600 font-semibold">{message}</p>
							<div className="mt-4">
								<Link
									href="/auth/login"
									className="font-medium text-primary hover:text-primary/90"
								>
									Back to Login
								</Link>
							</div>
						</div>
					) : isResetForm ? (
						<ChangePasswordForm
							onSubmit={handleChangePassword}
							error={status === "error" ? message : undefined}
							loading={loading}
						/>
					) : (
						<RequestResetForm
							onSubmit={handleRequestReset}
							error={status === "error" ? message : undefined}
							loading={loading}
							cooldownRemaining={cooldownRemaining}
						/>
					)}

					{status !== "success" && (
						<div className="mt-6 text-center text-sm">
							<Link
								href="/auth/login"
								className="font-medium text-primary hover:text-primary/90"
							>
								Back to Login
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
