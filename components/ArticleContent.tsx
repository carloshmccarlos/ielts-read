"use client";

import MarkdownRenderer from "@/components/MarkdownRender";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import {
	getUserArticleStats,
	incrementReadCount,
	toggleMarkArticle,
	toggleMasterArticle,
} from "@/lib/data/article-stats";
import { transformCategoryName } from "@/lib/utils";
import type { ArticleWithCategory } from "@/types/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, SmilePlus, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
	article: ArticleWithCategory;
}

function ArticleContent({ article }: Props) {
	const session = authClient.useSession();
	const queryClient = useQueryClient();
	const showCategoryName = transformCategoryName(article.Category?.name || "");

	const isLoggedIn = !!session.data?.user;

	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: ["articleStats", article.id],
		queryFn: () => getUserArticleStats(article.id),
		enabled: isLoggedIn,
	});

	const { mutate: toggleMark, isPending: isTogglingMark } = useMutation({
		mutationFn: () => toggleMarkArticle(article.id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["articleStats", article.id],
			});
			toast.success(data.marked ? "Article marked" : "Article unmarked");
		},
		onError: () => {
			toast.error("Failed to update mark status");
		},
	});

	const { mutate: toggleMaster, isPending: isTogglingMaster } = useMutation({
		mutationFn: () => toggleMasterArticle(article.id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["articleStats", article.id],
			});
			toast.success(data.mastered ? "Article mastered" : "Article unmastered");
		},
		onError: () => {
			toast.error("Failed to update mastered status");
		},
	});

	const { mutate: incrementRead, isPending: isIncrementingRead } = useMutation({
		mutationFn: () => incrementReadCount(article.id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["articleStats", article.id],
			});
			toast.success(`You've read this article ${data.times} times`);
		},
		onError: () => {
			toast.error("Failed to update read count");
		},
	});

	const handleToggleMark = () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to mark articles");
			return;
		}
		toggleMark();
	};

	const handleToggleMaster = () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to master articles");
			return;
		}
		toggleMaster();
	};

	const handleIncrementReadCount = () => {
		if (!isLoggedIn) {
			toast.error("You must be logged in to track read times");
			return;
		}
		incrementRead();
	};

	const isMarked = stats?.marked || false;
	const readTimes = stats?.readTimes || 0;
	const isMastered = stats?.mastered || false;
	const isLoading = isTogglingMark || isIncrementingRead || isTogglingMaster;

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

			<div className={"flex gap-4 py-16 justify-end"}>
				<Button
					variant="outline"
					className="cursor-pointer flex items-center gap-2"
					onClick={handleToggleMark}
					disabled={isLoading || isLoadingStats}
				>
					<Star className={`w-4 h-4 ${isMarked ? "fill-yellow-400" : ""}`} />
					{isMarked ? "Marked" : "Mark"}
				</Button>

				<Button
					variant="outline"
					className="cursor-pointer flex items-center gap-2"
					onClick={handleToggleMaster}
					disabled={isLoading || isLoadingStats}
				>
					<GraduationCap className={`w-4 h-4 ${isMastered ? "fill-green-400" : ""}`} />
					{isMastered ? "Mastered" : "Master"}
				</Button>

				<Button
					variant="outline"
					className="cursor-pointer flex items-center gap-2"
					onClick={handleIncrementReadCount}
					disabled={isLoading || isLoadingStats}
				>
					<SmilePlus className="w-4 h-4" />
					Finished {readTimes} times
				</Button>
			</div>
		</article>
	);
}

export default ArticleContent;
