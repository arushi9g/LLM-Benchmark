"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
async function extractCosineSimilarities() {
    try {
        const { comparisons } = JSON.parse(await (0, promises_1.readFile)('./adjacent-similarity.json', 'utf-8'));
        const cosineValues = comparisons.map((comp) => comp.cosineSimilarity);
        const output = cosineValues.join('\n');
        await (0, promises_1.writeFile)('./cosine-values.txt', output);
        console.log('Cosine similarities saved to cosine-values.txt:');
    }
    catch (error) {
        console.error('Extraction failed:', error);
    }
}
extractCosineSimilarities();
