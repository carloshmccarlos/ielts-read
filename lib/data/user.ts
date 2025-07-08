"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import type { Article, Category, Role, User } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Define types for our data
export interface ArticleWithCategory extends Article {
	Category: Category | null;
}

export interface MarkedArticle {
	id: number;
	articleId: number;
	userId: string;
	article: ArticleWithCategory;
}

export interface ReadHistory {
	id: number;
	times: number;
	articleId: number;
	userId: string;
	article: ArticleWithCategory;
}

export interface MasteredArticle {
	id: number;
	articleId: number;
	userId: string;
	article: ArticleWithCategory;
}

export interface SessionUser {
	id: string;
	name?: string;
	email: string;
	image?: string | null;
}

export interface UserData {
	markedArticles: MarkedArticle[];
	readHistory: ReadHistory[];
	user: SessionUser;
}

export interface UserWithCounts extends User {
	_count: {
		MarkedArticles: number;
		ReadedTimeCount: number;
	};
}

export interface ProfileData {
	user: UserWithCounts;
	totalReadTimes: number;
	session: {
		user: SessionUser;
	};
}

export interface ApiProfileResponse {
	user: UserWithCounts;
	totalReadTimes: number;
	role?: Role;
}

/**
 * Get the current user session
 * @returns User session or redirects to login if not authenticated
 */
export async function getCurrentUser(): Promise<SessionUser> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return redirect("/auth/login");
	}

	return session.user;
}

/**
 * Get marked articles for the current user
 * @param userId User ID
 * @returns Array of marked articles with their categories
 */
export async function getUserMarkedArticles(userId: string) {
	return prisma.markedArticles.findMany({
		where: {
			userId: userId,
		},
		include: {
			article: {
				include: {
					Category: true,
				},
			},
		},
		orderBy: {
			article: {
				createdAt: "desc",
			},
		},
	});
}

/**
 * Get reading history for the current user
 * @param userId User ID
 * @returns Array of read articles with their categories and read count
 */
export async function getUserReadHistory(userId: string) {
	return prisma.readedTimeCount.findMany({
		where: {
			userId: userId,
		},
		include: {
			article: {
				include: {
					Category: true,
				},
			},
		},
		orderBy: {
			times: "desc",
		},
	});
}

/**
 * Get user profile with counts of marked articles and read history
 * @param userId User ID
 * @returns User with counts or null if not found
 */
export async function getUserProfile(
	userId: string,
): Promise<UserWithCounts | null> {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			_count: {
				select: {
					MarkedArticles: true,
					ReadedTimeCount: true,
				},
			},
		},
	}) as Promise<UserWithCounts | null>;
}

/**
 * Get total read times for a user
 * @param userId User ID
 * @returns Total number of read times
 */
export async function getUserTotalReadTimes(userId: string): Promise<number> {
	const readStats = await prisma.readedTimeCount.aggregate({
		where: {
			userId: userId,
		},
		_sum: {
			times: true,
		},
	});

	return readStats._sum.times || 0;
}

/**
 * Get paginated marked articles for the current user
 * @param userId User ID
 * @param page Page number
 * @param limit Number of items per page
 * @returns Paginated marked articles and total count
 */
export async function getPaginatedUserMarkedArticles(
	userId: string,
	page: number,
	limit: number,
) {
	const skip = (page - 1) * limit;
	const [articles, total] = await Promise.all([
		prisma.markedArticles.findMany({
			where: { userId },
			include: {
				article: {
					include: {
						Category: true,
					},
				},
			},
			orderBy: {
				article: {
					createdAt: "desc",
				},
			},
			skip,
			take: limit,
		}),
		prisma.markedArticles.count({ where: { userId } }),
	]);
	return { articles, total };
}

/**
 * Get paginated reading history for the current user
 * @param userId User ID
 * @param page Page number
 * @param limit Number of items per page
 * @returns Paginated reading history and total count
 */
export async function getPaginatedUserReadHistory(
	userId: string,
	page: number,
	limit: number,
) {
	const skip = (page - 1) * limit;
	const [history, total] = await Promise.all([
		prisma.readedTimeCount.findMany({
			where: { userId },
			include: {
				article: {
					include: {
						Category: true,
					},
				},
			},
			orderBy: {
				times: "desc",
			},
			skip,
			take: limit,
		}),
		prisma.readedTimeCount.count({ where: { userId } }),
	]);
	return { history, total };
}

/**
 * Get paginated mastered articles for the current user
 * @param userId User ID
 * @param page Page number
 * @param limit Number of items per page
 * @param category Optional category filter
 * @param query Optional query filter
 * @returns Paginated mastered articles and total count
 */
export async function getPaginatedUserMasteredArticles(
	userId: string,
	page: number,
	limit: number,
	category?: string,
	query?: string,
) {
	const skip = (page - 1) * limit;

	// Define base where condition
	// Need to use type assertion due to complex nested filters
	// biome-ignore lint/suspicious/noExplicitAny: Prisma filters require complex type handling
	const where: any = { userId };

	if (category) {
		where.article = {
			...(where.article || {}),
			Category: {
				name: category,
			},
		};
	}

	if (query) {
		where.article = {
			...(where.article || {}),
			title: {
				contains: query,
				mode: "insensitive",
			},
		};
	}

	const [articles, total] = await Promise.all([
		prisma.masteredArticle.findMany({
			where,
			include: {
				article: {
					include: {
						Category: true,
					},
				},
			},
			orderBy: {
				article: {
					createdAt: "desc",
				},
			},
			skip,
			take: limit,
		}),
		prisma.masteredArticle.count({ where }),
	]);
	return { articles, total };
}

/**
 * Get all user data including marked articles and reading history
 * @returns User data or redirects to login if not authenticated
 */
export async function getUserData(): Promise<UserData> {
	const user = await getCurrentUser();
	const userId = user.id;

	// Get marked articles and read history in parallel
	const [markedArticles, readHistory] = await Promise.all([
		getUserMarkedArticles(userId),
		getUserReadHistory(userId),
	]);

	return {
		markedArticles,
		readHistory,
		user,
	};
}

/**
 * Get user collections (marked articles and read history)
 * @param userId User ID
 * @returns Object with marked articles and read history
 */
export async function getUserCollections(userId: string) {
	const [markedArticles, readHistory] = await Promise.all([
		getUserMarkedArticles(userId),
		getUserReadHistory(userId),
	]);

	return {
		markedArticles,
		readHistory,
	};
}

/**
 * Get user profile data for API endpoint
 * @param userId User ID
 * @returns Profile data for the API response or null if user not found
 */
export async function getProfileData(
	userId: string,
): Promise<ApiProfileResponse | null> {
	try {
		// Get user profile and total read times in parallel
		const [user, totalReadTimes] = await Promise.all([
			getUserProfile(userId),
			getUserTotalReadTimes(userId),
		]);

		if (!user) {
			return null;
		}

		return {
			user,
			totalReadTimes,
			role: user.role,
		};
	} catch (error) {
		console.error("Error fetching profile data:", error);
		return null;
	}
}

/**
 * Update user profile name
 * @param userId User ID
 * @param name New name for the user
 * @returns Updated profile data for the API response or null if update fails
 */
export async function updateUserProfile(
	userId: string,
	name: string,
): Promise<ApiProfileResponse | null> {
	try {
		// Update user name
		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				name,
			},
			include: {
				_count: {
					select: {
						MarkedArticles: true,
						ReadedTimeCount: true,
					},
				},
			},
		});

		// Get total read times
		const totalReadTimes = await getUserTotalReadTimes(userId);

		return {
			user: updatedUser as UserWithCounts,
			totalReadTimes,
			role: updatedUser.role,
		};
	} catch (error) {
		console.error("Error updating profile data:", error);
		return null;
	}
}

export async function deleteUserByEmail(email: string) {
	return prisma.user.delete({
		where: {
			email: email,
		},
	});
}

export async function getUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: {
			email: email,
		},
	});
}

export async function getRoleByUserId(userId: string) {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			role: true,
		},
	});
}

export async function updateUserRoleByEmail({
	email,
	role,
}: { email: string; role: Role }) {
	return prisma.user.update({
		where: {
			email: email,
		},
		data: {
			role: role,
		},
	});
}

export async function addMasteredArticle(userId: string, articleId: number) {
	const existingMastered = await prisma.masteredArticle.findUnique({
		where: {
			userId_articleId: {
				userId,
				articleId,
			},
		},
	});

	if (existingMastered) {
		await prisma.masteredArticle.delete({
			where: {
				userId_articleId: {
					userId,
					articleId,
				},
			},
		});
		return { message: "Article unmastered successfully", mastered: false };
	}
	await prisma.masteredArticle.create({
		data: {
			userId,
			articleId,
		},
	});
	return { message: "Article mastered successfully", mastered: true };
}

export async function isArticleMastered(userId: string, articleId: number) {
	const masteredArticle = await prisma.masteredArticle.findUnique({
		where: {
			userId_articleId: {
				userId,
				articleId,
			},
		},
	});
	return !!masteredArticle;
}

export async function getNotices(userId: string) {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			markNotice: true,
			masterNotice: true,
			finishNotice: true,
		},
	});
}

export async function updateNotices(
	userId: string,
	notice: "masterNotice" | "markNotice" | "finishNotice",
) {
	return prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			[notice]: true,
		},
	});
}

/**
 * Get recently read articles by the user, excluding mastered articles
 * @param userId User ID
 * @param limit Maximum number of articles to return
 * @returns Array of recently read articles excluding mastered ones
 */
export async function getUserRecentlyReadArticles(userId: string, limit = 5) {
	// Get articles that have been read by the user
	const readArticles = await prisma.readedTimeCount.findMany({
		where: {
			userId: userId,
		},
		include: {
			article: {
				include: {
					Category: true,
				},
			},
		},
		orderBy: {
			times: "desc", // Order by read count
		},
	});

	// Get mastered articles by the user
	const masteredArticles = await prisma.masteredArticle.findMany({
		where: {
			userId: userId,
		},
		select: {
			articleId: true,
		},
	});

	const masteredArticleIds = new Set(masteredArticles.map(item => item.articleId));

	// Filter out mastered articles
	const filteredArticles = readArticles.filter(
		item => !masteredArticleIds.has(item.articleId)
	);

	// Return limited number of articles
	return filteredArticles.slice(0, limit);
}
