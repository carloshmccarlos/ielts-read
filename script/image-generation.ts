import * as fs from "node:fs";
import path from "node:path";
import { imageGenerationPrompt } from "@/script/prompt";
import { GoogleGenAI, Modality } from "@google/genai";

export async function imageGeneration(
	description: string,
	imageName: string,
): Promise<boolean> {
	const ai = new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY,
	});

	const prompt = imageGenerationPrompt.prompt;

	const contents = `${prompt} + The article description is ${description}`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash-preview-image-generation",
			contents: contents,
			config: {
				responseModalities: [Modality.TEXT, Modality.IMAGE],
			},
		});

		if (
			!response.candidates ||
			response.candidates.length === 0 ||
			!response.candidates[0].content ||
			!response.candidates[0].content.parts
		) {
			console.error("Invalid response from image generation API.");
			return false;
		}

		for (const part of response.candidates[0].content.parts) {
			if (part.inlineData?.data) {
				const imageData = part.inlineData.data;
				const buffer = Buffer.from(imageData, "base64");
				// Create a sanitized file name from the article title
				const fileName = `${imageName.toLowerCase().replace(/\s+/g, "-")}.webp`;
				const imagePath = path.join(
					process.cwd(),
					"public",
					"content-image",
					fileName,
				);
				fs.writeFileSync(imagePath, buffer);
				console.log(`Image saved as ${imagePath}`);
				return true;
			}
		}
	} catch (error) {
		console.error("Error during image generation:", error);
		return false;
	}

	return false;
}
