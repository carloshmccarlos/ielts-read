import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { deleteArticleImage } from "@/script/image-operation";
import type { CategoryName } from "@prisma/client";
import { ArticleWithDetails } from "../types";

export async function getArticleById(id: number) {
	return prisma.article.findUnique({
		where: { id: id },
		include: {
			Category: true,
		},
	});
}

export async function getArticlesByCategory(
	categoryName: string,
	skip = 0,
	take = 16,
	userId?: string,
): Promise<ArticleWithDetails[]> {
	return prisma.article.findMany({
		where: {
			categoryName: categoryName as CategoryName,
			imageUrl: {
				gt: "",
			},
			...(userId
				? {
						NOT: {
							MasteredArticle: {
								some: {
									userId: userId,
								},
							},
						},
				  }
				: {}),
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		skip,
		take,
	});
}

export async function getLatestArticles(userId?: string): Promise<ArticleWithDetails[]> {
	console.log("[getLatestArticles] Fetching with userId:", userId);
	try {
		const articles = await prisma.article.findMany({
			take: 18,
			where: {
				imageUrl: {
					gt: "",
				},
				...(userId
					? {
							NOT: {
								MasteredArticle: {
									some: {
										userId: userId,
									},
								},
							},
					  }
					: {}),
			},
			include: {
				Category: true,
				_count: {
					select: {
						MarkedArticles: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		console.log(`[getLatestArticles] Found ${articles.length} articles.`);
		return articles;
	} catch (error) {
		console.error("[getLatestArticles] Error fetching articles:", error);
		return []; // Return empty array on error
	}
}

export async function getHottestArticles(userId?: string): Promise<ArticleWithDetails[]> {
	return prisma.article.findMany({
		take: 7,
		where: {
			imageUrl: {
				gt: "",
			},
			...(userId
				? {
						NOT: {
							MasteredArticle: {
								some: {
									userId: userId,
								},
							},
						},
				  }
				: {}),
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
		orderBy: {
			readTimes: "desc",
		},
	});
}

export async function increaseReadTimes(articleId: number) {
	return prisma.article.update({
		where: { id: articleId },
		data: {
			readTimes: {
				increment: 1,
			},
		},
	});
}

export async function countArticlesByCategory(categoryName: string) {
	return prisma.article.count({
		where: {
			categoryName: categoryName as CategoryName,
		},
	});
}

export async function getAllArticles(userId?: string): Promise<ArticleWithDetails[]> {
	return prisma.article.findMany({
		where: {
			imageUrl: {
				gt: "",
			},
			...(userId
				? {
						NOT: {
							MasteredArticle: {
								some: {
									userId: userId,
								},
							},
						},
				  }
				: {}),
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

// Get featured articles (most marked articles)
export async function getFeaturedArticles(limit = 20, userId?: string): Promise<ArticleWithDetails[]> {
	return prisma.article.findMany({
		where: {
			imageUrl: {
				gt: "",
			},
			...(userId
				? {
						NOT: {
							MasteredArticle: {
								some: {
									userId: userId,
								},
							},
						},
				  }
				: {}),
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
		orderBy: {
			MarkedArticles: {
				_count: "desc",
			},
		},
		take: limit,
	});
}

// Get articles by multiple categories for showcase
export async function getArticlesByCategories(
	categories: CategoryName[],
	articlesPerCategory = 6,
	userId?: string,
): Promise<{ categoryName: CategoryName; articles: ArticleWithDetails[] }[]> {
	const results = await Promise.all(
		categories.map(async (categoryName) => {
			const articles = await prisma.article.findMany({
				where: {
					categoryName,
					imageUrl: {
						gt: "",
					},
					...(userId
						? {
								NOT: {
									MasteredArticle: {
										some: {
											userId: userId,
										},
									},
								},
						  }
						: {}),
				},
				include: {
					Category: true,
					_count: {
						select: {
							MarkedArticles: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
				take: articlesPerCategory,
			});

			return {
				categoryName,
				articles,
			};
		}),
	);

	return results.filter((result) => result.articles.length > 0);
}

// Get latest articles from each category
export async function getLatestArticlesFromEachCategory(userId?: string): Promise<(ArticleWithDetails | null)[]> {
	// Get all categories
	const categories = await prisma.category.findMany();

	// Get latest article from each category
	const latestArticles = await Promise.all(
		categories.map(async (category) => {
			return prisma.article.findFirst({
				where: {
					categoryName: category.name,
					imageUrl: {
						gt: "",
					},
					...(userId
						? {
								NOT: {
									MasteredArticle: {
										some: {
											userId: userId,
										},
									},
								},
						  }
						: {}),
				},
				include: {
					Category: true,
					_count: {
						select: {
							MarkedArticles: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}),
	);

	// Filter out null results and return
	return latestArticles;
}

// Get more hottest articles
export async function getMoreHottestArticles(limit = 30, userId?: string): Promise<ArticleWithDetails[]> {
	return prisma.article.findMany({
		where: {
			imageUrl: {
				gt: "",
			},
			...(userId
				? {
						NOT: {
							MasteredArticle: {
								some: {
									userId: userId,
								},
							},
						},
				  }
				: {}),
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
		orderBy: {
			readTimes: "desc",
		},
		take: limit,
	});
}

export async function createArticle(articleData: {
	title: string;
	imageUrl?: string;
	content: string;
	description: string;
	categoryName: CategoryName;
	ieltsWordsCount: number;
	articleWordsCount: number;
	ieltsWords?: string[];
}) {
	const {
		title,
		imageUrl,
		content,
		description,
		categoryName,
		ieltsWordsCount,
		articleWordsCount,
		ieltsWords,
	} = articleData;
	return prisma.article.create({
		data: {
			title,
			imageUrl: imageUrl ?? "",
			content,
			description,
			ieltsWordsCount,
			articleWordsCount,
			categoryName,
			ieltsWords,
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
	});
}

export async function updateArticle(
	id: number,
	articleData: {
		title: string;
		imageUrl: string;
		content: string;
		description: string;
		categoryName: string;
		ieltsWordsCount: number;
		articleWordsCount: number;
		ieltsWords?: string[];
	},
) {
	const {
		title,
		imageUrl,
		content,
		description,
		categoryName,
		ieltsWordsCount,
		articleWordsCount,
		ieltsWords,
	} = articleData;

	const existingArticle = await prisma.article.findUnique({ where: { id } });

	if (!existingArticle) {
		return null;
	}

	return prisma.article.update({
		where: { id },
		data: {
			title,
			imageUrl,
			content,
			description,
			categoryName: categoryName as CategoryName,
			ieltsWordsCount,
			articleWordsCount,
			ieltsWords,
		},
		include: {
			Category: true,
			_count: {
				select: {
					MarkedArticles: true,
				},
			},
		},
	});
}

export async function deleteArticle(id: number) {
	const existingArticle = await prisma.article.findUnique({ where: { id } });

	if (!existingArticle) {
		return null;
	}

	const imageName = `${existingArticle.categoryName}-${id}`;

	const deleteImageResult = await deleteArticleImage(imageName);

	if (!deleteImageResult) {
		throw new Error("Delete image fail.");
	}

	return prisma.article.delete({
		where: { id },
	});
}

export async function deleteArticles(ids: number[]) {
	// Concurrently delete all images associated with the articles.
	const imageDeletionResults = await Promise.allSettled(
		ids.map(async (id) => {
			const existingArticle = await prisma.article.findUnique({
				where: { id },
			});

			if (!existingArticle) {
				return null;
			}

			const imageName = `${existingArticle.categoryName}-${id}`;

			await deleteArticleImage(imageName);
		}),
	);

	imageDeletionResults.forEach((result, index) => {
		if (result.status === "rejected") {
			console.error(
				`Error deleting image for article ${ids[index]}:`,
				result.reason,
			);
		} else if (result.status === "fulfilled" && !result.value) {
			console.error(`Failed to delete image for article ${ids[index]}.`);
		}
	});

	// Delete all the articles from the database in a single transaction.
	return prisma.article.deleteMany({
		where: {
			id: {
				in: ids,
			},
		},
	});
}

export async function updateArticleImageUrl(id: number, imageUrl: string) {
	return prisma.article.update({
		where: { id: id },
		data: { imageUrl: imageUrl },
	});
}
