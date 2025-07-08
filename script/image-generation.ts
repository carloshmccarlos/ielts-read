import { imageGenerationPrompt } from "@/script/prompt";
import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";

export async function imageGeneration(
	description: string,
	imageName: string,
): Promise<Buffer | null> {
	const ai = new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY,
	});

	const prompt = imageGenerationPrompt.prompt;

	const contents = `${prompt} + The  description is ${description}`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash-preview-image-generation",
			contents: contents,
			config: {
				responseModalities: [Modality.TEXT, Modality.IMAGE],
				maxOutputTokens: 2048,
			},
		});

		if (
			!response.candidates ||
			response.candidates.length === 0 ||
			!response.candidates[0].content ||
			!response.candidates[0].content.parts
		) {
			console.error("Invalid response from image generation API.");
			return null;
		}

		for (const part of response.candidates[0].content.parts) {
			if (part.inlineData?.data) {
				const imageData = part.inlineData.data;
				const originalBuffer = Buffer.from(imageData, "base64");

				// Start with lower quality and resize to keep under 150KB
				let quality = 70;
				let buffer = await sharp(originalBuffer)
					.resize(800, 600, { fit: "inside", withoutEnlargement: true })
					.webp({ quality: quality })
					.toBuffer();

				// If the image is still too large, reduce quality and dimensions further
				while (buffer.length > 150 * 1024 && quality > 20) {
					quality -= 10;
					buffer = await sharp(originalBuffer)
						.resize(800, 600, { fit: "inside", withoutEnlargement: true })
						.webp({ quality: quality })
						.toBuffer();
				}

				// If still too large, reduce dimensions
				if (buffer.length > 150 * 1024) {
					buffer = await sharp(originalBuffer)
						.resize(640, 480, { fit: "inside", withoutEnlargement: true })
						.webp({ quality: quality })
						.toBuffer();
				}

				console.log(
					`Image generated successfully for ${imageName} (${buffer.length / 1024}KB)`,
				);
				return buffer;
			}
		}
	} catch (error) {
		console.error("Error during image generation:", error);
		return null;
	}

	return null;
}
