import fs from "node:fs";
import path from "node:path";
import {
	createArticle,
	deleteArticle,
	updateArticleImageUrl,
} from "@/lib/data/article";
import {
	getGenerationTurn,
	updateGenerationTurn,
} from "@/lib/data/get-generation-turn";
import type { CategoryName, IeltsWordsCount } from "@prisma/client";
import { articleGeneration } from "./article-generation";
import { imageGeneration } from "./image-generation";
import { uploadArticleImage } from "./image-operation";

const wordsData: { categoryName: CategoryName; words: string[] }[] = JSON.parse(
	fs.readFileSync(path.join("prisma/static-data/words.json"), "utf-8"),
);

type ArticleGenerationResult = {
	title: string;
	content: string;
	description: string;
	categoryName: CategoryName;
	ieltsWordsCount: IeltsWordsCount;
	articleWordsCount: number;
	ieltsWords: string[];
};

export async function cronCreateArticle() {
	try {
		const turn = await getGenerationTurn();
		if (!turn) {
			console.error("Failed to get generation turn.");
			return;
		}

		for (const category of wordsData) {
			const { categoryName, words } = category;

			let articleObject: ArticleGenerationResult | null | undefined;
			let articleAttempt = 1;
			while (true) {
				console.log(
					`Article generation attempt ${articleAttempt} for ${categoryName}.`,
				);
				articleObject = await articleGeneration(
					categoryName,
					words,
					turn.ieltsWordsCount,
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
				const imageGenerated = await imageGeneration(
					articleObject.description,
					imageName,
				);

				if (imageGenerated) {
					const fileName = `${imageName.toLowerCase().replace(/\s+/g, "-")}.webp`;
					const remotePath = `article/${fileName}`;
					imageUrl = await uploadArticleImage(fileName, remotePath);
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

			// Wait for 60 seconds before processing the next category
			await new Promise((resolve) => setTimeout(resolve, 60000));
		}
		await updateGenerationTurn(turn.ieltsWordsCount);
	} catch (error) {
		console.error("Error in cron job for creating article:", error);
	}
}
