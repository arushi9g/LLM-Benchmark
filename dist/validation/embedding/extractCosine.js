"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
async function extractCosineSimilarities() {
    try {
        // 1. Load the similarity results
        const { comparisons } = JSON.parse(await (0, promises_1.readFile)('./adjacent-similarity.json', 'utf-8'));
        // 2. Extract just the cosine similarity values
        const cosineValues = comparisons.map((comp) => comp.cosineSimilarity);
        // 3. Format for easy copy-pasting
        const output = cosineValues.join('\n');
        // 4. Save to file
        await (0, promises_1.writeFile)('./cosine-values.txt', output);
        console.log('Cosine similarities saved to cosine-values.txt:');
        console.log('\n' + output);
    }
    catch (error) {
        console.error('Extraction failed:', error);
    }
}
extractCosineSimilarities();
