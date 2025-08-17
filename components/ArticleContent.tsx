"use client";

import MarkdownRenderer from "@/components/MarkdownRender";
import { useArticleMutations } from "@/hooks/useArticleMutations";
import { useCurrentUser } from "@/hooks/useSession";
import { getUserArticleStats } from "@/lib/actions/article-stats";
import { getNotices, updateNotices } from "@/lib/actions/articles-with-user";
import { transformCategoryName } from "@/lib/utils";
import type { ArticleWithCategory } from "@/types/interface";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner";

// Dynamic import for ArticleActionButtons
const ArticleActionButtons = dynamic(
	() => import("@/components/ArticleActionButtons"),
	{
		loading: () => (
			<div className="flex flex-col gap-2 py-16 items-end">
				<div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
			</div>
		),
		ssr: false,
	},
);

interface Props {
	article: ArticleWithCategory;
}

// Define the type for user notices
interface UserNotices {
	markNotice: boolean;
	masterNotice: boolean;
	finishNotice: boolean;
}

function ArticleContent({ article }: Props) {
	const { user, isLoggedIn } = useCurrentUser();
	const showCategoryName = transformCategoryName(article.Category?.name || "");
	const userId = user?.id;

	// Optimized parallel data fetching with better error handling
	const { data: noticesData, error: noticesError, isLoading: isLoadingNotices } = useQuery({
		queryKey: ["userNotices", userId],
		queryFn: async () => {
			if (!userId) return null;
			try {
				return (await getNotices(userId)) as UserNotices | null;
			} catch (error) {
				console.error("Failed to fetch user notices:", error);
				throw error;
			}
		},
		enabled: isLoggedIn && !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const { data: stats, error: statsError, isLoading: isLoadingStats } = useQuery({
		queryKey: ["articleStats", article.id, userId],
		queryFn: async () => {
			try {
				return await getUserArticleStats(article.id);
			} catch (error) {
				console.error("Failed to fetch article stats:", error);
				throw error;
			}
		},
		enabled: isLoggedIn && !!userId,
		staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for stats)
		gcTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	// Derived state with fallbacks
	const markNotice = noticesData?.markNotice ?? false;
	const masterNotice = noticesData?.masterNotice ?? false;
	const finishNotice = noticesData?.finishNotice ?? false;

	// Handle errors gracefully
	if (noticesError) {
		console.warn("User notices unavailable:", noticesError);
	}
	if (statsError) {
		console.warn("Article stats unavailable:", statsError);
	}

	// Use optimized mutations with optimistic updates
	const { toggleMark, toggleMaster, incrementRead, isAnyPending } =
		useArticleMutations(article.id, {
			enableOptimistic: true,
		});

	// Optimized mutation handlers with better error handling
	const handleToggleMark = async () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to mark articles");
			return;
		}

		try {
			// Update notice first if needed
			if (!markNotice && userId) {
				await updateNotices(userId, "markNotice");
			}
			// Execute mutation
			toggleMark.mutate();
		} catch (error) {
			console.error("Failed to toggle mark:", error);
			toast.error("Failed to update article. Please try again.");
		}
	};

	const handleToggleMaster = async () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to master articles");
			return;
		}

		try {
			// Update notice first if needed
			if (!masterNotice && userId) {
				await updateNotices(userId, "masterNotice");
			}
			// Execute mutation
			toggleMaster.mutate();
		} catch (error) {
			console.error("Failed to toggle master:", error);
			toast.error("Failed to update article. Please try again.");
		}
	};

	const handleIncreaseFinishTime = async () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to track read times");
			return;
		}

		try {
			// Update notice first if needed
			if (!finishNotice && userId) {
				await updateNotices(userId, "finishNotice");
			}
			// Execute mutation
			incrementRead.mutate();
		} catch (error) {
			console.error("Failed to increment read time:", error);
			toast.error("Failed to update read count. Please try again.");
		}
	};

	// Derived state with better fallbacks and loading states
	const isMarked = stats?.marked ?? false;
	const readTimes = stats?.readTimes ?? 0;
	const isMastered = stats?.mastered ?? false;
	const isLoading = isAnyPending || isLoadingStats || isLoadingNotices;

	// Show loading state for critical data
	const isDataLoading = isLoggedIn && (isLoadingStats || isLoadingNotices);

	// Determine if we should show action buttons
	const shouldShowActions = isLoggedIn && !isDataLoading;

	return (
		<article className="py-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto relative">
			<header className="mb-8">
				<div className="flex items-center gap-4 mb-4">
					<div className="text-lg font-bold text-red-700 ">
						{showCategoryName}
					</div>
				</div>

				<h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight">
					{article.title}
				</h1>

				<div className="flex items-center justify-between gap-4 mb-4">
					<time className="text-sm text-gray-500">
						{new Date(article.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</time>
				</div>

				{article.description && (
					<p className="text-lg md:text-xl text-gray-600 leading-relaxed">
						{article.description}
					</p>
				)}
			</header>

			{article.imageUrl && (
				<div className=" relative w-full mb-8 aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
					<Image
						src={article.imageUrl}
						alt={article.title}
						fill
						className="object-cover"
						priority
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
					/>
				</div>
			)}

			<MarkdownRenderer content={article.content} />

			{/* Conditionally render action buttons based on auth and loading state */}
			{shouldShowActions ? (
				<ArticleActionButtons
					userId={userId}
					isMarked={isMarked}
					isMastered={isMastered}
					readTimes={readTimes}
					isLoading={isLoading}
					isLoadingStats={isLoadingStats}
					markNotice={markNotice}
					masterNotice={masterNotice}
					finishNotice={finishNotice}
					handleToggleMark={handleToggleMark}
					handleToggleMaster={handleToggleMaster}
					handleIncreaseFinishTime={handleIncreaseFinishTime}
				/>
			) : isDataLoading ? (
				<>
					{/* Loading skeleton for action buttons */}
					<div className="flex flex-col gap-2 py-16 items-end">
						<div className="flex flex-row gap-2 items-center">
							<div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
							<div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
						</div>
						<div className="animate-pulse bg-gray-200 h-10 w-24 rounded"></div>
					</div>
				</>
			) : !isLoggedIn ? (
				<>
					{/* Message for non-logged-in users */}
					<div className="flex flex-col gap-2 py-16 items-end">
						<p className="text-sm text-gray-500 italic">
							Sign in to mark articles, track progress, and more.
						</p>
					</div>
				</>
			) : null}
		</article>
	);
}

export default ArticleContent;
