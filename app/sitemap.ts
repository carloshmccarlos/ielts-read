import { getAllArticles } from "@/lib/actions/article";
import { getAllCategories } from "@/lib/actions/category";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/auth/login`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/auth/register`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
	];

	// Get all articles for dynamic pages
	const articles = await getAllArticles();
	const articlePages = articles.map((article) => {
		const slug = article.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
		return {
			url: `${baseUrl}/article/${article.id}-${slug}`,
			lastModified: new Date(article.updatedAt),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		};
	});

	// Get all categories for category pages
	const categories = await getAllCategories();
	const categoryPages = categories.map((category) => ({
		url: `${baseUrl}/category/${category.name.toLowerCase()}`,
		lastModified: new Date(category.updatedAt),
		changeFrequency: "daily" as const,
		priority: 0.7,
	}));

	return [...staticPages, ...articlePages, ...categoryPages];
}
