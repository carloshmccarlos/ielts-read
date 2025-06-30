import { notFound } from "next/navigation";
import React from "react";

import BigCard from "@/components/BigCard";
import Footer from "@/components/Footer";
import HorizontalCard from "@/components/HorizontalCard";
import NoImageCard from "@/components/NoImageCard";
import PaginationComponent from "@/components/PaginationComponent";
import VerticalCard from "@/components/VerticalCard";
import {
	countArticlesByCategory,
	getArticlesByCategory,
} from "@/lib/data/article";

import { CategoryName } from "@prisma/client";
import { pathToCategory, transformCategoryName } from "@/lib/utils";
import Link from "next/link";

interface Props {
	params: Promise<{
		name: string;
	}>;
	searchParams: Promise<{
		page: number;
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
		? Number.parseInt(Array.isArray(page) ? page[0] : page, 10)
		: 1;
	const skip = (currentPage - 1) * pageSize;

	// 验证categoryName是否为有效的分类

	const isValidCategory = Object.keys(CategoryName).includes(categoryName);
	if (!isValidCategory) {
		notFound();
	}

	const [articles, totalCount] = await Promise.all([
		getArticlesByCategory(categoryName, skip, pageSize),
		countArticlesByCategory(categoryName),
	]);

	if (!articles || articles.length === 0) {
		notFound();
	}

	const totalPages = Math.ceil(totalCount / pageSize);

	return (
		<main className="h-[30vh] bg-[url('/content-image/1.png')] bg-cover bg-center">
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<h2 className="text-white font-serif lg:text-5xl text-3xl font-bold my-6">
					<Link href={`/category/${categoryName}`}>
						{transformCategoryName(categoryName)}
					</Link>
				</h2>
				<p className="text-white font-serif text-lg font-bold mb-6 w-1/2">
					Animal protection is a broad and multifaceted concept that encompasses
					a range of efforts aimed at safeguarding the well-being, health, and
					inherent value of non-human animals.
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
