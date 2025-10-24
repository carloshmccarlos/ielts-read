import * as fs from "node:fs";
import { prisma } from "@/lib/prisma";
import type { CategoryName } from "@prisma/client";

interface WordsData {
	categoryName: string;
	words: string[];
}

async function main() {
	console.log("Start seeding IELTS words ...");

	// Load words from JSON
	const wordsData: WordsData[] = JSON.parse(fs.readFileSync("prisma/static-data/words.json", "utf-8"));

	// Get all articles
	const articles = await prisma.article.findMany({
		include: {
			Category: true
		}
	});

	console.log(`Found ${articles.length} articles to update with IELTS words...`);

	for (const article of articles) {
		// Find words for this article's category
		const categoryWords = wordsData.find(
			(wordCategory) => wordCategory.categoryName === article.categoryName
		);

		if (categoryWords && categoryWords.words.length > 0) {
			// Take a random subset of words (20-50 words)
			const wordCount = Math.floor(Math.random() * 31) + 20; // Random between 20-50
			const shuffledWords = [...categoryWords.words].sort(() => 0.5 - Math.random());
			const selectedWords = shuffledWords.slice(0, Math.min(wordCount, categoryWords.words.length));

			// Update the article with IELTS words
			await prisma.article.update({
				where: { id: article.id },
				data: {
					ieltsWords: selectedWords,
					ieltsWordsCount: selectedWords.length,
					// Estimate article word count (rough calculation)
					articleWordsCount: article.content.split(/\s+/).length
				}
			});

			console.log(`Updated article "${article.title}" with ${selectedWords.length} IELTS words`);
		} else {
			console.log(`No words found for category: ${article.categoryName}`);
		}
	}

	console.log("IELTS words seeding finished.");
}

main()
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});