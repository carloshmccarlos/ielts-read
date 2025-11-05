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
	chineseMeaning?: string;
	chinesePos?: string;
	chineseExample?: string;
}

// Disable caching for this route to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const word = searchParams.get("word");

	if (!word) {
		return NextResponse.json(
			{ error: "Word parameter is required" },
			{ 
				status: 400,
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate',
				}
			},
		);
	}

	try {
		const wordLower = word.toLowerCase();
		
		// Get Chinese definition from local dictionary
		const chineseEntry = words[wordLower as keyof typeof words];
		
		// Try to fetch English definition from Free Dictionary API
		let englishMeanings: any[] = [];
		let phonetic: string | undefined;
		let audioUrl: string | undefined;
		
		try {
			const dictionaryResponse = await fetch(
				`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordLower)}`,
				{
					cache: 'no-store',
				}
			);

			if (dictionaryResponse.ok) {
				const dictionaryData = await dictionaryResponse.json();
				
				if (Array.isArray(dictionaryData) && dictionaryData.length > 0) {
					const entry = dictionaryData[0];
					
					// Get phonetic
					phonetic = entry.phonetic;
					
					// Get audio URL (prefer US pronunciation)
					if (entry.phonetics && Array.isArray(entry.phonetics)) {
						const phoneticWithAudio = entry.phonetics.find((p: any) => p.audio);
						audioUrl = phoneticWithAudio?.audio;
					}
					
					// Extract English meanings
					englishMeanings = entry.meanings?.map((meaning: any) => ({
						partOfSpeech: meaning.partOfSpeech || 'unknown',
						definitions: meaning.definitions?.slice(0, 3).map((def: any) => ({
							definition: def.definition,
							example: def.example,
						})) || [],
					})) || [];
				}
			}
		} catch (apiError) {
			console.warn("Free Dictionary API failed:", apiError);
		}

		// Fallback to Cloudflare R2 audio if no API audio
		if (!audioUrl) {
			const audioBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_AUDIO_URL;
			audioUrl = audioBaseUrl ? `${audioBaseUrl}/${wordLower}.mp3` : undefined;
		}

		// If we have either English or Chinese definition, return combined result
		if (englishMeanings.length > 0 || chineseEntry) {
			const result: DictionaryEntry = {
				word: wordLower,
				phonetic: phonetic,
				audioUrl: audioUrl,
				meanings: englishMeanings.length > 0 ? englishMeanings : [],
				chineseMeaning: chineseEntry?.meaning,
				chinesePos: chineseEntry?.pos,
				chineseExample: chineseEntry?.example,
			};

			return NextResponse.json(
				{
					success: true,
					data: result,
					provider: englishMeanings.length > 0 ? "combined" : "chinese-only",
				},
				{
					headers: {
						'Cache-Control': 'no-store, no-cache, must-revalidate',
						'Pragma': 'no-cache',
						'Expires': '0',
					}
				}
			);
		}

		// If not found in any dictionary, return error
		return NextResponse.json(
			{
				success: false,
				error: `No definition found for "${word}"`,
			},
			{ 
				status: 404,
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate',
				}
			},
		);
	} catch (error) {
		console.error("Dictionary API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch definition. Please try again later.",
			},
			{ 
				status: 500,
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate',
				}
			},
		);
	}
}
