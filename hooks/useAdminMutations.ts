import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationConfig {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

async function deleteArticle(id: number) {
  const response = await fetch(`/api/articles/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete article");
  }
  
  return { id };
}

async function deleteArticles(ids: number[]) {
  const response = await fetch("/api/articles", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete articles");
  }
  
  return { ids };
}

export function useAdminMutations(config: MutationConfig = {}) {
  const queryClient = useQueryClient();
  const articlesQueryKey = ["articles"];

  const deleteArticleMutation = useMutation({
    mutationFn: deleteArticle,
    onMutate: async (id: number) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: articlesQueryKey });
      
      // Snapshot previous value
      const previousArticles = queryClient.getQueryData(articlesQueryKey);
      
      // Optimistically remove the article
      queryClient.setQueryData(articlesQueryKey, (old: any[]) => 
        old ? old.filter(article => article.id !== id) : []
      );
      
      return { previousArticles };
    },
    onSuccess: (data) => {
      toast.success("Article deleted successfully");
      config.onSuccess?.(data);
    },
    onError: (error, id, context) => {
      // Revert optimistic update
      if (context?.previousArticles) {
        queryClient.setQueryData(articlesQueryKey, context.previousArticles);
      }
      
      const message = error instanceof Error ? error.message : "Failed to delete article";
      toast.error(message);
      config.onError?.(error as Error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: articlesQueryKey });
    },
    retry: 1,
    retryDelay: 1000,
  });

  const deleteArticlesMutation = useMutation({
    mutationFn: deleteArticles,
    onMutate: async (ids: number[]) => {
      await queryClient.cancelQueries({ queryKey: articlesQueryKey });
      
      const previousArticles = queryClient.getQueryData(articlesQueryKey);
      
      // Optimistically remove the articles
      queryClient.setQueryData(articlesQueryKey, (old: any[]) => 
        old ? old.filter(article => !ids.includes(article.id)) : []
      );
      
      return { previousArticles };
    },
    onSuccess: (data) => {
      toast.success(`${data.ids.length} articles deleted successfully`);
      config.onSuccess?.(data);
    },
    onError: (error, ids, context) => {
      // Revert optimistic update
      if (context?.previousArticles) {
        queryClient.setQueryData(articlesQueryKey, context.previousArticles);
      }
      
      const message = error instanceof Error ? error.message : "Failed to delete articles";
      toast.error(message);
      config.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articlesQueryKey });
    },
    retry: 1,
    retryDelay: 1000,
  });

  return {
    deleteArticle: {
      mutate: deleteArticleMutation.mutate,
      isPending: deleteArticleMutation.isPending,
      isError: deleteArticleMutation.isError,
      error: deleteArticleMutation.error,
    },
    deleteArticles: {
      mutate: deleteArticlesMutation.mutate,
      isPending: deleteArticlesMutation.isPending,
      isError: deleteArticlesMutation.isError,
      error: deleteArticlesMutation.error,
    },
    isAnyPending: deleteArticleMutation.isPending || deleteArticlesMutation.isPending,
  };
}
