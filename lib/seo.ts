import type { Metadata } from "next";

export const siteConfig = {
	name: "IELTS Reading Practice",
	description:
		"Master IELTS reading with our comprehensive collection of articles, vocabulary practice, and interactive learning tools. Improve your reading skills with real-world content across multiple categories.",
	url: "https://ielts-read.space",
	ogImage: "https://ielts-read.space/og-image.jpg",
	keywords: [
		"IELTS reading",
		"IELTS practice",
		"IELTS vocabulary",
		"English reading",
		"IELTS preparation",
		"reading comprehension",
		"English learning",
		"IELTS test",
		"vocabulary builder",
		"English articles",
	],
	authors: [{ name: "IELTS Reading Practice" }],
	creator: "IELTS Reading Practice",
	publisher: "IELTS Reading Practice",
};

export function generateMetadata({
	title,
	description,
	image,
	url,
	keywords,
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	keywords?: string[];
	noIndex?: boolean;
}): Metadata {
	const metaTitle = title
		? `${title} | ${siteConfig.name}`
		: siteConfig.name;
	const metaDescription = description || siteConfig.description;
	const metaImage = image || siteConfig.ogImage;
	const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
	const metaKeywords = keywords
		? [...siteConfig.keywords, ...keywords]
		: siteConfig.keywords;

	return {
		title: metaTitle,
		description: metaDescription,
		keywords: metaKeywords,
		authors: siteConfig.authors,
		creator: siteConfig.creator,
		publisher: siteConfig.publisher,
		robots: noIndex
			? {
					index: false,
					follow: false,
				}
			: {
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
		openGraph: {
			type: "website",
			locale: "en_US",
			url: metaUrl,
			title: metaTitle,
			description: metaDescription,
			siteName: siteConfig.name,
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: metaTitle,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description: metaDescription,
			images: [metaImage],
			creator: "@ieltsreading",
		},
		alternates: {
			canonical: metaUrl,
		},
		metadataBase: new URL(siteConfig.url),
	};
}

export function generateArticleMetadata({
	title,
	description,
	image,
	slug,
	publishedTime,
	modifiedTime,
	category,
	ieltsWords,
}: {
	title: string;
	description: string;
	image?: string;
	slug: string;
	publishedTime?: Date;
	modifiedTime?: Date;
	category?: string;
	ieltsWords?: string[];
}): Metadata {
	const metaTitle = `${title} | IELTS Reading Practice`;
	const metaImage = image || siteConfig.ogImage;
	const metaUrl = `${siteConfig.url}/article/${slug}`;
	const keywords = [
		"IELTS reading",
		"reading practice",
		...(category ? [category] : []),
		...(ieltsWords?.slice(0, 5) || []),
	];

	return {
		title: metaTitle,
		description,
		keywords,
		authors: siteConfig.authors,
		creator: siteConfig.creator,
		publisher: siteConfig.publisher,
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
		openGraph: {
			type: "article",
			locale: "en_US",
			url: metaUrl,
			title: metaTitle,
			description,
			siteName: siteConfig.name,
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			publishedTime: publishedTime?.toISOString(),
			modifiedTime: modifiedTime?.toISOString(),
			authors: [siteConfig.name],
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description,
			images: [metaImage],
			creator: "@ieltsreading",
		},
		alternates: {
			canonical: metaUrl,
		},
		metadataBase: new URL(siteConfig.url),
	};
}

export function generateCategoryMetadata({
	categoryName,
	description,
	image,
	url,
}: {
	categoryName: string;
	description?: string;
	image?: string;
	url?: string;
}): Metadata {
	const metaTitle = `${categoryName} Articles | IELTS Reading Practice`;
	const metaDescription =
		description ||
		`Explore ${categoryName} articles for IELTS reading practice. Improve your vocabulary and comprehension skills with curated content.`;
	const metaImage = image || siteConfig.ogImage;
	const metaUrl = url ? `${siteConfig.url}${url}` : `${siteConfig.url}/category/${categoryName.toLowerCase()}`;

	return {
		title: metaTitle,
		description: metaDescription,
		keywords: [
			...siteConfig.keywords,
			categoryName,
			`${categoryName} reading`,
			`${categoryName} IELTS`,
		],
		authors: siteConfig.authors,
		creator: siteConfig.creator,
		publisher: siteConfig.publisher,
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
		openGraph: {
			type: "website",
			locale: "en_US",
			url: metaUrl,
			title: metaTitle,
			description: metaDescription,
			siteName: siteConfig.name,
			images: [
				{
					url: metaImage,
					width: 1200,
					height: 630,
					alt: metaTitle,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description: metaDescription,
			images: [metaImage],
			creator: "@ieltsreading",
		},
		alternates: {
			canonical: metaUrl,
		},
		metadataBase: new URL(siteConfig.url),
	};
}
