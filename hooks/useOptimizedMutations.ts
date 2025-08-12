import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback } from "react";

// Optimized mutation hook with better error handling and optimistic updates
export function useOptimizedMutation<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    queryKey?: string[];
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    optimisticUpdate?: (variables: TVariables) => any;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  
  const {
    queryKey,
    onSuccess,
    onError,
    optimisticUpdate,
    successMessage,
    errorMessage
  } = options;

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (queryKey && optimisticUpdate) {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey });
        
        // Snapshot previous value
        const previousData = queryClient.getQueryData(queryKey);
        
        // Optimistically update
        queryClient.setQueryData(queryKey, optimisticUpdate(variables));
        
        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (queryKey && context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      if (errorMessage) {
        toast.error(errorMessage);
      }
      
      onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      // Always refetch after error or success
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    }
  });
}

// Batch mutation hook for multiple operations
export function useBatchMutation<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables[]) => Promise<TData>,
  options: {
    queryKey?: string[];
    onSuccess?: (data: TData, variables: TVariables[]) => void;
    onError?: (error: TError, variables: TVariables[]) => void;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  
  const {
    queryKey,
    onSuccess,
    onError,
    successMessage,
    errorMessage
  } = options;

  return useMutation({
    mutationFn,
    onError: (error, variables) => {
      if (errorMessage) {
        toast.error(errorMessage);
      }
      onError?.(error, variables);
    },
    onSuccess: (data, variables) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    }
  });
}

// Article-specific optimized mutations
export function useArticleMutations() {
  const queryClient = useQueryClient();

  const toggleMark = useOptimizedMutation(
    async ({ articleId, isMarked }: { articleId: number; isMarked: boolean }) => {
      const response = await fetch(`/api/articles/${articleId}/mark`, {
        method: isMarked ? "DELETE" : "POST",
      });
      if (!response.ok) throw new Error("Failed to toggle mark");
      return response.json();
    },
    {
      queryKey: ["articleStats"],
      successMessage: "Article bookmark updated",
      errorMessage: "Failed to update bookmark",
      optimisticUpdate: ({ isMarked }) => (prev: any) => ({
        ...prev,
        isMarked: !isMarked
      })
    }
  );

  const incrementRead = useOptimizedMutation(
    async (articleId: number) => {
      const response = await fetch(`/api/articles/${articleId}/read`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to increment read count");
      return response.json();
    },
    {
      queryKey: ["articleStats"],
      optimisticUpdate: () => (prev: any) => ({
        ...prev,
        userReadCount: (prev?.userReadCount || 0) + 1,
        totalReads: (prev?.totalReads || 0) + 1
      })
    }
  );

  const deleteArticle = useOptimizedMutation(
    async (articleId: number) => {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete article");
      return response.json();
    },
    {
      queryKey: ["articles"],
      successMessage: "Article deleted successfully",
      errorMessage: "Failed to delete article",
      optimisticUpdate: (articleId) => (prev: any[]) => 
        prev?.filter(article => article.id !== articleId) || []
    }
  );

  const deleteArticles = useBatchMutation(
    async (articleIds: number[]) => {
      const response = await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: articleIds }),
      });
      if (!response.ok) throw new Error("Failed to delete articles");
      return response.json();
    },
    {
      queryKey: ["articles"],
      successMessage: "Articles deleted successfully",
      errorMessage: "Failed to delete articles"
    }
  );

  return {
    toggleMark,
    incrementRead,
    deleteArticle,
    deleteArticles
  };
}
