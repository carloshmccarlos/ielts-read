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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const requestResetSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type RequestResetSchema = z.infer<typeof requestResetSchema>;

interface RequestResetFormProps {
	onSubmit: (values: RequestResetSchema) => Promise<void>;
	error?: string;
	loading?: boolean;
	cooldownRemaining?: number;
}

export function RequestResetForm({
	onSubmit,
	error,
	loading,
	cooldownRemaining = 0,
}: RequestResetFormProps) {
	const form = useForm<RequestResetSchema>({
		resolver: zodResolver(requestResetSchema),
		defaultValues: {
			email: "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Enter your email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button 
					type="submit" 
					className="w-full" 
					disabled={loading || cooldownRemaining > 0}
				>
					{loading
						? "Processing..."
						: cooldownRemaining > 0
						? `Resend in ${cooldownRemaining}s`
						: "Send Reset Link"}
				</Button>
			</form>
		</Form>
	);
}
