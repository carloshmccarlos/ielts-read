"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Volume2, Book, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  ieltsWords: string[];
  ieltsWordsCount: number;
}

interface WordDefinition {
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

function IeltsWordsDisplay({ ieltsWords, ieltsWordsCount }: Props) {
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDefinition, setWordDefinition] = useState<WordDefinition | null>(
    null
  );
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [definitionError, setDefinitionError] = useState<string | null>(null);

  // Function to play pronunciation with multiple options
  const playPronunciation = async (word: string) => {
    setPlayingWord(word);
    
    try {
      // First try to use audio URL from dictionary API if available and word matches
      if (wordDefinition?.audioUrl && selectedWord === word && wordDefinition.word.toLowerCase() === word.toLowerCase()) {
        try {
          const audio = new Audio(wordDefinition.audioUrl);
          audio.onended = () => setPlayingWord(null);
          audio.onerror = () => {
            console.warn('Dictionary audio failed, falling back to speech synthesis');
            fallbackToSpeechSynthesis(word);
          };
          await audio.play();
          return;
        } catch (audioError) {
          console.warn('Audio playback failed:', audioError);
        }
      }
      
      // Fallback to Web Speech API
      fallbackToSpeechSynthesis(word);
    } catch (error) {
      setPlayingWord(null);
      console.error('Pronunciation failed:', error);
    }
  };

  // Helper function for speech synthesis fallback
  const fallbackToSpeechSynthesis = (word: string) => {
    if ("speechSynthesis" in window) {
      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        utterance.rate = 0.7; // Slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a better voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.onend = () => setPlayingWord(null);
        utterance.onerror = (event) => {
          setPlayingWord(null);
          console.error('Speech synthesis failed:', event.error);
        };
        
        speechSynthesis.speak(utterance);
      } catch (error) {
        setPlayingWord(null);
        console.error('Speech synthesis error:', error);
      }
    } else {
      setPlayingWord(null);
      console.error('Speech synthesis not supported');
    }
  };

  // Function to fetch word definition using improved API
  const fetchWordDefinition = async (word: string) => {
    setIsLoadingDefinition(true);
    setDefinitionError(null);

    try {
      const response = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch definition');
      }

      if (result.success && result.data) {
        setWordDefinition(result.data);
      } else {
        throw new Error(result.error || 'No definition available');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('not found')) {
        setDefinitionError(`No definition found for "${word}". Try checking the spelling or search online.`);
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setDefinitionError("Network error. Please check your internet connection and try again.");
      } else {
        setDefinitionError("Unable to load definition. Please try again later.");
      }
      
      console.error('Dictionary API error:', error);
    } finally {
      setIsLoadingDefinition(false);
    }
  };

  // Handle word click - show definition
  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    fetchWordDefinition(word);
  };

  // Close definition dialog
  const closeDefinitionDialog = () => {
    setSelectedWord(null);
    setWordDefinition(null);
    setDefinitionError(null);
    setIsLoadingDefinition(false);
  };

  if (!ieltsWords || ieltsWords.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <BookOpen className="w-5 h-5" />
          IELTS Vocabulary ({ieltsWordsCount} words)
        </CardTitle>
        <p className="text-sm text-blue-600">
          Learn these IELTS words from this article. Click on any word to see
          its definition and hear pronunciation.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ieltsWords.map((word, index) => (
            <div key={`${word}-${index}`} className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 text-sm"
                onClick={() => handleWordClick(word)}
              >
                <Book className="w-3 h-3 text-gray-500" />
                <span>{word}</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(word);
                }}
              >
                <Volume2
                  className={`w-3 h-3 ${
                    playingWord === word
                      ? "text-blue-600 animate-pulse"
                      : "text-gray-500"
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-600">
          💡 Tip: Click the book icon to see definitions, speaker icon for
          pronunciation. These words are commonly used in IELTS exams!
          {playingWord && (
            <div className="mt-2 text-blue-600 font-medium">
              🔊 Playing pronunciation for "{playingWord}"...
            </div>
          )}
        </div>
      </CardContent>

      {/* Word Definition Dialog */}
      <Dialog open={selectedWord !== null} onOpenChange={closeDefinitionDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              {selectedWord}
              {wordDefinition?.phonetic && (
                <span className="text-sm text-gray-500 font-normal">
                  {wordDefinition.phonetic}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={`ml-auto ${wordDefinition?.audioUrl ? 'text-green-600' : ''}`}
                onClick={() => selectedWord && playPronunciation(selectedWord)}
                title={wordDefinition?.audioUrl ? 'High-quality audio available' : 'Using text-to-speech'}
              >
                <Volume2 className="w-4 h-4" />
                {wordDefinition?.audioUrl && (
                  <span className="ml-1 text-xs">HD</span>
                )}
              </Button>
            </DialogTitle>
            <DialogDescription>Definition and usage examples</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {isLoadingDefinition && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading definition...</span>
              </div>
            )}

            {definitionError && (
              <div className="text-center py-8 text-gray-500">
                <p>{definitionError}</p>
                <p className="text-sm mt-2">
                  Try searching for this word in an online dictionary.
                </p>
              </div>
            )}

            {wordDefinition && (
              <div className="space-y-6">
                {wordDefinition.meanings.map((meaning, meaningIndex) => (
                  <div
                    key={meaningIndex}
                    className="border-l-4 border-blue-200 pl-4"
                  >
                    <h3 className="font-semibold text-blue-800 mb-2">
                      {meaning.partOfSpeech}
                    </h3>
                    <div className="space-y-3">
                      {meaning.definitions.map((def, defIndex) => (
                        <div key={defIndex} className="space-y-1">
                          <p className="text-gray-800">{def.definition}</p>
                          {def.example && (
                            <p className="text-sm text-gray-600 italic">
                              Example: "{def.example}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default IeltsWordsDisplay;