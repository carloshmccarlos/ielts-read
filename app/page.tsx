import HorizontalCard from "@/components/HorizontalCard";
import VerticalCard from "@/components/VerticalCard";

import BigCard from "@/components/BigCard";
import Footer from "@/components/Footer";
import NoImageCard from "@/components/NoImageCard";
import { getHottestArticles, getLatestArticles } from "@/lib/data/article";

import { ModeToggle } from "@/components/ThemeToggle";
import type React from "react";

export default async function Home() {
	const latestArticles = await getLatestArticles();
	const hottestArticles = await getHottestArticles();

	return (
		<>
			<main className="min-h-screen">
				{/* Latest Card Section */}
				<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
					<h2 className=" font-serif lg:text-5xl text-3xl font-bold mb-6">
						Latest Articles
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 items-stretch">
						{/* Latest Big Card  */}
						<div className="lg:col-span-4 ">
							<BigCard article={latestArticles[0]} />
						</div>

						{/* Horizontal Cards */}
						<div className="lg:col-span-2 grid grid-cols-1 grid-rows-2 gap-4 sm:gap-6 ">
							<HorizontalCard article={latestArticles[1]} />
							<HorizontalCard article={latestArticles[2]} />
						</div>
					</div>

					{/* Vertical Card Section */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
						{latestArticles.slice(3, 9).map((article) => (
							<VerticalCard
								key={`${article.title}-VerticalCard`}
								article={article}
							/>
						))}
					</div>

					{/* Hottest Section */}
					<h2 className=" font-serif lg:text-5xl text-3xl font-bold mb-6">
						Hottest Articles
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{/* Two Big Cards on the left */}
						<div className="flex items-center justify-center">
							<BigCard article={hottestArticles[0]} />
						</div>

						{/* NoImageCards on the right */}
						<div className="grid grid-cols-2 lg:grid-rows-2 lg:grid-cols-3 gap-4">
							{hottestArticles.slice(1, 7).map((article) => (
								<NoImageCard
									key={`${article.title}${article.id}`}
									article={article}
								/>
							))}
						</div>
					</div>
				</div>
				<Footer />
			</main>
		</>
	);
}

// Generate static-data metadata
export const metadata = {
	title: "I READ",
	description: "Reading is the best way to learn",
};
