import type { Article, Category } from "@prisma/client";

interface ArticleWithCategory extends Article {
	Category: Category | null;
}

export function ArticleStructuredData({
	article,
}: {
	article: ArticleWithCategory;
}) {
	const imageUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_IMAGE_URL;
	const articleImage = article.imageUrl
		? `${imageUrl}/${article.categoryName}/${article.id}.webp`
		: undefined;

	const slug = `${article.id}-${article.title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")}`;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
		image: articleImage,
		datePublished: article.createdAt.toISOString(),
		dateModified: article.updatedAt.toISOString(),
		author: {
			"@type": "Organization",
			name: "IELTS Reading Practice",
			url: "https://ielts-read.space",
		},
		publisher: {
			"@type": "Organization",
			name: "IELTS Reading Practice",
			url: "https://ielts-read.space",
			logo: {
				"@type": "ImageObject",
				url: "https://ielts-read.space/logo.png",
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://ielts-read.space/article/${slug}`,
		},
		articleSection: article.Category?.name,
		wordCount: article.articleWordsCount,
		keywords: article.ieltsWords?.join(", "),
		inLanguage: "en-US",
		educationalUse: "IELTS preparation, reading comprehension, vocabulary building",
		learningResourceType: "Reading Practice",
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

export function WebsiteStructuredData() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "IELTS Reading Practice",
		description:
			"Master IELTS reading with comprehensive articles, vocabulary practice, and interactive learning tools",
		url: "https://ielts-read.space",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://ielts-read.space/search?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
		publisher: {
			"@type": "Organization",
			name: "IELTS Reading Practice",
			url: "https://ielts-read.space",
			logo: {
				"@type": "ImageObject",
				url: "https://ielts-read.space/logo.png",
			},
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

export function BreadcrumbStructuredData({
	items,
}: {
	items: { name: string; url: string }[];
}) {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `https://ielts-read.space${item.url}`,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

export function EducationalOrganizationStructuredData() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		name: "IELTS Reading Practice",
		description:
			"Online platform for IELTS reading preparation and English vocabulary building",
		url: "https://ielts-read.space",
		logo: {
			"@type": "ImageObject",
			url: "https://ielts-read.space/logo.png",
		},
		sameAs: [
			"https://twitter.com/ieltsreading",
			"https://facebook.com/ieltsreading",
		],
		educationalCredentialAwarded: "IELTS Reading Skills",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "IELTS Reading Materials",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Course",
						name: "IELTS Reading Practice Articles",
						description:
							"Comprehensive collection of reading materials for IELTS preparation",
						provider: {
							"@type": "Organization",
							name: "IELTS Reading Practice",
						},
					},
				},
			],
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}
