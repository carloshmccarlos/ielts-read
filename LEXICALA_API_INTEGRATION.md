# Lexicala Dictionary API Integration

This document explains the integration of the Lexicala RapidAPI for enhanced dictionary functionality.

## What Changed

### Dictionary API Hierarchy:
1. **Lexicala RapidAPI** (Primary) - Comprehensive dictionary with audio
2. **Merriam-Webster** (Fallback) - If Lexicala fails
3. **Free Dictionary API** (Final fallback) - Always available

## Lexicala API Benefits

### Features:
- **Comprehensive definitions** with multiple meanings
- **Pronunciation guides** with phonetic notation
- **Audio pronunciation** files when available
- **Part of speech** classification
- **Example sentences** for context
- **Multiple languages** support (currently using English)

### API Details:
- **Endpoint**: `https://lexicala1.p.rapidapi.com/search-definitions`
- **Method**: GET
- **Parameters**: 
  - `text`: The word to look up
  - `language`: Language code (using "en" for English)

## Implementation

### API Route: `/api/dictionary`
```typescript
GET /api/dictionary?word=hello

Response:
{
  "success": true,
  "data": {
    "word": "hello",
    "phonetic": "/həˈloʊ/",
    "audioUrl": "https://...",
    "meanings": [
      {
        "partOfSpeech": "interjection",
        "definitions": [
          {
            "definition": "used as a greeting or to begin a phone conversation",
            "example": "hello there, Katie!"
          }
        ]
      }
    ]
  },
  "provider": "lexicala"
}
```

### Error Handling:
- Graceful fallback to other APIs if Lexicala fails
- Word variation attempts (removing suffixes like -s, -ed, -ing)
- Clear error messages for users

## Configuration

### Environment Variables:
```bash
# Primary API (already configured with provided key)
RAPIDAPI_KEY="ca31371d4amsh56a1916f1705cbdp1780dcjsn05c1ef8330dd"

# Fallback APIs (optional)
MERRIAM_WEBSTER_API_KEY="your-merriam-webster-key"
```

### Usage in Components:
The `IeltsWordsDisplay` component automatically uses the new API:
- Fetches definitions from `/api/dictionary`
- Displays enhanced pronunciation and definitions
- Plays audio when available

## Testing

Use the `LexicalaTestDemo` component to test the API:
```tsx
import LexicalaTestDemo from '@/components/LexicalaTestDemo';

// In your page or component
<LexicalaTestDemo />
```

This will test multiple words and show:
- API response success/failure
- Provider used (lexicala, merriam-webster, free-dictionary)
- Definition quality
- Audio availability

## Cost and Limits

### RapidAPI Lexicala:
- **Free tier**: 500 requests/month
- **Basic plan**: $10/month for 10,000 requests
- **Pro plan**: $25/month for 100,000 requests

### Fallback Strategy:
- If Lexicala quota is exceeded, falls back to free APIs
- No service interruption for users
- Maintains functionality even without paid subscriptions

## Benefits Over Previous Setup

1. **Better Definitions**: More comprehensive and accurate
2. **Audio Quality**: Professional pronunciation recordings
3. **Reliability**: Multiple fallback options
4. **Performance**: Faster response times
5. **Consistency**: Standardized data format across providers

## Future Enhancements

1. **Caching**: Implement Redis/database caching for frequently looked up words
2. **Batch Requests**: Look up multiple words in single API call
3. **Language Support**: Add support for other languages
4. **Offline Mode**: Cache common IELTS words for offline use
5. **Analytics**: Track most looked up words for content optimization