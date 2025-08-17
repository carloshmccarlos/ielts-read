"use client";

import LazyHorizontalCard from "@/components/cards/LazyHorizontalCard";
import LazyVerticalCard from "@/components/cards/LazyVerticalCard";
import { Button } from "@/components/ui/button";
import { getUserRecentlyReadArticles } from "@/lib/actions/articles-with-user";
import { useCurrentUser } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { memo } from "react";

function LazyRecentlyReadSection() {
	const { user, isLoggedIn } = useCurrentUser();
	
	const { data: recentlyReadArticles, isLoading, error } = useQuery({
		queryKey: ['recently-read-articles', user?.id],
		queryFn: () => user?.id ? getUserRecentlyReadArticles(user.id, 6) : Promise.resolve([]),
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000, // 2 minutes
		gcTime: 5 * 60 * 1000, // 5 minutes
	});

	if (isLoading && isLoggedIn) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="animate-pulse">
					<div className="h-8 lg:h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
					<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="space-y-3">
								<div className="h-32 bg-gray-200 rounded"></div>
								<div className="h-4 bg-gray-200 rounded w-3/4"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error && isLoggedIn) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="text-center py-8">
					<p className="text-red-500">Failed to load reading history. Please try again.</p>
				</div>
			</div>
		);
	}
	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Recently Reading
			</h2>

			{isLoggedIn ? (
				recentlyReadArticles && recentlyReadArticles.length > 0 ? (
					<>
						{/* Horizontal cards for mobile */}
						<div className="sm:hidden space-y-4">
							{recentlyReadArticles.slice(0, 3).map((item) => (
								<LazyHorizontalCard
									key={`mobile-${item.article.id}`}
									article={item.article}
									readCount={item.times}
								/>
							))}
						</div>

						{/* Vertical cards for larger screens */}
						<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
							{recentlyReadArticles.map((item) => (
								<LazyVerticalCard
									key={`desktop-${item.article.id}`}
									article={item.article}
									readCount={item.times}
								/>
							))}
						</div>

						{/* View More Button */}
						<div className="flex justify-center mt-8">
							<Link href="/user/profile">
								<Button variant="outline" size="lg">
									View All Reading History
								</Button>
							</Link>
						</div>
					</>
				) : (
					<div className="text-center py-12">
						<p className="text-gray-600 text-lg mb-4">
							You haven't read any articles yet.
						</p>
						<Link href="/article">
							<Button>Start Reading</Button>
						</Link>
					</div>
				)
			) : (
				<div className="text-center py-12">
					<p className="text-gray-600 text-lg mb-4">
						Sign in to see your reading history and personalized
						recommendations.
					</p>
					<Link href="/auth/signin">
						<Button>Sign In</Button>
					</Link>
				</div>
			)}
		</div>
	);
}

export default memo(LazyRecentlyReadSection);
