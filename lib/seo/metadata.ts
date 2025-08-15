import type { Metadata } from "next";

export interface SEOConfig {
	title: string;
	description: string;
	keywords?: string[];
	image?: string;
	url?: string;
	type?: "website" | "article";
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	section?: string;
	tags?: string[];
}

const DEFAULT_SEO: SEOConfig = {
	title: "IELTS Vocabulary Memorization Through Reading - Master IELTS Words",
	description:
		"Memorize IELTS vocabulary effectively through contextual reading practice. Our curated articles help you learn and retain essential IELTS words naturally through engaging content.",
	keywords: [
		"IELTS vocabulary",
		"IELTS words memorization",
		"vocabulary through reading",
		"IELTS word practice",
		"contextual vocabulary learning",
		"IELTS preparation",
		"English vocabulary building",
		"IELTS academic words",
		"vocabulary retention",
		"IELTS word list practice",
	],
	image: "/og-image.jpg",
	type: "website",
};

export function generateMetadata(config: Partial<SEOConfig> = {}): Metadata {
	const seo = { ...DEFAULT_SEO, ...config };
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";
	const fullUrl = seo.url ? `${baseUrl}${seo.url}` : baseUrl;
	const imageUrl = seo.image?.startsWith("http")
		? seo.image
		: `${baseUrl}${seo.image}`;

	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords?.join(", "),
		authors: seo.author ? [{ name: seo.author }] : undefined,
		openGraph: {
			title: seo.title,
			description: seo.description,
			url: fullUrl,
			siteName: "IELTS Reading Practice",
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: seo.title,
				},
			],
			locale: "en_US",
			type: seo.type || "website",
			...(seo.type === "article" && {
				publishedTime: seo.publishedTime,
				modifiedTime: seo.modifiedTime,
				section: seo.section,
				tags: seo.tags,
			}),
		},
		twitter: {
			card: "summary_large_image",
			title: seo.title,
			description: seo.description,
			images: [imageUrl],
			creator: "@ieltsread",
			site: "@ieltsread",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		verification: {
			google: process.env.GOOGLE_SITE_VERIFICATION,
			yandex: process.env.YANDEX_VERIFICATION,
			yahoo: process.env.YAHOO_VERIFICATION,
		},
		alternates: {
			canonical: fullUrl,
		},
	};
}

export function generateArticleMetadata(
	article: {
		id: number;
		title: string;
		content: string;
		createdAt: Date;
		updatedAt: Date;
		Category?: { name: string } | null;
		readTimes?: number;
	},
	slug?: string,
): Metadata {
	const articleSlug =
		slug ||
		article.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

	const description =
		// biome-ignore lint/style/useTemplate: <explanation>
		article.content
			.replace(/<[^>]*>/g, "") // Remove HTML tags
			.slice(0, 160)
			.trim() + "...";

	const keywords = [
		"IELTS vocabulary",
		"vocabulary memorization",
		article.Category?.name || "vocabulary practice",
		"IELTS words",
		"contextual learning",
		"IELTS preparation",
		"vocabulary through reading",
		"English vocabulary building",
	];

	return generateMetadata({
		title: `${article.title} - IELTS Vocabulary Practice Through Reading`,
		description,
		keywords,
		url: `/article/${article.id}-${articleSlug}`,
		type: "article",
		publishedTime: article.createdAt.toISOString(),
		modifiedTime: article.updatedAt.toISOString(),
		section: article.Category?.name,
		tags: [article.Category?.name || "vocabulary"].filter(Boolean),
	});
}

export function generateCategoryMetadata(category: {
	name: string;
	description?: string;
	slug: string;
}): Metadata {
	const description =
		category.description ||
		`Master IELTS vocabulary in ${category.name} through contextual reading. Memorize essential IELTS words naturally with our curated ${category.name.toLowerCase()} articles designed for effective vocabulary retention.`;

	return generateMetadata({
		title: `${category.name} IELTS Vocabulary - Learn Words Through Reading`,
		description,
		keywords: [
			"IELTS vocabulary",
			category.name,
			"vocabulary memorization",
			"IELTS words practice",
			"contextual vocabulary learning",
			"IELTS preparation",
			"English vocabulary building",
		],
		url: `/category/${category.slug}`,
	});
}
