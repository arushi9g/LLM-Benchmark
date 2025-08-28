"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");

function calculateCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

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

async function calculateAdjacentSimilarity() {
  try {
    const embeddings = JSON.parse(await (0, promises_1.readFile)('./embeddings.json', 'utf-8'));
    const validResults = embeddings.filter(r => r.embedding && !r.error);
    const comparisons = [];

    for (let i = 0; i < validResults.length - 1; i++) {
      const current = validResults[i];
      const next = validResults[i + 1];
      if (!current.embedding || !next.embedding)
        continue;
      const similarity = calculateCosineSimilarity(current.embedding, next.embedding);
      comparisons.push({
        text1: current.prompt.substring(0, 50),
        text2: next.prompt.substring(0, 50),
        cosineSimilarity: parseFloat(similarity.toFixed(4)),
        interpretation: interpretSimilarity(similarity)
      });
    }

    await (0, promises_1.writeFile)('./adjacent-similarity.json', JSON.stringify({ comparisons }, null, 2));
    console.log('Results saved to adjacent-similarity.json');
  }
  catch (error) {
    console.error('Similarity calculation failed:', error);
    process.exit(1);
  }
}
calculateAdjacentSimilarity();


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
    const { results } = JSON.parse(
      await readFile('./embeddings.json', 'utf-8')
    ) as { results: EmbeddingResult[] };

    const validResults = results.filter(r => r.embedding && !r.error);

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

    await writeFile(
      './adjacent-similarity.json',
      JSON.stringify({ comparisons }, null, 2)
    );
    console.log('Results saved to adjacent-similarity.json');

  } catch (error) {
    console.error('Similarity calculation failed:', error);
    process.exit(1);
  }
}

calculateAdjacentSimilarity(); */