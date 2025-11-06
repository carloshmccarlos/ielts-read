import { notFound } from "next/navigation";
import React from "react";

// Disable static generation and caching for dynamic content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import BigCard from "@/components/BigCard";
import Footer from "@/components/Footer";
import HorizontalCard from "@/components/HorizontalCard";
import NoImageCard from "@/components/NoImageCard";
import PaginationComponent from "@/components/PaginationComponent";
import VerticalCard from "@/components/VerticalCard";
import {
	countArticlesByCategory,
	getArticlesByCategory,
} from "@/lib/actions/article";

import { getCategoryByName } from "@/lib/actions/category";
import { pathToCategory, transformCategoryName } from "@/lib/utils";
import { CategoryName } from "@prisma/client";
import Link from "next/link";

interface Props {
	params: Promise<{
		name: string;
	}>;
	searchParams: Promise<{
		page?: string | string[];
	}>;
}

export default async function ArticleByCategory({
	params,
	searchParams,
}: Props) {
	const { name } = await params;
	const { page } = await searchParams;

	const categoryName = pathToCategory(name);
	const pageSize = 16;
	const currentPage = page
		? Number.parseInt(Array.isArray(page) ? page[0] : String(page), 10)
		: 1;
	const skip = (currentPage - 1) * pageSize;

	const isValidCategory = Object.keys(CategoryName).includes(categoryName);
	if (!isValidCategory) {
		notFound();
	}

	const [articles, totalCount, category] = await Promise.all([
		getArticlesByCategory(categoryName, skip, pageSize),
		countArticlesByCategory(categoryName),
		getCategoryByName(categoryName as CategoryName),
	]);

	if (!articles || articles.length === 0) {
		notFound();
	}

	const totalPages = Math.ceil(totalCount / pageSize);
	const imageUrl = process.env.CLOUDFLARE_R2_PUBLIC_IMAGE_URL;

	const bgImageUrl = `${imageUrl}/category/${categoryName}.webp`;

	return (
		<main
			className="h-[30vh] bg-cover bg-center relative"
			style={{ backgroundImage: `url(${bgImageUrl})` }}
		>
			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-black opacity-50" />

			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4 relative z-10">
				<h2 className="text-white font-serif lg:text-5xl text-3xl font-bold my-6">
					<Link href={`/category/${categoryName}`}>
						{transformCategoryName(categoryName)}
					</Link>
				</h2>
				<p className="text-white font-serif text-lg font-bold mb-6 lg:w-1/2 w-full">
					{category?.description || "No description available"}
				</p>
				<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 items-stretch">
					{/* Latest Big Card  */}
					<div className="lg:col-span-4 ">
						<BigCard article={articles[0]} />
					</div>

					{/* Horizontal Cards */}
					<div className="lg:col-span-2 grid grid-rows-2 grid-cols-1 gap-4 sm:gap-6 ">
						<HorizontalCard article={articles[1]} />
						<HorizontalCard article={articles[2]} />
					</div>
				</div>

				{/* Vertical Card Section */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
					{articles.slice(3, 9).map((article) => (
						<VerticalCard
							key={`${article.title}-VerticalCard`}
							article={article}
						/>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Two Big Cards on the left */}
					<div className="flex items-center justify-center">
						<BigCard article={articles[9]} />
					</div>

					{/* NoImageCards on the right */}
					<div className="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 gap-4">
						{articles.slice(10, 17).map((article) => (
							<NoImageCard
								key={`${article.title}${article.id}`}
								article={article}
							/>
						))}
					</div>
				</div>
				<div className={"mt-12 "}>
					<PaginationComponent
						currentPage={currentPage}
						totalPages={totalPages}
						getPageHref={(page) => `/category/${categoryName}?page=${page}`}
					/>
				</div>
			</div>
			<Footer />
		</main>
	);
}
