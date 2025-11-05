const fs = require('fs');

let content = fs.readFileSync('prisma/static-data/English-Chinese-dictionary.ts', 'utf8');

const finalExamples = {
  attach: 'Attach the file to the email',
  belong: 'This book belongs to me',
  optics: 'Optics is the study of light',
  lens: 'The camera lens is broken',
  radar: 'Radar detects aircraft',
  echo: 'The echo bounced off the walls',
  network: 'The computer network is down',
  software: 'Install the software on your computer',
  keyboard: 'Type on the keyboard',
  screen: 'The screen is too bright',
  loudspeaker: 'The loudspeaker announced the news',
  cassette: 'Play the cassette tape',
  binary: 'Computers use binary code',
  ventilation: 'The ventilation system needs repair',
  simplify: 'Simplify the instructions',
  purify: 'Purify the water before drinking',
  filter: 'Filter the coffee',
  framework: 'The framework supports the structure',
  adjust: 'Adjust the settings',
  fault: 'It\'s not your fault',
  tradition: 'Tradition is important in our culture',
  moral: 'The story has a moral lesson',
  inhabitant: 'The inhabitants of the island are friendly',
  antique: 'This is an antique vase',
  ritual: 'The ritual is performed annually',
  hallowed: 'This is hallowed ground',
  Pope: 'The Pope leads the Catholic Church',
  priest: 'The priest conducted the service',
  church: 'We go to church on Sundays',
  monk: 'The monk lives in a monastery',
  empire: 'The Roman Empire was vast',
  dynasty: 'The Ming Dynasty ruled China',
  emperor: 'The emperor ruled the empire',
  king: 'The king wore a crown',
  majesty: 'Your Majesty, the king',
  lord: 'The lord owned the land',
  status: 'What is your marital status?',
  accident: 'There was a car accident',
  language: 'English is a global language',
  symbol: 'The dove is a symbol of peace',
  sign: 'Read the sign carefully',
  knot: 'Tie a knot in the rope',
  grammar: 'Grammar rules are important',
  dialect: 'He speaks a regional dialect',
  accent: 'She has a British accent',
  alphabet: 'The English alphabet has 26 letters',
  vocabulary: 'Expand your vocabulary by reading',
  idiom: 'That\'s an interesting idiom',
  clause: 'The contract has a penalty clause',
  expression: 'That\'s a common expression',
  abbreviation: 'Dr. is an abbreviation for Doctor',
  noun: 'A noun is a person, place, or thing',
  singular: 'Cat is the singular form',
  plural: 'Cats is the plural form',
  pronoun: 'He is a pronoun',
  verb: 'Run is a verb',
  adverb: 'Quickly is an adverb',
  preposition: 'On is a preposition',
  conjunction: 'And is a conjunction',
  compile: 'Compile the data into a report',
  version: 'This is the latest version',
  translate: 'Translate the text into Spanish',
};

let count = 0;
for (const [word, example] of Object.entries(finalExamples)) {
  const regex = new RegExp(`(${word}:\\s*\\{[^}]*example:\\s*)"",`, 'g');
  const newContent = content.replace(regex, `$1"${example}",`);
  if (newContent !== content) {
    content = newContent;
    count++;
  }
}

fs.writeFileSync('prisma/static-data/English-Chinese-dictionary.ts', content, 'utf8');
console.log(`Filled ${count} final examples`);

// Check remaining
const remaining = (content.match(/example:\s*"",/g) || []).length;
console.log(`Remaining empty examples: ${remaining}`);
