// Client-safe API functions for fetching articles
import type { ArticleWithCategory } from "@/types/interface";
import type { ReadHistory } from "@/lib/actions/articles-with-user";

const API_BASE = '/api';

export async function fetchLatestArticles(): Promise<ArticleWithCategory[]> {
	const response = await fetch(`${API_BASE}/articles/latest`);
	if (!response.ok) {
		throw new Error('Failed to fetch latest articles');
	}
	return response.json();
}

export async function fetchFeaturedArticles(limit: number = 20): Promise<ArticleWithCategory[]> {
	const response = await fetch(`${API_BASE}/articles/featured?limit=${limit}`);
	if (!response.ok) {
		throw new Error('Failed to fetch featured articles');
	}
	return response.json();
}

export async function fetchHottestArticles(limit: number = 30): Promise<ArticleWithCategory[]> {
	const response = await fetch(`${API_BASE}/articles/hottest?limit=${limit}`);
	if (!response.ok) {
		throw new Error('Failed to fetch hottest articles');
	}
	return response.json();
}

export async function fetchCategoryArticles(
	categories?: string[], 
	limit: number = 6
): Promise<{ categoryName: string; articles: ArticleWithCategory[] }[]> {
	const categoryParam = categories ? `categories=${categories.join(',')}` : '';
	const limitParam = `limit=${limit}`;
	const params = [categoryParam, limitParam].filter(Boolean).join('&');
	
	const response = await fetch(`${API_BASE}/articles/categories?${params}`);
	if (!response.ok) {
		throw new Error('Failed to fetch category articles');
	}
	return response.json();
}

export async function fetchUserReadingHistory(limit: number = 6): Promise<ReadHistory[]> {
	const response = await fetch(`${API_BASE}/user/reading-history?limit=${limit}`);
	if (!response.ok) {
		if (response.status === 401) {
			// User not authenticated, return empty array
			return [];
		}
		throw new Error('Failed to fetch reading history');
	}
	return response.json();
}
