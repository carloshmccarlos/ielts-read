import ArticleContent from "@/components/ArticleContent";
import Spinner from "@/components/Spinner";
import { getArticleById, increaseReadTimes } from "@/lib/actions/article";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Update the Props interface to reflect that params is a Promise
interface Props {
	params: Promise<{
		slug: string;
	}>;
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
		<Suspense fallback={<Spinner />}>
			<ArticleContent article={article} />
		</Suspense>
	);
}
