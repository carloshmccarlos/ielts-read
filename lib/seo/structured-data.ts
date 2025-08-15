export interface Article {
	id: number;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	readTimes?: number;
	Category?: { name: string } | null;
	author?: { name: string };
}

export function generateArticleStructuredData(article: Article, slug?: string) {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";
	const articleSlug =
		slug ||
		article.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	const articleUrl = `${baseUrl}/article/${article.id}-${articleSlug}`;

	// Extract plain text from HTML content
	const plainTextContent = article.content.replace(/<[^>]*>/g, "").trim();
	const wordCount = plainTextContent.split(/\s+/).length;

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		"@id": articleUrl,
		headline: article.title,
		// biome-ignore lint/style/useTemplate: <explanation>
		description: plainTextContent.slice(0, 160) + "...",
		image: `${baseUrl}/og-image.jpg`,
		url: articleUrl,
		datePublished: article.createdAt.toISOString(),
		dateModified: article.updatedAt.toISOString(),
		author: {
			"@type": "Organization",
			name: "IELTS Vocabulary Memorization Platform",
			url: baseUrl,
		},
		publisher: {
			"@type": "Organization",
			name: "IELTS Vocabulary Memorization Platform",
			url: baseUrl,
			logo: {
				"@type": "ImageObject",
				url: `${baseUrl}/logo.png`,
				width: 200,
				height: 60,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": articleUrl,
		},
		articleSection: article.Category?.name || "Vocabulary Practice",
		wordCount: wordCount,
		inLanguage: "en-US",
		about: {
			"@type": "Thing",
			name: "IELTS Vocabulary Memorization",
		},
		audience: {
			"@type": "EducationalAudience",
			educationalRole: "student",
		},
		educationalLevel: "intermediate to advanced",
		learningResourceType: "vocabulary memorization through contextual reading",
	};
}

export function generateWebsiteStructuredData() {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";

	return {
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		"@id": baseUrl,
		name: "IELTS Reading Practice",
		alternateName: "I READ",
		url: baseUrl,
		description:
			"Innovative IELTS vocabulary memorization platform that helps students learn and retain essential IELTS words through contextual reading practice and engaging articles.",
		logo: {
			"@type": "ImageObject",
			url: `${baseUrl}/logo.png`,
			width: 200,
			height: 60,
		},
		sameAs: [
			"https://twitter.com/ieltsread",
			"https://facebook.com/ieltsread",
			"https://linkedin.com/company/ieltsread",
		],
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${baseUrl}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
		audience: {
			"@type": "EducationalAudience",
			educationalRole: "student",
		},
		educationalLevel: "intermediate to advanced",
	};
}

export function generateBreadcrumbStructuredData(
	items: Array<{ name: string; url: string }>,
) {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
		})),
	};
}

export function generateFAQStructuredData(
	faqs: Array<{ question: string; answer: string }>,
) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}
