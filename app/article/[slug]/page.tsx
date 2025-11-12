import ArticleContent from "@/components/ArticleContent";
import Spinner from "@/components/Spinner";
import { getArticleById, increaseReadTimes } from "@/lib/actions/article";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { generateArticleMetadata } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const id = slug.split("-")[0];
	const articleId = Number(id);

	const article = await getArticleById(articleId);

	if (!article) {
		return {
			title: "Article Not Found",
		};
	}

	const imageUrl = process.env.CLOUDFLARE_R2_PUBLIC_IMAGE_URL;
	const articleImage = article.imageUrl
		? `${imageUrl}/${article.categoryName}/${article.id}.webp`
		: undefined;

	return generateArticleMetadata({
		title: article.title,
		description: article.description,
		image: articleImage,
		slug,
		publishedTime: article.createdAt,
		modifiedTime: article.updatedAt,
		category: article.Category?.name,
		ieltsWords: article.ieltsWords,
	});
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

	return (
		<>
			<Suspense fallback={<Spinner />}>
				<ArticleContent article={article} />
			</Suspense>
		</>
	);
}
