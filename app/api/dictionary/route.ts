import { NextRequest, NextResponse } from 'next/server';

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
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json(
      { error: 'Word parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Primary API: Lexicala RapidAPI
    const rapidApiKey = process.env.RAPIDAPI_KEY || "ca31371d4amsh56a1916f1705cbdp1780dcjsn05c1ef8330dd";
    
    try {
      const lexicalaResponse = await fetch(
        `https://lexicala1.p.rapidapi.com/search-definitions?text=${encodeURIComponent(word)}&language=en`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": rapidApiKey,
            "x-rapidapi-host": "lexicala1.p.rapidapi.com",
          },
        }
      );

      if (lexicalaResponse.ok) {
        const lexicalaData = await lexicalaResponse.json();
        
        if (lexicalaData.results && lexicalaData.results.length > 0) {
          const entry = lexicalaData.results[0];
          
          const result: DictionaryEntry = {
            word: entry.headword?.text || word,
            phonetic: entry.headword?.pronunciation?.value,
            audioUrl: entry.headword?.pronunciation?.audio?.[0]?.url,
            meanings: entry.senses?.slice(0, 3).map((sense: any) => ({
              partOfSpeech: sense.pos || 'unknown',
              definitions: [{
                definition: sense.definition || sense.translation?.text || 'No definition available',
                example: sense.examples?.[0]?.text
              }]
            })) || []
          };

          return NextResponse.json({
            success: true,
            data: result,
            provider: 'lexicala'
          });
        }
      }
    } catch (error) {
      console.warn('Lexicala API failed:', error);
    }

    // Fallback 1: Merriam-Webster API (if configured)
    if (process.env.MERRIAM_WEBSTER_API_KEY) {
      try {
        const response = await fetch(
          `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word.toLowerCase()}?key=${process.env.MERRIAM_WEBSTER_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.length > 0 && typeof data[0] === 'object' && data[0].meta) {
            const entry = data[0];
            
            const result: DictionaryEntry = {
              word: entry.meta.id.split(':')[0],
              phonetic: entry.hwi?.prs?.[0]?.mw || entry.hwi?.prs?.[0]?.ipa,
              audioUrl: entry.hwi?.prs?.[0]?.sound?.audio 
                ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${entry.hwi.prs[0].sound.audio.charAt(0)}/${entry.hwi.prs[0].sound.audio}.mp3`
                : undefined,
              meanings: entry.shortdef ? [{
                partOfSpeech: entry.fl || 'unknown',
                definitions: entry.shortdef.slice(0, 3).map((def: string) => ({
                  definition: def,
                }))
              }] : []
            };

            return NextResponse.json({
              success: true,
              data: result,
              provider: 'merriam-webster'
            });
          }
        }
      } catch (error) {
        console.warn('Merriam-Webster API failed:', error);
      }
    }

    // Fallback 2: Free Dictionary API
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );

    if (!response.ok) {
      // Try word variations
      const variations = [
        word.toLowerCase().replace(/s$/, ''),
        word.toLowerCase().replace(/ed$/, ''),
        word.toLowerCase().replace(/ing$/, ''),
      ];

      for (const variation of variations) {
        if (variation !== word.toLowerCase() && variation.length > 2) {
          const variationResponse = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${variation}`
          );
          if (variationResponse.ok) {
            const data = await variationResponse.json();
            return processFreeDictionaryData(data[0]);
          }
        }
      }

      return NextResponse.json(
        { 
          success: false, 
          error: `No definition found for "${word}"`,
          suggestions: variations.filter(v => v !== word.toLowerCase() && v.length > 2)
        },
        { status: 404 }
      );
    }

    const data = await response.json();
    return processFreeDictionaryData(data[0]);

  } catch (error) {
    console.error('Dictionary API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch definition. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

function processFreeDictionaryData(wordData: any) {
  const audioUrl = wordData.phonetics?.find((p: any) => p.audio)?.audio;

  const result: DictionaryEntry = {
    word: wordData.word,
    phonetic: wordData.phonetic || wordData.phonetics?.[0]?.text,
    audioUrl: audioUrl,
    meanings: wordData.meanings.slice(0, 3).map((meaning: any) => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.slice(0, 2).map((def: any) => ({
        definition: def.definition,
        example: def.example,
      })),
    })),
  };

  return NextResponse.json({
    success: true,
    data: result,
    provider: 'free-dictionary'
  });
}