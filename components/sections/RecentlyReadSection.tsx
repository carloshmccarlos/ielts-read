import HorizontalCard from "@/components/HorizontalCard";
import VerticalCard from "@/components/VerticalCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReadHistory } from "@/lib/data/user";

interface RecentlyReadSectionProps {
	recentlyReadArticles: ReadHistory[];
	isLoggedIn: boolean;
}

export default function RecentlyReadSection({ 
	recentlyReadArticles, 
	isLoggedIn 
}: RecentlyReadSectionProps) {
	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Recently Reading
			</h2>

			{isLoggedIn ? (
				recentlyReadArticles.length > 0 ? (
					<>
						{/* Horizontal cards for mobile */}
						<div className="sm:hidden space-y-4">
							{recentlyReadArticles.slice(0, 3).map((item) => (
								<HorizontalCard
									key={`mobile-${item.article.id}`}
									article={item.article}
									readCount={item.times}
								/>
							))}
						</div>

						{/* Vertical cards for larger screens */}
						<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
							{recentlyReadArticles.map((item) => (
								<VerticalCard
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
						Sign in to see your reading history and personalized recommendations.
					</p>
					<Link href="/auth/signin">
						<Button>Sign In</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
