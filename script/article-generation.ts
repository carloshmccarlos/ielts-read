import { getArticleGenerationPrompt } from "@/script/prompt";
import { GoogleGenAI } from "@google/genai";
import type { CategoryName, IeltsWordsCount } from "@prisma/client";

// Initialize the API with your API key
const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function articleGeneration(
	categoryName: CategoryName,
	providedWords: string[],
	ieltsWordsCount: number,
) {
	const minArticleWordsCount = ieltsWordsCount * 20;
	const maxArticleWordsCount = ieltsWordsCount * 25;

	const prompt = getArticleGenerationPrompt(
		ieltsWordsCount,
		minArticleWordsCount,
		maxArticleWordsCount,
	);

	console.log(`Generating article for category: ${categoryName}`);
	const contents = `${prompt}, words: ${JSON.stringify(providedWords)}`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: contents,
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: "object",
					properties: {
						title: {
							type: "string",
							description: "The title of this article",
						},
						content: {
							type: "string",
							description:
								"Markdown Formatting of Article without title and description",
						},
						description: {
							type: "string",
							description:
								"A brief summary of the article within 50 words with plain text formatting.",
						},
						ieltsWordsCount: {
							type: "integer",
							description: "The number of IELTS vocabulary words selected",
						},
						words: {
							type: "array",
							items: { type: "string" },
							description: "An array of the IELTS vocabulary words selected",
						},
					},
					required: [
						"title",
						"content",
						"description",
						"ieltsWordsCount",
						"words",
					],
				},
			},
		});

		const { title, content, description, words } = JSON.parse(
			response.text || "",
		);

		const articleWordsCount = content.split(/\s+/).length;

		return {
			title,
			content,
			description,
			categoryName,
			ieltsWordsCount,
			articleWordsCount,
			ieltsWords: words,
		};
	} catch (error) {
		console.error(
			`Error creating article for category ${categoryName}:`,
			error,
		);
		return null;
	}
}
