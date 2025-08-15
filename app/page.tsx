import Footer from "@/components/Footer";
import CategoryShowcaseSection from "@/components/sections/CategoryShowcaseSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import HottestSection from "@/components/sections/HottestSection";
import LatestSection from "@/components/sections/LatestSection";
import RecentlyReadSection from "@/components/sections/RecentlyReadSection";
import { getUserSession } from "@/lib/auth/getUserSession";
import {
	getArticlesByCategories,
	getFeaturedArticles,
	getMoreHottestArticles,
	getLatestArticlesFromEachCategory,
} from "@/lib/data/article";
import { getUserRecentlyReadArticles } from "@/lib/data/user";
import { headers } from "next/headers";
import type React from "react";
import { CategoryName } from "@prisma/client";

export default async function Home() {
	// Fetch enhanced data for multiple sections
	const [latestArticles, hottestArticles, featuredArticles, categoryArticles] = await Promise.all([
		getLatestArticlesFromEachCategory(),
		getMoreHottestArticles(30),
		getFeaturedArticles(20),
		getArticlesByCategories([
			CategoryName.nature_geography,
			CategoryName.technology_invention,
			CategoryName.culture_history,
		], 6),
	]);

	const session = await getUserSession(await headers());

	const recentlyReadArticles = session?.user?.id
		? await getUserRecentlyReadArticles(session?.user.id, 6)
		: [];

	return (
		<>
			<main className="min-h-screen">
				{/* Latest Articles Section */}
				<LatestSection articles={latestArticles} />

				{/* Featured Articles Section */}
				<FeaturedSection articles={featuredArticles} />

				{/* Hottest Articles Section */}
				<HottestSection articles={hottestArticles} />

				{/* Category Showcase Section */}
				<CategoryShowcaseSection categoryArticles={categoryArticles} />

				{/* Recently Reading Section */}
				<RecentlyReadSection 
					recentlyReadArticles={recentlyReadArticles} 
					isLoggedIn={!!session?.user?.id} 
				/>
			</main>
			<Footer />
		</>
	);
}
