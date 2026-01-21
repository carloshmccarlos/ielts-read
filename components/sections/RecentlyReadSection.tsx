"use client";

import HorizontalCard from "@/components/HorizontalCard";
import Spinner from "@/components/Spinner";
import VerticalCard from "@/components/VerticalCard";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useSession";
import type { ArticleWithCategory } from "@/types/interface";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface RecentlyReadItem {
	article: ArticleWithCategory;
	times: number;
}

interface RecentlyReadResult {
	status: "ok" | "unauthenticated";
	articles: RecentlyReadItem[];
}

const DEFAULT_LIMIT = 6;

async function fetchRecentlyRead(
	limit: number,
): Promise<RecentlyReadResult> {
	const response = await fetch(
		`/api/user/recently-read?limit=${limit}`,
	);

	if (response.status === 401) {
		return { status: "unauthenticated", articles: [] };
	}

	if (!response.ok) {
		throw new Error("Failed to fetch recently read articles");
	}

	const data = await response.json();
	return { status: "ok", articles: data.articles ?? [] };
}

export default function RecentlyReadSection() {
	const { isLoggedIn, isLoading: isSessionLoading } = useCurrentUser();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["recentlyRead", DEFAULT_LIMIT],
		queryFn: () => fetchRecentlyRead(DEFAULT_LIMIT),
		enabled: isLoggedIn,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	if (isSessionLoading || isLoading) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
					Recently Reading
				</h2>
				<div className="relative h-24">
					<Spinner />
				</div>
			</div>
		);
	}

	if (!isLoggedIn) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
					Recently Reading
				</h2>
				<div className="text-center py-12">
					<p className="text-gray-600 text-lg mb-4">
						Sign in to see your reading history and personalized
						recommendations.
					</p>
					<Link href="/auth/login">
						<Button>Sign In</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
					Recently Reading
				</h2>
				<div className="text-center py-12">
					<p className="text-gray-600 text-lg mb-4">
						Unable to load reading history right now.
					</p>
					<Link href="/auth/login">
						<Button>Sign In</Button>
					</Link>
				</div>
			</div>
		);
	}

	const articles = data?.articles ?? [];

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Recently Reading
			</h2>

			{articles.length > 0 ? (
				<>
					{/* Horizontal cards for mobile */}
					<div className="sm:hidden space-y-4">
						{articles.slice(0, 3).map((item) => (
							<HorizontalCard
								key={`mobile-${item.article.id}`}
								article={item.article}
								readCount={item.times}
							/>
						))}
					</div>

					{/* Vertical cards for larger screens */}
					<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
						{articles.map((item) => (
							<VerticalCard
								key={`desktop-${item.article.id}`}
								article={item.article}
								readCount={item.times}
							/>
						))}
					</div>

					{/* View More Button */}
					<div className="flex justify-center mt-8">
						<Link href="/user/collection">
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
			)}
		</div>
	);
}
