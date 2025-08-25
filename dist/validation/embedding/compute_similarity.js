"use strict";
/* import { readFile, writeFile } from 'fs/promises';

interface EmbeddingResult {
  text: string;
  embedding: number[];
  tokenCount?: number;
  error?: string;
}

interface SimilarityResult {
  text1: string;
  text2: string;
  cosineSimilarity: number;
  interpretation: string;
}

function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function interpretSimilarity(score: number): string {
  if (score > 0.85) return "Nearly identical";
  if (score > 0.65) return "Very similar";
  if (score > 0.45) return "Somewhat related";
  if (score > 0.25) return "Weakly related";
  return "Unrelated";
}

async function calculateAdjacentSimilarity() {
  try {
    // 1. Load embeddings
    const { results } = JSON.parse(
      await readFile('./embeddings.json', 'utf-8')
    ) as { results: EmbeddingResult[] };

    const validResults = results.filter(r => r.embedding && !r.error);

    // 2. Calculate adjacent pairwise similarity
    const comparisons: SimilarityResult[] = [];

    for (let i = 0; i < validResults.length - 1; i++) {
      const current = validResults[i];
      const next = validResults[i + 1];

      const similarity = calculateCosineSimilarity(
        current.embedding,
        next.embedding
      );

      comparisons.push({
        text1: current.text.substring(0, 50),
        text2: next.text.substring(0, 50),
        cosineSimilarity: parseFloat(similarity.toFixed(4)),
        interpretation: interpretSimilarity(similarity)
      });
    }

    // 3. Save results
    await writeFile(
      './adjacent-similarity.json',
      JSON.stringify({ comparisons }, null, 2)
    );

    console.log(`Generated ${comparisons.length} adjacent comparisons`);
    console.log('Results saved to adjacent-similarity.json');

  } catch (error) {
    console.error('Similarity calculation failed:', error);
    process.exit(1);
  }
}

calculateAdjacentSimilarity(); */
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
/**
 * Calculates the cosine similarity between two vectors.
 * The score ranges from -1 (opposite direction) to 1 (same direction).
 * @param vecA The first vector.
 * @param vecB The second vector.
 * @returns The cosine similarity score.
 */
function calculateCosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }
    // Handle the case where one of the norms is zero to avoid division by zero
    if (normA === 0 || normB === 0) {
        return 0;
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
/**
 * Provides a human-readable interpretation of a cosine similarity score.
 * @param score The cosine similarity score.
 * @returns A string interpretation.
 */
function interpretSimilarity(score) {
    if (score > 0.85)
        return "Nearly identical";
    if (score > 0.65)
        return "Very similar";
    if (score > 0.45)
        return "Somewhat related";
    if (score > 0.25)
        return "Weakly related";
    return "Unrelated";
}
/**
 * Main function to read the embeddings, calculate pairwise similarity
 * for adjacent prompts, and save the results to a new JSON file.
 */
async function calculateAdjacentSimilarity() {
    try {
        // 1. Load embeddings from the file
        console.log("Loading embeddings from embeddings.json...");
        // The new format is a top-level array, so we parse it directly.
        const embeddings = JSON.parse(await (0, promises_1.readFile)('./embeddings.json', 'utf-8'));
        // Ensure we have valid embeddings to work with
        const validResults = embeddings.filter(r => r.embedding && !r.error);
        // 2. Calculate adjacent pairwise similarity
        console.log(`Calculating similarity for ${validResults.length} prompts...`);
        const comparisons = [];
        // Loop through the array to compare each prompt with the one that follows it
        for (let i = 0; i < validResults.length - 1; i++) {
            const current = validResults[i];
            const next = validResults[i + 1];
            // Ensure both prompts have a valid embedding
            if (!current.embedding || !next.embedding)
                continue;
            const similarity = calculateCosineSimilarity(current.embedding, next.embedding);
            comparisons.push({
                // Use the `prompt` property from the new format
                text1: current.prompt.substring(0, 50),
                text2: next.prompt.substring(0, 50),
                cosineSimilarity: parseFloat(similarity.toFixed(4)),
                interpretation: interpretSimilarity(similarity)
            });
        }
        // 3. Save results
        console.log("Saving results to adjacent-similarity.json...");
        await (0, promises_1.writeFile)('./adjacent-similarity.json', JSON.stringify({ comparisons }, null, 2));
        console.log(`Generated ${comparisons.length} adjacent comparisons`);
        console.log('Results saved to adjacent-similarity.json');
    }
    catch (error) {
        console.error('Similarity calculation failed:', error);
        process.exit(1);
    }
}
calculateAdjacentSimilarity();
