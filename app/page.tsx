import Footer from "@/components/Footer";
import MaintenanceNotice from "@/components/MaintenanceNotice";
import dynamic from "next/dynamic";
import React from "react";

const LatestSection = dynamic(
	() => import("@/components/sections/LatestSection"),
	{
		loading: () => <SectionSkeleton title="Latest Articles" />,
	},
);
// Dynamic imports for better performance
const FeaturedSection = dynamic(
	() => import("@/components/sections/FeaturedSection"),
	{
		loading: () => <SectionSkeleton title="Featured Articles" />,
	},
);

const HottestSection = dynamic(
	() => import("@/components/sections/HottestSection"),
	{
		loading: () => <SectionSkeleton title="Hottest Articles" />,
	},
);

const CategoryShowcaseSection = dynamic(
	() => import("@/components/sections/CategoryShowcaseSection"),
	{
		loading: () => <SectionSkeleton title="Explore by Category" />,
	},
);

const RecentlyReadSection = dynamic(
	() => import("@/components/sections/RecentlyReadSection"),
	{
		loading: () => <SectionSkeleton title="Recently Reading" />,
	},
);

// Simple skeleton component for loading states
function SectionSkeleton({ title }: { title: string }) {
	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				{title}
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
				<div className="lg:col-span-4 bg-gray-200 animate-pulse rounded-lg h-64 sm:h-80 lg:h-96" />
				<div className="lg:col-span-2 space-y-4">
					<div className="bg-gray-200 animate-pulse rounded-lg h-32 sm:h-36 lg:h-44" />
					<div className="bg-gray-200 animate-pulse rounded-lg h-32 sm:h-36 lg:h-44" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
				{Array.from({ length: 12 }).map((_, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="bg-gray-200 animate-pulse rounded-lg h-48 sm:h-56"
					/>
				))}
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<>
			<main className="min-h-screen">
				Latest Articles Section
				<LatestSection />
				Featured Articles Section
				<FeaturedSection />
				Hottest Articles Section
				<HottestSection />
				Category Showcase Section
				<CategoryShowcaseSection />
				Recently Reading Section
				<RecentlyReadSection />
			</main>
			<Footer />
		</>
	);
}
