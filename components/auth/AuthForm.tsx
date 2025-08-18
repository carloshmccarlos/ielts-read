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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const authFormSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	name: z.string().min(2, "Name must be at least 2 characters"),
});

export type AuthFormSchema = z.infer<typeof authFormSchema>;

interface AuthFormProps {
	type: "login" | "register";
	onSubmit: (values: AuthFormSchema) => Promise<void>;
	error?: string;
	loading?: boolean;
}

export function AuthForm({ type, onSubmit, error, loading }: AuthFormProps) {
	const [googleLoading, setGoogleLoading] = useState(false);
	const router = useRouter();
	
	const form = useForm<AuthFormSchema>({
		resolver: zodResolver(authFormSchema),
		defaultValues: {
			email: "",
			password: "",
			name: type === "login" ? "login" : "",
		},
	});

	const handleSubmit = async (values: AuthFormSchema) => {
		await onSubmit(values);
	};

	const handleGoogleLogin = async () => {
		try {
			setGoogleLoading(true);
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/",
			});
		} catch (error) {
			console.error("Google login error:", error);
		} finally {
			setGoogleLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-8 w-full max-w-md mx-auto"
			>
				{error && (
					<Alert variant="destructive" className="text-lg">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className={`${type === "login" ? "hidden" : ""}`}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg">Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your name"
										{...field}
										className="h-12 text-lg"
									/>
								</FormControl>
								<FormMessage className="text-base" />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Email</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter your email"
									{...field}
									className="h-12 text-lg"
								/>
							</FormControl>
							<FormMessage className="text-base" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter your password"
									{...field}
									className="h-12 text-lg"
								/>
							</FormControl>
							<FormMessage className="text-base" />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full h-12 text-lg cursor-pointer"
					disabled={loading}
				>
					{loading
						? "Processing..."
						: type === "login"
							? "Sign in"
							: "Register"}
				</Button>

				{/* Divider */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>

				{/* Google Login Button */}
				<Button
					type="button"
					variant="outline"
					className="w-full h-12 text-lg"
					onClick={handleGoogleLogin}
					disabled={loading || googleLoading}
				>
					<svg
						className="mr-2 h-4 w-4"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="google"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 488 512"
					>
						<path
							fill="currentColor"
							d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
						/>
					</svg>
					{googleLoading ? "Connecting..." : "Continue with Google"}
				</Button>
			</form>
		</Form>
	);
}
