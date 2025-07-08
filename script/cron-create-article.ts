import { createArticle, updateArticleImageUrl } from "@/lib/data/article";

import { updateCategory } from "@/lib/data/category";
import { prisma } from "@/lib/prisma";
import wordsDataJson from "@/prisma/static-data/words.json";
import type { CategoryName } from "@prisma/client";
import { IeltsWordsCount as IeltsWordsCountEnum } from "@prisma/client";
import { articleGeneration } from "./article-generation";
import { imageGeneration } from "./image-generation";
import { uploadArticleImage } from "./image-operation";

const wordsData = wordsDataJson as {
	categoryName: CategoryName;
	words: string[];
}[];

type ArticleGenerationResult = {
	title: string;
	content: string;
	description: string;
	categoryName: CategoryName;
	ieltsWordsCount: number;
	articleWordsCount: number;
	ieltsWords: string[];
};

export async function cronCreateArticle() {
	try {
		// 1. Get the category with the least recent update time
		const categoryToUpdate = await prisma.category.findFirst({
			orderBy: {
				updatedAt: "asc",
			},
		});

		if (!categoryToUpdate) {
			console.error("No categories found.");
			return;
		}

		const { name: categoryName } = categoryToUpdate;

		// 2. Filter words for the selected category
		const categoryWordsData = wordsData.find(
			(data) => data.categoryName === categoryName,
		);

		if (!categoryWordsData) {
			console.error(`Words not found for category: ${categoryName}`);
			return;
		}
		const { words } = categoryWordsData;

		// 3. Use all of IeltsWordsCount
		const ieltsWordsCountValues = Object.values(IeltsWordsCountEnum);

		for (const ieltsWordsCountValue of ieltsWordsCountValues) {
			const ieltsWordsCount = Number.parseInt(
				ieltsWordsCountValue.split("_")[1],
				10,
			);

			let articleObject: ArticleGenerationResult | null | undefined;
			let articleAttempt = 1;
			while (true) {
				console.log(
					`Article generation attempt ${articleAttempt} for ${categoryName} with ielts word count ${ieltsWordsCount}.`,
				);
				articleObject = await articleGeneration(
					categoryName,
					words,
					ieltsWordsCount,
				);
				if (articleObject) {
					console.log(`Article generation for ${categoryName} succeed.`);
					break;
				}
				articleAttempt++;
				console.log(
					`Article generation failed for ${categoryName}. Retrying in 5 seconds...`,
				);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}

			// Create article in DB first
			const createdArticle = await createArticle(articleObject);
			if (!createdArticle) {
				console.error(
					`Failed to create article in DB for category ${categoryName}.`,
				);
				continue;
			}
			console.log(`Article ${createdArticle.id} created, generating image...`);

			let imageUrl: string | null = null;
			let imageAttempt = 1;
			const imageName = `${categoryName}-${createdArticle.id}`;
			while (true) {
				console.log(
					`Image generation/upload attempt ${imageAttempt} for article ${createdArticle.id}.`,
				);
				const imageBuffer = await imageGeneration(
					articleObject.description,
					imageName,
				);

				if (imageBuffer) {
					const fileName = `${imageName.toLowerCase().replace(/\s+/g, "-")}.webp`;
					const remotePath = `article/${fileName}`;
					imageUrl = await uploadArticleImage(
						imageBuffer,
						fileName,
						remotePath,
					);
				}

				if (imageUrl) {
					console.log(
						`Image generation/upload for article ${createdArticle.id} succeed.`,
					);
					break;
				}
				imageAttempt++;
				console.log(
					`Image generation/upload failed for article ${createdArticle.id}. Retrying in 5 seconds...`,
				);
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}

			await updateArticleImageUrl(createdArticle.id, imageUrl);
			console.log(
				`Article ${createdArticle.id} updated successfully with image ${imageUrl}`,
			);

			await new Promise((resolve) => setTimeout(resolve, 10000));
		}

		// 4. Update the category's updatedAt timestamp
		await updateCategory(categoryName);
		console.log(`Category ${categoryName} timestamp updated.`);
	} catch (error) {
		console.error("Error in cron job for creating article:", error);
	}
}
