import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/actions/article";
import { getAllCategories } from "@/lib/actions/category";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://ielts-read.space";

	// Get all articles and categories
	const [articles, categories] = await Promise.all([
		getAllArticles(),
		getAllCategories(),
	]);

	// Home page
	const routes: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
	];

	// Category pages
	categories.forEach((category) => {
		routes.push({
			url: `${baseUrl}/category/${category.name.toLowerCase()}`,
			lastModified: category.updatedAt,
			changeFrequency: "daily",
			priority: 0.8,
		});
	});

	// Article pages
	articles.forEach((article) => {
		const slug = `${article.id}-${article.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")}`;

		routes.push({
			url: `${baseUrl}/article/${slug}`,
			lastModified: article.updatedAt,
			changeFrequency: "weekly",
			priority: 0.6,
		});
	});

	return routes;
}
