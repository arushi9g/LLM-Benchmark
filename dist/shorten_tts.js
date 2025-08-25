"use strict";
/* import { readFile, writeFile } from 'fs/promises';

async function extractEmbeddingSnippets() {
    try {
        // 1. Load the embeddings file
        const { results } = JSON.parse(
            await readFile('./embeddings.json', 'utf-8')
        ) as { results: { embedding: number[] }[] };

        // 2. Extract first 4 values from each embedding
        const snippets = results.map(item => {
            const firstThree = item.embedding.slice(0, 3);
            return `[${firstThree.join(', ')}...]`;
        });

        // 3. Save as text file (one per line)
        await writeFile('./embedding-snippets.txt', snippets.join('\n'));

        console.log(`Saved ${snippets.length} embedding snippets to embedding-snippets.txt`);
        console.log('Sample output:');
        console.log(snippets.slice(0, 5).join('\n'));

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
    }
}

extractEmbeddingSnippets(); */
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
/**
 * Reads the embeddings from a JSON file, extracts the first few values
 * from each embedding vector, and saves them to a text file.
 */
async function extractEmbeddingSnippets() {
    try {
        // 1. Load the embeddings file
        console.log("Loading embeddings from embeddings.json...");
        // The new format is a top-level array, so we parse it directly.
        const embeddings = JSON.parse(await (0, promises_1.readFile)('./embeddings.json', 'utf-8'));
        // 2. Extract first 3 values from each embedding and format them
        console.log("Extracting embedding snippets...");
        const snippets = embeddings.map(item => {
            const firstThree = item.embedding.slice(0, 3);
            return `[${firstThree.join(', ')}...]`;
        });
        // 3. Save as text file (one per line)
        console.log("Saving snippets to embedding-snippets.txt...");
        await (0, promises_1.writeFile)('./embedding-snippets.txt', snippets.join('\n'));
        console.log(`Saved ${snippets.length} embedding snippets to embedding-snippets.txt`);
        console.log('Sample output:');
        console.log(snippets.slice(0, 5).join('\n'));
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
    }
}
extractEmbeddingSnippets();
