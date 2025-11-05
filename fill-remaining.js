const fs = require('fs');

let content = fs.readFileSync('prisma/static-data/English-Chinese-dictionary.ts', 'utf8');

// Find all words with empty examples
const pattern = /(\w+):\s*\{\s*pos:\s*"[^"]+",\s*meaning:\s*"[^"]+",\s*example:\s*""\s*,?\s*\}/g;
const matches = [...content.matchAll(pattern)];
const emptyWords = matches.map(m => m[1]);

console.log(`Found ${emptyWords.length} words with empty examples`);
console.log('First 50 words:', emptyWords.slice(0, 50).join(', '));

// Generic examples based on word patterns
const genericExamples = {
  // Math and science
  approximately: 'The distance is approximately 10 kilometers',
  graph: 'Draw a graph to show the data',
  rectangle: 'A rectangle has four sides',
  cube: 'A cube has six equal faces',
  angle: 'Measure the angle with a protractor',
  triangle: 'A triangle has three sides',
  dot: 'Put a dot on the map',
  width: 'The width of the table is 2 meters',
  length: 'The length of the room is 5 meters',
  percent: 'Twenty percent of students passed',
  proportion: 'The proportion of men to women is equal',
  rate: 'The interest rate is 5%',
  scale: 'Draw the map to scale',
  volt: 'The battery is 9 volts',
  radiate: 'Heat radiates from the fire',
  transparent: 'Glass is transparent',
  ozone: 'The ozone layer protects us',
  friction: 'Friction slows down movement',
  melt: 'Ice melts in warm weather',
  dissolve: 'Sugar dissolves in water',
  static: 'Static electricity can shock you',
  inert: 'Helium is an inert gas',
  formula: 'The formula for water is H2O',
  blend: 'Blend the ingredients together',
  
  // Academic
  doctrine: 'The doctrine was widely accepted',
  term: 'The school term begins in September',
  semester: 'The semester lasts four months',
  deadline: 'The deadline is next Friday',
  course: 'I am taking a history course',
  lesson: 'The lesson was very interesting',
  forum: 'The forum discussed important issues',
  syllabus: 'Read the syllabus carefully',
  system: 'The system works efficiently',
  surface: 'The surface is smooth',
  selective: 'The university is very selective',
  elective: 'Choose an elective course',
  preview: 'Preview the chapter before class',
  inspect: 'Inspect the goods carefully',
  skim: 'Skim through the article',
  presentation: 'Give a presentation to the class',
  plagiarise: 'Never plagiarise someone else\'s work',
  copy: 'Copy the notes from the board',
  thesis: 'She is writing her doctoral thesis',
  essay: 'Write an essay on this topic',
  paper: 'Submit your paper by Monday',
  point: 'That\'s a good point',
  cite: 'Cite your sources properly',
  elicit: 'The question elicited many responses',
  quote: 'Quote the author accurately',
  speculate: 'Scientists speculate about the cause',
  predict: 'Predict the outcome',
  recognise: 'I recognise that face',
  reckon: 'I reckon it will rain',
  imply: 'What do you imply by that?',
  deliberate: 'The decision was deliberate',
  insist: 'I insist that you come',
  analyse: 'Analyse the data carefully',
  conclude: 'We can conclude that it works',
  compare: 'Compare the two options',
  contrast: 'Contrast the differences',
  contradiction: 'There is a contradiction in your statement',
  diverse: 'The population is very diverse',
  nuance: 'Understand the nuance of the language',
  detail: 'Explain in detail',
  instance: 'For instance, consider this example',
  confirm: 'Confirm your reservation',
  demonstrate: 'Demonstrate how it works',
  illustrate: 'Illustrate your point with examples',
  prove: 'Prove your theory',
  decide: 'Decide what to do',
  survey: 'Conduct a survey',
  query: 'I have a query about this',
  questionnaire: 'Fill out the questionnaire',
  credit: 'Give credit where it\'s due',
  mark: 'Mark the correct answer',
  grant: 'The university granted him a degree',
  appreciate: 'I appreciate your help',
  underestimate: 'Don\'t underestimate the difficulty',
  overestimate: 'Don\'t overestimate your abilities',
  apply: 'Apply for the job',
  fellowship: 'He received a research fellowship',
  reward: 'Hard work brings rewards',
  award: 'She won an award',
  polytechnic: 'He studies at a polytechnic',
  breakthrough: 'Scientists made a breakthrough',
  disclose: 'Disclose all relevant information',
  reveal: 'Reveal the truth',
  expose: 'Expose the corruption',
  domain: 'This is not my domain of expertise',
  realm: 'In the realm of science',
  specialise: 'He specialises in cardiology',
  focus: 'Focus on your studies',
  utilise: 'Utilise all available resources',
  equipment: 'The equipment is expensive',
  instrument: 'Play a musical instrument',
  tool: 'Use the right tool for the job',
  gauge: 'Gauge the temperature',
  measure: 'Measure the distance',
  count: 'Count to ten',
  estimate: 'Estimate the cost',
};

// Apply all examples
let count = 0;
for (const [word, example] of Object.entries(genericExamples)) {
  const regex = new RegExp(`(${word}:\\s*\\{[^}]*example:\\s*)"",`, 'g');
  const newContent = content.replace(regex, `$1"${example}",`);
  if (newContent !== content) {
    content = newContent;
    count++;
  }
}

fs.writeFileSync('prisma/static-data/English-Chinese-dictionary.ts', content, 'utf8');
console.log(`Filled ${count} examples`);
