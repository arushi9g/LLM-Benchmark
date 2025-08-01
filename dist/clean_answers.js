"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// Read and parse the JSON file
const data = JSON.parse(fs_1.default.readFileSync('answers.json', 'utf-8'));
// Extract all generation texts and clean them
let generations = data.map(item => {
    // Clean the generation text by:
    // 1. Removing "Answer:" or similar prefixes
    // 2. Removing quotation marks
    // 3. Trimming whitespace
    let generation = item.response.generation
        .replace(/^(Answer:|by the AI\n|"\s*|\s*"$)/g, '')
        .trim();
    return generation;
});
// Ensure we have exactly 50 lines (pad with empty strings if needed)
if (generations.length > 50) {
    generations = generations.slice(0, 50);
}
else if (generations.length < 50) {
    generations = generations.concat(new Array(50 - generations.length).fill(''));
}
// Write to the output file
fs_1.default.writeFileSync('generations.txt', generations.join('\n'));
console.log(`Successfully wrote ${generations.length} clean generations to generations.txt`);
