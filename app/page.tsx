import Footer from "@/components/Footer";

import type React from "react";

import {
	ArticleSkeleton,
	CategorySkeleton,
} from "@/components/performance/LazyLoader";
import LatestSection from "@/components/sections/LatestSection";

import dynamic from "next/dynamic";

const FeaturedSection = dynamic(
	() => import("@/components/sections/FeaturedSection"),
	{ loading: () => <ArticleSkeleton /> },
);

const HottestSection = dynamic(
	() => import("@/components/sections/HottestSection"),
	{ loading: () => <ArticleSkeleton /> },
);

const CategoryShowcaseSection = dynamic(
	() => import("@/components/sections/CategoryShowcaseSection"),
	{ loading: () => <CategorySkeleton /> },
);

const RecentlyReadSection = dynamic(
	() => import("@/components/sections/RecentlyReadSection"),
	{ loading: () => <ArticleSkeleton /> },
);

export default function Home() {
	// All data fetching is now handled by the individual section components.

	return (
		<>
			<main className="min-h-screen">
				{/* Latest Articles Section - Loaded immediately */}
				<LatestSection />

				{/* Featured Articles Section - Lazy Loaded */}
				<FeaturedSection />

				{/* Hottest Articles Section - Lazy Loaded */}
				<HottestSection />

				{/* Category Showcase Section - Lazy Loaded */}
				<CategoryShowcaseSection />

				{/* Recently Reading Section - Lazy Loaded */}
				<RecentlyReadSection />
			</main>
			<Footer />
		</>
	);
}
