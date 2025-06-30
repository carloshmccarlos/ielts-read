"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signUp } from "@/lib/auth/sign-up";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthForm, type AuthFormSchema } from "@/components/auth/AuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleSubmit = async (values: AuthFormSchema) => {
		setLoading(true);
		setError("");
		setSuccess(false);

		try {
			const result = await signUp({
				email: values.email,
				password: values.password,
				name: values.name || "",
			});

			if (result.error) {
				setError(
					result.error.message ||
						"Registration failed. Please try again later.",
				);
			} else {
				setSuccess(true);
				// Wait a moment before redirecting to login page
			
			}
		} catch (error: unknown) {
			console.error("Registration error:", error);
			setError(
				error instanceof Error
					? error.message
					: "Registration failed. Please try again later.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center  py-24 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl text-center">
						Create a new account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your details to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					{success ? (
						<Alert className="bg-green-50 border-green-500 text-green-700 mb-6">
							<AlertDescription className="text-lg">
								Registration successful! A verification email has been sent to your email address.
								Redirecting to login page...
							</AlertDescription>
						</Alert>
					) : (
						<AuthForm
							type="register"
							onSubmit={handleSubmit}
							error={error}
							loading={loading}
						/>
					)}

					{!success && (
						<div className="mt-6 text-center text-sm">
							Already have an account?{" "}
							<Link
								href="/auth/login"
								className="font-medium text-primary hover:text-primary/90"
							>
								Sign in
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
