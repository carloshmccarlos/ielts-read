import { type NextRequest, NextResponse } from "next/server";
import { words } from "@/prisma/static-data/English-Chinese-dictionary";

interface DictionaryEntry {
	word: string;
	phonetic?: string;
	audioUrl?: string;
	meanings: {
		partOfSpeech: string;
		definitions: {
			definition: string;
			example?: string;
		}[];
	}[];
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const word = searchParams.get("word");

	if (!word) {
		return NextResponse.json(
			{ error: "Word parameter is required" },
			{ status: 400 },
		);
	}

	try {
		// Primary: Use local Chinese dictionary
		const wordLower = word.toLowerCase();
		const dictionaryEntry = words[wordLower as keyof typeof words];

		if (dictionaryEntry) {
			const audioBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_AUDIO_URL;
			const audioUrl = audioBaseUrl ? `${audioBaseUrl}/${wordLower}.mp3` : undefined;

			const result: DictionaryEntry = {
				word: wordLower,
				audioUrl: audioUrl,
				meanings: [
					{
						partOfSpeech: dictionaryEntry.pos,
						definitions: [
							{
								definition: dictionaryEntry.meaning,
							},
						],
					},
				],
			};

			return NextResponse.json({
				success: true,
				data: result,
				provider: "local-chinese-dictionary",
			});
		}

		// If not found in local dictionary, return error
		return NextResponse.json(
			{
				success: false,
				error: `No definition found for "${word}"`,
			},
			{ status: 404 },
		);
	} catch (error) {
		console.error("Dictionary API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch definition. Please try again later.",
			},
			{ status: 500 },
		);
	}
}
