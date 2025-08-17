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
			name: "IELTS Reading Practice - Vocabulary Memorization Platform",
			url: baseUrl,
			description: "Leading platform for IELTS vocabulary memorization and reading improvement",
		},
		publisher: {
			"@type": "EducationalOrganization",
			name: "IELTS Reading Practice - Vocabulary Memorization Platform",
			url: baseUrl,
			logo: {
				"@type": "ImageObject",
				url: `${baseUrl}/logo.png`,
				width: 200,
				height: 60,
			},
			educationalCredentialAwarded: "IELTS Vocabulary Proficiency",
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": articleUrl,
		},
		articleSection: article.Category?.name || "IELTS Vocabulary Practice",
		wordCount: wordCount,
		inLanguage: "en-US",
		about: [
			{
				"@type": "Thing",
				name: "IELTS Vocabulary Memorization",
				description: "Systematic approach to learning IELTS vocabulary through contextual reading",
			},
			{
				"@type": "Thing",
				name: "English Reading Improvement",
				description: "Enhancing reading comprehension skills for IELTS success",
			},
			{
				"@type": "Thing",
				name: "Memory Techniques for Language Learning",
				description: "Proven methods for retaining English vocabulary long-term",
			},
		],
		audience: {
			"@type": "EducationalAudience",
			educationalRole: "student",
			educationalUse: "IELTS test preparation and English language learning",
		},
		educationalLevel: "intermediate to advanced English learners",
		learningResourceType: "vocabulary memorization article",
		educationalUse: "vocabulary building and reading comprehension improvement",
		typicalAgeRange: "16-65",
		interactivityType: "mixed",
	};
}

export function generateWebsiteStructuredData() {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";

	return {
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		"@id": baseUrl,
		name: "IELTS Reading Practice - Vocabulary Memorization Platform",
		alternateName: ["I READ", "IELTS Vocabulary Memory", "IELTS Reading Improvement"],
		url: baseUrl,
		description:
			"Revolutionary IELTS vocabulary memorization platform that helps students achieve higher band scores through proven memory techniques and contextual reading practice. Learn 3000+ essential IELTS words, improve reading comprehension, and boost memory retention with our scientifically-designed learning system.",
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
		potentialAction: [
			{
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${baseUrl}/search?q={search_term_string}`,
				},
				"query-input": "required name=search_term_string",
			},
			{
				"@type": "LearnAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${baseUrl}/category/{category_name}`,
				},
				"query-input": "required name=category_name",
				object: {
					"@type": "Course",
					name: "IELTS Vocabulary Memorization Course",
					description: "Learn IELTS vocabulary through contextual reading",
				},
			},
		],
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
			description: "Free IELTS vocabulary memorization and reading improvement platform",
		},
		audience: {
			"@type": "EducationalAudience",
			educationalRole: "student",
			educationalUse: "IELTS test preparation, vocabulary memorization, reading improvement",
		},
		educationalLevel: "intermediate to advanced English learners",
		educationalCredentialAwarded: "IELTS Vocabulary Proficiency Certificate",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "IELTS Learning Resources",
			itemListElement: [
				{
					"@type": "Course",
					name: "IELTS Vocabulary Memorization",
					description: "Master essential IELTS words through memory techniques",
				},
				{
					"@type": "Course",
					name: "IELTS Reading Improvement",
					description: "Enhance reading comprehension for better IELTS scores",
				},
			],
		},
		knowsAbout: [
			"IELTS vocabulary memorization",
			"English reading improvement",
			"Memory techniques for language learning",
			"IELTS test preparation",
			"Contextual vocabulary learning",
			"Reading comprehension strategies",
		],
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
