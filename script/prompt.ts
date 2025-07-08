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
		"Generate a photorealistic 4:3 .webp image from the provided description.\n" +
		"Requirements:\n" +
		"Style: Realistic, natural lighting, detailed textures.\n" +
		"Dimensions: Balanced resolution (e.g., 800x600 or 1024x768).\n",
};
