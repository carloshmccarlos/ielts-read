import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserArticleStats,
  increaseFinishTime,
  toggleMarkArticle,
  toggleMasterArticle,
} from "@/lib/data/article-stats";

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

export function useArticleMutations(articleId: number, config: MutationConfig = {}) {
  const queryClient = useQueryClient();
  const queryKey = ["articleStats", articleId];

  // Optimistic update helper
  const updateOptimistically = (updater: (old: ArticleStats | undefined) => ArticleStats | undefined) => {
    if (config.enableOptimistic !== false) {
      queryClient.setQueryData(queryKey, updater);
    }
  };

  // Revert optimistic update on error
  const revertOptimistic = (previousData: ArticleStats | undefined) => {
    if (config.enableOptimistic !== false && previousData) {
      queryClient.setQueryData(queryKey, previousData);
    }
  };

  const toggleMarkMutation = useMutation({
    mutationFn: () => toggleMarkArticle(articleId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData<ArticleStats>(queryKey);
      
      // Optimistically update
      updateOptimistically((old) => 
        old ? { ...old, marked: !old.marked } : undefined
      );
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Update with server response
      queryClient.setQueryData(queryKey, (old: ArticleStats | undefined) => 
        old ? { ...old, marked: data.marked } : undefined
      );
      toast.success(data.marked ? "Article marked" : "Article unmarked");
      config.onSuccess?.(data);
    },
    onError: (error, _, context) => {
      // Revert optimistic update
      revertOptimistic(context?.previousData);
      toast.error("Failed to update mark status");
      config.onError?.(error as Error);
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const toggleMasterMutation = useMutation({
    mutationFn: () => toggleMasterArticle(articleId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ArticleStats>(queryKey);
      
      updateOptimistically((old) => 
        old ? { ...old, mastered: !old.mastered } : undefined
      );
      
      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (old: ArticleStats | undefined) => 
        old ? { ...old, mastered: data.mastered } : undefined
      );
      toast.success(data.mastered ? "Article mastered" : "Article unmastered");
      config.onSuccess?.(data);
    },
    onError: (error, _, context) => {
      revertOptimistic(context?.previousData);
      toast.error("Failed to update mastered status");
      config.onError?.(error as Error);
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const incrementReadMutation = useMutation({
    mutationFn: () => increaseFinishTime(articleId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ArticleStats>(queryKey);
      
      updateOptimistically((old) => 
        old ? { ...old, readTimes: old.readTimes + 1 } : undefined
      );
      
      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (old: ArticleStats | undefined) => 
        old ? { ...old, readTimes: data.times } : undefined
      );
      toast.success(`You've read this article ${data.times} times`);
      config.onSuccess?.(data);
    },
    onError: (error, _, context) => {
      revertOptimistic(context?.previousData);
      toast.error("Failed to update read count");
      config.onError?.(error as Error);
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    toggleMark: {
      mutate: toggleMarkMutation.mutate,
      isPending: toggleMarkMutation.isPending,
      isError: toggleMarkMutation.isError,
      error: toggleMarkMutation.error,
    },
    toggleMaster: {
      mutate: toggleMasterMutation.mutate,
      isPending: toggleMasterMutation.isPending,
      isError: toggleMasterMutation.isError,
      error: toggleMasterMutation.error,
    },
    incrementRead: {
      mutate: incrementReadMutation.mutate,
      isPending: incrementReadMutation.isPending,
      isError: incrementReadMutation.isError,
      error: incrementReadMutation.error,
    },
    isAnyPending: toggleMarkMutation.isPending || toggleMasterMutation.isPending || incrementReadMutation.isPending,
  };
}
