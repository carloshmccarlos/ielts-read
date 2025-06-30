import { prisma } from "@/lib/prisma";
import type { CategoryName } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

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
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const userId = session?.user?.id;

	return prisma.article.findMany({
		where: {
			categoryName: categoryName as CategoryName,
			...(userId ? {
				NOT: {
					MasteredArticle: {
						some: {
							userId: userId
						}
					}
				}
			} : {})
		},
		include: {
			Category: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		skip,
		take,
	});
}

export async function searchArticles(query: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const userId = session?.user?.id;

	return prisma.article.findMany({
		where: {
			OR: [
				{
					title: {
						contains: query,
						mode: "insensitive",
					},
				},
			],
			...(userId ? {
				NOT: {
					MasteredArticle: {
						some: {
							userId: userId
						}
					}
				}
			} : {})
		},
		include: {
			Category: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function getLatestArticles() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const userId = session?.user?.id;

	return prisma.article.findMany({
		take: 9,
		where: userId ? {
			NOT: {
				MasteredArticle: {
					some: {
						userId: userId
					}
				}
			}
		} : undefined,
		include: {
			Category: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function getHottestArticles() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const userId = session?.user?.id;

	return prisma.article.findMany({
		take: 7,
		where: userId ? {
			NOT: {
				MasteredArticle: {
					some: {
						userId: userId
					}
				}
			}
		} : undefined,
		include: {
			Category: true,
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

export async function getAllArticles() {
	return prisma.article.findMany({
		include: {
			Category: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function createArticle(articleData: {
	title: string;
	imageUrl: string;
	content: string;
	description: string;
	categoryName: string;
	wordsCount: number;
}) {
	const { title, imageUrl, content, description, categoryName, wordsCount } =
		articleData;
	return prisma.article.create({
		data: {
			title,
			imageUrl,
			content,
			description,
			wordsCount,
			categoryName: categoryName.replaceAll("-", "_") as CategoryName,
		},
		include: {
			Category: true,
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
	},
) {
	const { title, imageUrl, content, description, categoryName } = articleData;

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
		},
		include: {
			Category: true,
		},
	});
}

export async function deleteArticle(id: number) {
	const existingArticle = await prisma.article.findUnique({ where: { id } });

	if (!existingArticle) {
		return null;
	}

	return prisma.article.delete({
		where: { id },
	});
}

export async function deleteArticles(ids: number[]) {
	return prisma.article.deleteMany({
		where: {
			id: {
				in: ids,
			},
		},
	});
}
