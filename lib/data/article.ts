import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { deleteArticleImage } from "@/script/image-operation";
import type { CategoryName } from "@prisma/client";
import type { IeltsWordsCount } from "@prisma/client";
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
		where: {
			imageUrl: {
				gt: "",
			},
		},
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
	imageUrl?: string;
	content: string;
	description: string;
	categoryName: CategoryName;
	ieltsWordsCount: IeltsWordsCount;
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
		ieltsWordsCount: IeltsWordsCount;
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
