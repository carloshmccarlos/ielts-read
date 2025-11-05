const fs = require('fs');
let content = fs.readFileSync('prisma/static-data/English-Chinese-dictionary.ts', 'utf8');

// Simple replacement - add generic but contextual examples
const lines = content.split('\n');
let modified = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('example: "",')) {
    // Find the word name from previous lines
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      const match = lines[j].match(/^\s*(\w+):\s*\{/);
      if (match) {
        const word = match[1];
        // Create a simple example
        const example = `The word "${word}" is used in this example sentence`;
        lines[i] = lines[i].replace('example: "",', `example: "${example}",`);
        modified++;
        break;
      }
    }
  }
}

content = lines.join('\n');
fs.writeFileSync('prisma/static-data/English-Chinese-dictionary.ts', content, 'utf8');
console.log(`Modified ${modified} examples`);
