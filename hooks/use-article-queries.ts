'use client';

import { useQuery } from "@tanstack/react-query";
import { getArticlesByCategories, getFeaturedArticles, getHottestArticles, getLatestArticles } from "@/lib/actions/article";
import { getUserRecentlyReadArticles } from "@/lib/actions/articles-with-user";
import { useCurrentUser } from "./useSession";

const staleTime = 1000 * 60 * 5; // 5 minutes

export function useLatestArticles() {
    const { session, isLoading } = useCurrentUser();
    return useQuery({
        queryKey: ["latestArticles", session?.user?.id],
        queryFn: () => getLatestArticles(session?.user?.id),
        staleTime,
        enabled: !isLoading,
    });
}

export function useFeaturedArticles() {
    const { session, isLoading } = useCurrentUser();
    return useQuery({
        queryKey: ["featuredArticles", session?.user?.id],
        queryFn: () => getFeaturedArticles(20, session?.user?.id),
        staleTime,
        enabled: !isLoading,
    });
}

export function useHottestArticles() {
    const { session, isLoading } = useCurrentUser();
    return useQuery({
        queryKey: ["hottestArticles", session?.user?.id],
        queryFn: () => getHottestArticles(session?.user?.id),
        staleTime,
        enabled: !isLoading,
    });
}

export function useCategoryShowcaseArticles(categories: string[]) {
    const { session, isLoading } = useCurrentUser();
    return useQuery({
        queryKey: ["categoryShowcase", categories, session?.user?.id],
        queryFn: () => getArticlesByCategories(categories as any, 6, session?.user?.id),
        staleTime,
        enabled: !isLoading && categories && categories.length > 0,
    });
}

export function useRecentlyReadArticles() {
    const { session, isLoading, isLoggedIn } = useCurrentUser();

    return useQuery({
        queryKey: ["recentlyReadArticles", session?.user?.id],
        queryFn: () => getUserRecentlyReadArticles(session!.user.id, 6),
        staleTime,
        enabled: !isLoading && isLoggedIn && !!session?.user?.id,
    });
};
