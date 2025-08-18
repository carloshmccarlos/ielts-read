import {
	getUserArticleStats,
	increaseFinishTime,
	toggleMarkArticle,
	toggleMasterArticle,
} from "@/lib/actions/article-stats";
import { useCurrentUser } from "@/hooks/useSession";
import { useState } from "react";
import { toast } from "sonner";

interface ArticleStats {
	marked: boolean;
	mastered: boolean;
	readTimes: number;
}

interface MutationConfig {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
	enableOptimistic?: boolean;
}

export function useArticleMutations(
	articleId: number,
	config: MutationConfig = {},
) {
	const { isLoggedIn } = useCurrentUser();
	const [isToggleMarkPending, setIsToggleMarkPending] = useState(false);
	const [isToggleMasterPending, setIsToggleMasterPending] = useState(false);
	const [isIncrementReadPending, setIsIncrementReadPending] = useState(false);

	const toggleMark = {
		mutate: async () => {
			if (!isLoggedIn) {
				toast.error("You must be logged in to mark articles");
				return;
			}

			setIsToggleMarkPending(true);
			try {
				const result = await toggleMarkArticle(articleId);
				toast.success(result.marked ? "Article marked!" : "Article unmarked!");
				config.onSuccess?.(result);
			} catch (error) {
				const err = error instanceof Error ? error : new Error("Failed to update article status");
				toast.error(err.message);
				config.onError?.(err);
			} finally {
				setIsToggleMarkPending(false);
			}
		},
		isPending: isToggleMarkPending,
	};

	const toggleMaster = {
		mutate: async () => {
			if (!isLoggedIn) {
				toast.error("You must be logged in to master articles");
				return;
			}

			setIsToggleMasterPending(true);
			try {
				const result = await toggleMasterArticle(articleId);
				toast.success(result.mastered ? "Article mastered!" : "Article unmastered!");
				config.onSuccess?.(result);
			} catch (error) {
				const err = error instanceof Error ? error : new Error("Failed to update article status");
				toast.error(err.message);
				config.onError?.(err);
			} finally {
				setIsToggleMasterPending(false);
			}
		},
		isPending: isToggleMasterPending,
	};

	const incrementRead = {
		mutate: async () => {
			if (!isLoggedIn) {
				return; // Silently fail for read count if not logged in
			}

			setIsIncrementReadPending(true);
			try {
				const result = await increaseFinishTime(articleId);
				config.onSuccess?.(result);
			} catch (error) {
				const err = error instanceof Error ? error : new Error("Failed to update read count");
				// Don't show toast for read count errors to avoid annoying users
				console.error("Failed to update read count:", err);
				config.onError?.(err);
			} finally {
				setIsIncrementReadPending(false);
			}
		},
		isPending: isIncrementReadPending,
	};

	return {
		toggleMark,
		toggleMaster,
		incrementRead,
		isAnyPending: isToggleMarkPending || isToggleMasterPending || isIncrementReadPending,
	};
}
