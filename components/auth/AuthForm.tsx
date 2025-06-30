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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
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
			</form>
		</Form>
	);
}
