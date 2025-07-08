import BigCard from "@/components/BigCard";
import Footer from "@/components/Footer";
import HorizontalCard from "@/components/HorizontalCard";
import NoImageCard from "@/components/NoImageCard";
import VerticalCard from "@/components/VerticalCard";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { getHottestArticles, getLatestArticles } from "@/lib/data/article";
import { getUserRecentlyReadArticles } from "@/lib/data/user";
import { headers } from "next/headers";
import Link from "next/link";
import type React from "react";

export default async function Home() {
	const latestArticles = await getLatestArticles();
	const hottestArticles = await getHottestArticles();
	
	// Get user session
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	
	// Get recently read articles if user is logged in
	const recentlyReadArticles = session?.user?.id 
		? await getUserRecentlyReadArticles(session.user.id, 6)
		: [];

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

					{/* Recently reading Section */}
					<div className="mt-12">
						<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
							Recently Reading
						</h2>
						
						{session?.user?.id ? (
							recentlyReadArticles.length > 0 ? (
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
									{/* Horizontal cards for mobile */}
									<div className="lg:hidden space-y-4">
										{recentlyReadArticles.slice(0, 3).map((item) => (
											<HorizontalCard 
												key={`mobile-${item.article.id}`} 
												article={item.article}
												readCount={item.times} 
											/>
										))}
									</div>
									
									{/* Layout for desktop */}
									<div className="hidden lg:block lg:col-span-2">
										<div className="grid grid-cols-1 gap-4">
											{recentlyReadArticles.slice(0, 2).map((item) => (
												<HorizontalCard 
													key={`desktop-${item.article.id}`} 
													article={item.article}
													readCount={item.times}
												/>
											))}
										</div>
									</div>
									
									<div className="hidden lg:grid lg:grid-cols-2 gap-4">
										{recentlyReadArticles.slice(2, 6).map((item) => (
											<NoImageCard 
												key={`desktop-small-${item.article.id}`} 
												article={item.article} 
												readCount={item.times}
											/>
										))}
									</div>
								</div>
							) : (
								<div className="bg-muted/50 rounded-lg p-8 text-center">
									<p className="text-lg mb-4">You haven't read any articles yet.</p>
									<p className="text-muted-foreground mb-6">Start reading to see your recently read articles here.</p>
								</div>
							)
						) : (
							<div className="bg-muted/50 rounded-lg p-8 text-center">
								<p className="text-lg mb-4">Sign in to see your recently read articles</p>
								<p className="text-muted-foreground mb-6">Track your reading progress and save your favorite articles.</p>
								<Link href="/auth/login">
									<Button size="lg">Sign In</Button>
								</Link>
							</div>
						)}
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
