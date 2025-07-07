"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryName } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	categoryToPath,
	titleToPath,
	transformCategoryName,
} from "@/lib/utils";

// Define form validation schema
const formSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	imageUrl: z.string().min(1, { message: "Image URL is required" }),
	description: z.string().min(1, { message: "Description is required" }),
	ieltsWordsCount: z.string({
		required_error: "IELTS words count is required.",
	}),
	categoryName: z.string().min(1, { message: "Please select a category" }),
	content: z.string().min(1, { message: "Content is required" }),
});

type FormData = z.infer<typeof formSchema>;

interface ArticleFormProps {
	initialData?: FormData;
	articleId?: string;
}

export function ArticleForm({ initialData, articleId }: ArticleFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<FormData | null>(
		initialData || null,
	);

	// Fetch article data if articleId is provided
	useEffect(() => {
		if (articleId && !initialData) {
			const fetchArticle = async () => {
				try {
					const response = await fetch(`/api/articles/${articleId}`);
					if (!response.ok) {
						throw new Error("Article not found");
					}
					const article = await response.json();
					setFormData({
						title: article.title,
						imageUrl: article.imageUrl,
						description: article.description,
						categoryName: article.categoryName,
						content: article.content,
						ieltsWordsCount: article.ieltsWordsCount,
					});
				} catch (err) {
					setError(
						err instanceof Error ? err.message : "Failed to fetch article",
					);
				}
			};

			fetchArticle().then();
		}
	}, [articleId, initialData]);

	// Convert enum values to option list
	const categoryOptions = Object.entries(CategoryName).map(([key, value]) => ({
		value,
		label:
			transformCategoryName(key).charAt(0).toUpperCase() +
			transformCategoryName(key).slice(1),
	}));

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: formData?.title || "",
			imageUrl: formData?.imageUrl || "",
			description: formData?.description || "",
			categoryName: formData?.categoryName || "",
			content: formData?.content || "",
			ieltsWordsCount: formData?.ieltsWordsCount,
		},
	});

	// Update form values when formData changes
	useEffect(() => {
		if (formData) {
			form.reset(formData);
		}
	}, [formData, form]);

	const handleSubmit = async (data: FormData) => {
		try {
			setIsSubmitting(true);
			setError(null);

			const response = await fetch(
				articleId ? `/api/articles/${articleId}` : "/api/articles",
				{
					method: articleId ? "PUT" : "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				const responseData = await response.json();
				throw new Error(
					responseData.message ||
						`Failed to ${articleId ? "update" : "create"} article`,
				);
			}

			const article = await response.json();

			const titlePath = titleToPath(article.title);
			const categoryPath = categoryToPath(article.Category?.name || "");

			router.push(`/article/${article.id}-${categoryPath}-${titlePath}`);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: `An error occurred while ${articleId ? "updating" : "creating"} the article`,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!formData && articleId && !error) {
		return <div className="text-center p-10">Loading...</div>;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="imageUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image URL</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea rows={3} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="ieltsWordsCount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>IELTS Words Count</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value?.toString()}
								defaultValue={field.value?.toString()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a words count" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{[20, 30, 40].map((count) => (
										<SelectItem key={count} value={`count_${count}`}>
											{count}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="categoryName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select onValueChange={field.onChange} value={field.value || ""}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categoryOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<Textarea rows={10} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{error && <div className="text-red-500 text-sm">{error}</div>}

				<div className="flex justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							router.back();
							router.refresh();
						}}
						className="mr-2"
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
