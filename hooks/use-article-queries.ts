'use client';

import { useQuery } from "@tanstack/react-query";
import {
	getArticlesByCategories,
	getFeaturedArticles,
	getHottestArticles,
	getLatestArticles,
} from "@/lib/actions/article";
import { getUserRecentlyReadArticles } from "@/lib/actions/articles-with-user";
import { useCurrentUser } from "./useSession";

const staleTime = 1000 * 60 * 5; // 5 minutes

export function useLatestArticles() {
	const { user, isLoading } = useCurrentUser();
	return useQuery({
		queryKey: ["latestArticles", user?.id],
		queryFn: () => getLatestArticles(user?.id),
		staleTime,
		enabled: !isLoading,
	});
}

export function useFeaturedArticles() {
	const { user, isLoading } = useCurrentUser();
	return useQuery({
		queryKey: ["featuredArticles", user?.id],
		queryFn: () => getFeaturedArticles(20, user?.id),
		staleTime,
		enabled: !isLoading,
	});
}

export function useHottestArticles() {
	const { user, isLoading } = useCurrentUser();
	return useQuery({
		queryKey: ["hottestArticles", user?.id],
		queryFn: () => getHottestArticles(user?.id),
		staleTime,
		enabled: !isLoading,
	});
}

export function useCategoryShowcaseArticles(categories: string[]) {
	const { user, isLoading } = useCurrentUser();
	return useQuery({
		queryKey: ["categoryShowcase", categories, user?.id],
		queryFn: () => getArticlesByCategories(categories as any, 6, user?.id),
		staleTime,
		enabled: !isLoading && !!categories && categories.length > 0,
	});
}

export function useRecentlyReadArticles() {
	const { user, isLoading, isLoggedIn } = useCurrentUser();

	return useQuery({
		queryKey: ["recentlyReadArticles", user?.id],
		queryFn: () => getUserRecentlyReadArticles(user!.id, 6),
		staleTime,
		enabled: !isLoading && isLoggedIn && !!user?.id,
	});
}
