"use client";

import ArticleDialog from "@/components/ArticleDialog";
import MarkdownRenderer from "@/components/MarkdownRender";
import { Button } from "@/components/ui/button";
import { useArticleMutations } from "@/hooks/useArticleMutations";
import { useCurrentUser } from "@/hooks/useSession";
import { getUserArticleStats } from "@/lib/data/article-stats";
import { getNotices, updateNotices } from "@/lib/data/user";
import { transformCategoryName } from "@/lib/utils";
import type { ArticleWithCategory } from "@/types/interface";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, SmilePlus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

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

	// Use TanStack Query to fetch user notices
	const { data: noticesData } = useQuery({
		queryKey: ["userNotices", userId],
		queryFn: async () => {
			if (!userId) return null;
			return (await getNotices(userId)) as UserNotices | null;
		},
		enabled: isLoggedIn && !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const markNotice = noticesData?.markNotice || false;
	const masterNotice = noticesData?.masterNotice || false;
	const finishNotice = noticesData?.finishNotice || false;

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: ["articleStats", article.id],
		queryFn: () => getUserArticleStats(article.id),
		enabled: isLoggedIn,
	});

	// Use optimized mutations with optimistic updates
	const { toggleMark, toggleMaster, incrementRead, isAnyPending } =
		useArticleMutations(article.id, {
			enableOptimistic: true,
		});

	const handleToggleMark = async () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to mark articles");
			return;
		}

		if (!markNotice && userId) {
			await updateNotices(userId, "markNotice");
		}

		toggleMark.mutate();
	};

	const handleToggleMaster = async () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to master articles");
			return;
		}

		if (!masterNotice && userId) {
			await updateNotices(userId, "masterNotice");
		}

		toggleMaster.mutate();
	};

	const handleIncreaseFinishTime = async () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to track read times");
			return;
		}

		if (!finishNotice && userId) {
			await updateNotices(userId, "finishNotice");
		}
		incrementRead.mutate();
	};

	const isMarked = stats?.marked || false;
	const readTimes = stats?.readTimes || 0;
	const isMastered = stats?.mastered || false;
	const isLoading = isAnyPending;

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

			<div className={"flex flex-col  gap-2 py-16 items-end"}>
				<div className={"flex flex-row gap-2 items-center"}>
					{!markNotice && userId ? (
						<ArticleDialog triggerText={"mark"} onClick={handleToggleMark}>
							<Button
								variant="outline"
								className="cursor-pointer flex items-center gap-2"
								disabled={isLoading || isLoadingStats}
							>
								<Star
									className={`w-4 h-4 ${isMarked ? "fill-yellow-400" : ""}`}
								/>
								{isMarked ? "Marked" : "Mark"}
							</Button>
						</ArticleDialog>
					) : (
						<Button
							variant="outline"
							className="cursor-pointer flex items-center gap-2"
							onClick={handleToggleMark}
							disabled={isLoading || isLoadingStats}
						>
							<Star
								className={`w-4 h-4 ${isMarked ? "fill-yellow-400" : ""}`}
							/>
							{isMarked ? "Marked" : "Mark"}
						</Button>
					)}

					{!finishNotice && userId ? (
						<ArticleDialog
							triggerText={"finish"}
							onClick={handleIncreaseFinishTime}
						>
							<Button
								variant="outline"
								className="cursor-pointer flex items-center gap-2"
								disabled={isLoading || isLoadingStats}
							>
								<SmilePlus className="w-4 h-4" />
								Finished {readTimes} times
							</Button>
						</ArticleDialog>
					) : (
						<Button
							variant="outline"
							className="cursor-pointer flex items-center gap-2"
							onClick={handleIncreaseFinishTime}
							disabled={isLoading || isLoadingStats}
						>
							<SmilePlus className="w-4 h-4" />
							Finished {readTimes} times
						</Button>
					)}
				</div>

				{!masterNotice && userId ? (
					<ArticleDialog triggerText={"master"} onClick={handleToggleMaster}>
						<Button
							variant="outline"
							className="cursor-pointer flex items-center gap-2"
							disabled={isLoading || isLoadingStats}
						>
							<GraduationCap
								className={`w-4 h-4 ${isMastered ? "fill-green-400" : ""}`}
							/>
							{isMastered ? "Mastered" : "Master"}
						</Button>
					</ArticleDialog>
				) : (
					<Button
						variant="outline"
						className="cursor-pointer flex items-center gap-2"
						onClick={handleToggleMaster}
						disabled={isLoading || isLoadingStats}
					>
						<GraduationCap
							className={`w-4 h-4 ${isMastered ? "fill-green-400" : ""}`}
						/>
						{isMastered ? "Mastered" : "Master"}
					</Button>
				)}
			</div>
		</article>
	);
}

export default ArticleContent;
