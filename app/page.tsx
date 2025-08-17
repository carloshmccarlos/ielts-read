import Footer from "@/components/Footer";
import LazySection, { withLazySection } from "@/components/sections/LazySection";
import LazyLatestSection from "@/components/sections/LazyLatestSection";
import LazyFeaturedSection from "@/components/sections/LazyFeaturedSection";
import LazyHottestSection from "@/components/sections/LazyHottestSection";
import LazyCategoryShowcaseSection from "@/components/sections/LazyCategoryShowcaseSection";
import LazyRecentlyReadSection from "@/components/sections/LazyRecentlyReadSection";
import type React from "react";

export default function Home() {

	return (
		<>
			<main className="min-h-screen">
				{/* Latest Articles Section - Priority loading (above the fold) */}
				<LazySection sectionName="Latest" priority={true}>
					<LazyLatestSection />
				</LazySection>

				{/* Featured Articles Section - Lazy load when approaching viewport */}
				<LazySection sectionName="Featured" threshold={0.1} rootMargin="200px">
					<LazyFeaturedSection />
				</LazySection>

				{/* Hottest Articles Section - Lazy load when approaching viewport */}
				<LazySection sectionName="Hottest" threshold={0.1} rootMargin="150px">
					<LazyHottestSection />
				</LazySection>

				{/* Category Showcase Section - Lazy load when closer to viewport */}
				<LazySection sectionName="CategoryShowcase" threshold={0.05} rootMargin="100px">
					<LazyCategoryShowcaseSection />
				</LazySection>

				{/* Recently Reading Section - Lazy load when very close to viewport */}
				<LazySection sectionName="RecentlyRead" threshold={0.05} rootMargin="50px">
					<LazyRecentlyReadSection />
				</LazySection>
			</main>
			<Footer />
		</>
	);
}
