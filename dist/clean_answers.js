"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const data = JSON.parse(fs_1.default.readFileSync('answers.json', 'utf-8'));

let generations = data.map(item => {

    let generation = item.response.generation
        .replace(/^(Answer:|by the AI\n|"\s*|\s*"$)/g, '')
        .trim();
    return generation;
});

if (generations.length > 50) {
    generations = generations.slice(0, 50);
}
else if (generations.length < 50) {
    generations = generations.concat(new Array(50 - generations.length).fill(''));
}

fs_1.default.writeFileSync('generations.txt', generations.join('\n'));
console.log(`Successfully wrote ${generations.length} clean generations to generations.txt`);
