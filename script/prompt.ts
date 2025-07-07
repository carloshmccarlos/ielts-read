import type { IeltsWordsCount } from "@prisma/client";

export function getArticleGenerationPrompt(
	ieltsWordsCount: number,
	minArticleWordsCount: number,
	maxArticleWordsCount: number,
) {
	return `You are an IELTS reading passage generator. Follow the instructions below strictly and sequentially to produce a high-quality, exam-style reading article suitable for IELTS preparation.

Step 1: Vocabulary Selection
From the list of vocabulary words I provide, randomly select ${ieltsWordsCount} words.

You must use all ${ieltsWordsCount} words (in any form — plural, tense, adjective/adverb variations, etc.) in the article.

Additionally, you may select some context-relevant academic words, bringing the total to about ${ieltsWordsCount} vocabulary items.

Each vocabulary word must appear at least once in the article.

In the final article, highlight all ${ieltsWordsCount} vocabulary words by wrapping them in double asterisks like this: **example**.

Step 2: Article Generation
Generate one cohesive, well-structured article that sounds like a passage from the IELTS Reading section.

Use a formal, academic tone appropriate for IELTS.

Acceptable topics: science, history, technology, the environment, society, or culture.

Do not use dialogue, informal tone, or bullet points.

Do not include a title.

Ensure that the use of vocabulary words is natural, accurate, and contextually appropriate.

Step 3: Word Count Verification
The article must be between ${minArticleWordsCount} and ${maxArticleWordsCount} words.

After writing, automatically count and verify the total word count.

If the article is below ${minArticleWordsCount} words, you must revise or expand it until it meets the minimum.

Step 4: Markdown Formatting
Format the article using standard Markdown.

Rules:

Separate each paragraph with one blank line.

Use no headings, bold titles, or italicized text, except for the highlighted vocabulary words, which should appear as **word**.

Avoid lists, bullets, or non-paragraph structures.

The result must be plain-text paragraphs, readable and clean in any Markdown viewer.

Step 5: Final Review and Output
Before outputting the article:

Verify that all ${ieltsWordsCount} vocabulary words are included and highlighted with double asterisks.

Confirm that the article contains ${minArticleWordsCount} to ${maxArticleWordsCount} words.

Ensure Markdown formatting is clean and consistent, with proper paragraph spacing and no structural issues.

Ensure the description is plain text, not Markdown formatting.

Output only the final Markdown-formatted article with highlighted vocabulary words — no titles, vocabulary lists, or explanatory text.`;
}

export const imageGenerationPrompt = {
	prompt:
		"You are a realistic image generator. Based on the article I provide, generate a photo-realistic image that accurately reflects the main setting, elements, and atmosphere described in the text.\n" +
		"\n" +
		"Requirements:\n" +
		"Style: Realistic with natural lighting and detailed textures\n" +
		"\n" +
		"Aspect Ratio: 4:3 (standard web-friendly proportions)\n" +
		"\n" +
		"Format: .webp (lossy, web-optimized image format)\n" +
		"\n" +
		"Maximum File Size: Strictly under 200KB — ensure compression settings are optimized for this constraint\n" +
		"\n" +
		"Image Dimensions: Keep resolution balanced (e.g., 800×600 or 1024×768) to maintain visual quality while controlling size\n" +
		"\n" +
		"No text overlays, watermarks, or artistic abstractions\n" +
		"\n" +
		"Focus on faithful visual storytelling, recreating the main scene, concept, or environment from the article accurately\n" +
		"\n" +
		"The final image must be suitable as a lightweight, visually engaging image for use in webpages or reading apps\n" +
		"\n" +
		"Export Instructions:\n" +
		"Use efficient compression to ensure the final .webp image file is under 200KB\n" +
		"\n" +
		"Prioritize detail in key focal areas while minimizing background complexity if necessary to reduce file size",
};
