import ArticleContent from "@/components/ArticleContent";
import Spinner from "@/components/Spinner";
import StructuredData from "@/components/seo/StructuredData";

import { getArticleById, increaseReadTimes } from "@/lib/actions/article";
import { generateArticleMetadata } from "@/lib/seo/metadata";
import {
	generateArticleStructuredData,
	generateBreadcrumbStructuredData,
} from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Disable static generation and caching for this dynamic page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Update the Props interface to reflect that params is a Promise
interface Props {
	params: Promise<{
		slug: string;
	}>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;

	if (slug.length === 1) {
		return {};
	}

	const id = slug.split("-")[0];
	const articleId = Number(id);
	const article = await getArticleById(articleId);

	if (!article) {
		return {};
	}

	const slugFromParam = slug.split("-").slice(1).join("-");
	return generateArticleMetadata(article, slugFromParam);
}

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params;

	if (slug.length === 1) {
		notFound();
	}

	const id = slug.split("-")[0];
	const articleId = Number(id);

	// Fetch article data and increment read count in parallel
	const [article] = await Promise.all([
		getArticleById(articleId),
		increaseReadTimes(articleId),
	]);

	if (!article) {
		notFound();
	}

	// Generate structured data
	const slugFromParam = slug.split("-").slice(1).join("-");
	const articleStructuredData = generateArticleStructuredData(
		article,
		slugFromParam,
	);
	const breadcrumbData = generateBreadcrumbStructuredData([
		{ name: "Home", url: "/" },
		{
			name: article.Category?.name || "Articles",
			url: `/category/${article.Category?.name?.toLowerCase() || "articles"}`,
		},
		{ name: article.title, url: `/article/${article.id}-${slugFromParam}` },
	]);

	return (
		<>
			<StructuredData data={[articleStructuredData, breadcrumbData]} />
			<Suspense fallback={<Spinner />}>
				{/* Pass the resolved article data to ArticleContent */}
				<ArticleContent article={article} />
			</Suspense>
		</>
	);
}
