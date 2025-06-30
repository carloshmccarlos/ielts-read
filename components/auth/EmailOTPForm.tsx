"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { EmailOTPResponse, sendEmailOTP } from "@/lib/auth/sign-in";
import {
	deleteSendEmailTime,
	getSendEmailTime,
	updateSendEmailTime,
} from "@/lib/data/email-check";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Schema for email OTP request form
const emailRequestSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type EmailRequestSchema = z.infer<typeof emailRequestSchema>;

// Schema for OTP verification form
const otpVerificationSchema = z.object({
	otp: z.string().min(6, "OTP must be at least 6 characters"),
});

type OtpVerificationSchema = z.infer<typeof otpVerificationSchema>;

interface EmailOTPFormProps {
	callbackUrl?: string;
}

// Extended error interface for rate limiting
interface ExtendedError {
	code?: string;
	message?: string;
	status: number;
	statusText: string;
	remainingSeconds?: number;
}

export function EmailOTPForm({ callbackUrl = "/" }: EmailOTPFormProps) {
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<"request" | "verify">("request");
	const [userEmail, setUserEmail] = useState("");
	const [cooldownRemaining, setCooldownRemaining] = useState(0);

	// Email request form
	const emailForm = useForm<EmailRequestSchema>({
		resolver: zodResolver(emailRequestSchema),
		defaultValues: {
			email: "",
		},
	});

	// OTP verification form
	const otpForm = useForm<OtpVerificationSchema>({
		resolver: zodResolver(otpVerificationSchema),
		defaultValues: {
			otp: "",
		},
	});

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

	// Handle sending email
	const handleEmailRequest = async (values: EmailRequestSchema) => {
		const email = values.email;
		setUserEmail(email);
		setLoading(true);
		setError("");

		try {
			// Check if there's a cooldown period for this email
			const cooldownRecord = await getSendEmailTime({ email });

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
						`Please wait ${remainingTime} seconds before requesting another code.`,
					);
					return;
				}

				// Reset cooldown if it's expired
				await deleteSendEmailTime({ email });
			}

			// Proceed with sending the OTP
			const response = await sendEmailOTP({
				email: email,
			});

			// Check if there's an error
			if (response.error) {
				if (
					response.message?.includes("Rate limit") &&
					response.remainingSeconds
				) {
					// Set cooldown from server response
					setCooldownRemaining(response.remainingSeconds);
					setError(response.message);
				} else {
					setError(
						response.message ||
							"Failed to send verification code. Please try again.",
					);
				}
			} else {
				// Successfully sent OTP
				setStep("verify");
				// Update the email sent time
				const updateResponse = await updateSendEmailTime({ email });
				if (!updateResponse) {
					setError("Failed to update send email time. Please try again.");
				}
				setCooldownRemaining(60);
				toast.success("Verification code sent successfully!");
			}
		} catch (err) {
			console.error("Email OTP request error:", err);
			setError("An error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Handle OTP verification
	const handleOTPVerification = async (values: OtpVerificationSchema) => {
		setLoading(true);
		setError("");

		try {
			const { data, error: verifyError } = await authClient.signIn.emailOtp(
				{
					email: userEmail,
					otp: values.otp,
				},
				{
					onSuccess: () => {
						router.push(callbackUrl);
					},
				},
			);

			if (verifyError) {
				setError("Invalid verification code. Please try again.");
			}
		} catch (err) {
			console.error("OTP verification error:", err);
			setError("An error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	// Handle resend OTP
	const handleResendOTP = async () => {
		if (cooldownRemaining > 0) {
			setError(
				`Please wait ${cooldownRemaining} seconds before requesting another code.`,
			);
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await sendEmailOTP({
				email: userEmail,
			});

			if (response.error) {
				if (
					response.message?.includes("Rate limit") &&
					response.remainingSeconds
				) {
					// Set cooldown from server response
					setCooldownRemaining(response.remainingSeconds);
					setError(response.message);
				} else {
					setError(
						response.message ||
							"Failed to resend verification code. Please try again.",
					);
				}
			} else {
				// Successfully resent OTP
				setCooldownRemaining(60);
			}
		} catch (err) {
			console.error("Resend OTP error:", err);
			setError("An error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertDescription className={"font-serif"}>{error}</AlertDescription>
				</Alert>
			)}

			{step === "request" ? (
				// Email Request Form
				<Form {...emailForm}>
					<form
						onSubmit={emailForm.handleSubmit(handleEmailRequest)}
						className="space-y-4"
					>
						<FormField
							control={emailForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your email"
											type="email"
											autoComplete="email"
											disabled={loading || cooldownRemaining > 0}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full cursor-pointer"
							disabled={loading || cooldownRemaining > 0}
						>
							{loading ? (
								"Sending code..."
							) : cooldownRemaining > 0 ? (
								// ? `Wait ${cooldownRemaining}s before resending`
								<div>
									Wait for{" "}
									<span className={"inline-block font-[Open-serif]"}>
										{cooldownRemaining}
									</span>
									{""}s before resending
								</div>
							) : (
								"Send verification code"
							)}
						</Button>
					</form>
				</Form>
			) : (
				// OTP Verification Form
				<Form {...otpForm}>
					<form
						onSubmit={otpForm.handleSubmit(handleOTPVerification)}
						className="space-y-4"
					>
						<div className="text-center mb-4">
							<p className="text-sm text-gray-600">
								We sent a verification code to{" "}
								<span className="font-medium">{userEmail}</span>
							</p>
						</div>

						<FormField
							control={otpForm.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<Input
											className={"font-[Open-serif]"}
											placeholder="Enter 6-digit code"
											type="text"
											maxLength={6}
											disabled={loading}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full cursor-pointer"
							disabled={loading}
						>
							{loading ? "Verifying..." : "Verify and Login"}
						</Button>

						<div className="flex justify-between items-center text-sm mt-4">
							<button
								type="button"
								onClick={handleResendOTP}
								className="hover:underline cursor-pointer  disabled:text-gray-400"
								disabled={loading || cooldownRemaining > 0}
							>
								{cooldownRemaining > 0 ? (
									<div>
										Resend code in{" "}
										<span className={"font-[Open-serif] inline-block"}>
											{cooldownRemaining}
										</span>{" "}
										s
									</div>
								) : (
									"Resend code"
								)}
							</button>
							<button
								type="button"
								onClick={() => setStep("request")}
								className="hover:underline cursor-pointer"
								disabled={loading}
							>
								Change email
							</button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
