import { promises as fs } from 'fs';
import { kmeans } from 'ml-kmeans';


interface EmbeddingResult {
  text: string;
  embedding: number[];
}

interface EmbeddingsFile {
  modelUsed: string;
  totalTexts: number;
  successful: number;
  results: EmbeddingResult[];
}


async function runClustering() {
  const filePath = './embeddings.json';
  const numberOfClusters = 10;

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: EmbeddingsFile = JSON.parse(fileContent);

    if (!data.results || data.results.length === 0) {
      console.error('Error: No results found.');
      return;
    }

    const embeddings = data.results.map(result => result.embedding);

    const ans = kmeans(embeddings, numberOfClusters, {
      initialization: 'kmeans++',
    });
    console.log('Clustering complete.');

    const clusters: { text: string }[][] = Array.from({ length: numberOfClusters }, () => []);

    for (let i = 0; i < ans.clusters.length; i++) {
      const clusterIndex = ans.clusters[i];
      const originalText = data.results[i].text;
      clusters[clusterIndex].push({ text: originalText });
    }

    clusters.forEach((cluster, index) => {
      console.log(`\nCluster ${index + 1} (${cluster.length} items)`);
      cluster.forEach(item => {
        console.log(`- "${item.text}"`);
      });
    });

  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
      } else {
        console.error('An error occurred:', error.message);
      }
    } else {
      console.error('An error occurred:', error);
    }
  }
}

runClustering();


/*
import { promises as fs } from 'fs';
import { kmeans } from 'ml-kmeans';

interface EmbeddingResult {
  prompt: string;
  embedding: number[];
}

async function runClustering() {
  const filePath = './embeddings.json';
  const numberOfClusters = 10;

  try {
    const embeddingsData = JSON.parse(
      await fs.readFile(filePath, 'utf-8')
    ) as EmbeddingResult[];

    if (!embeddingsData || embeddingsData.length === 0) {
      console.error('Error: No results found.');
      return;
    }

    const embeddings = embeddingsData.map(item => item.embedding);
    const ans = kmeans(embeddings, numberOfClusters, {
      initialization: 'kmeans++',
    });
    console.log('Clustering complete.');

    const clusters: { prompt: string }[][] = Array.from({ length: numberOfClusters }, () => []);

    for (let i = 0; i < ans.clusters.length; i++) {
      const clusterIndex = ans.clusters[i];
      const originalPrompt = embeddingsData[i].prompt;
      clusters[clusterIndex].push({ prompt: originalPrompt });
    }

    clusters.forEach((cluster, index) => {
      console.log(`\nCluster ${index + 1} (${cluster.length} items)`);
      cluster.forEach(item => {
        console.log(`- "${item.prompt}"`);
      });
    });

  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
      } else {
        console.error('An error occurred:', error.message);
      }
    } else {
      console.error('An error occurred:', error);
    }
  }
}
runClustering();
*/

/*
import { promises as fs } from 'fs';
import { kmeans } from 'ml-kmeans';

interface EmbeddingResult {
  text: string;
  embedding: number[];
}

interface EmbeddingsFile {
  modelUsed: string;
  totalTexts: number;
  successful: number;
  results: EmbeddingResult[];
}

function calculateWCSS(embeddings: number[][], centroids: number[][], clusters: number[]): number {
  let wcss = 0;
  for (let i = 0; i < embeddings.length; i++) {
    const centroid = centroids[clusters[i]];
    const distance = embeddings[i].reduce((sum, val, j) => sum + Math.pow(val - centroid[j], 2), 0);
    wcss += distance;
  }
  return wcss;
}

function calculateWCSSForK(embeddings: number[][], maxClusters: number): { k: number; wcss: number }[] {
  const results: { k: number; wcss: number }[] = [];

  for (let k = 1; k <= maxClusters; k++) {
    const result = kmeans(embeddings, k, { initialization: 'kmeans++' });
    const wcss = calculateWCSS(embeddings, result.centroids, result.clusters);
    results.push({ k, wcss });
  }

  return results;
}

function findOptimalK(wcssResults: { k: number; wcss: number }[]): number {
  const deltas: number[] = [];
  for (let i = 1; i < wcssResults.length; i++) {
    deltas.push(wcssResults[i - 1].wcss - wcssResults[i].wcss);
  }

  for (let i = 1; i < deltas.length; i++) {
    if (deltas[i] < deltas[i - 1] * 0.5) { 
      return wcssResults[i].k;
    }
  }

  return Math.min(10, wcssResults.length);
}

async function runClustering() {
  const filePath = './embeddings.json';
  const maxPossibleClusters = 15;

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: EmbeddingsFile = JSON.parse(fileContent);

    if (!data.results || data.results.length === 0) {
      console.error('Error: No results found.');
      return;
    }

    const embeddings = data.results.map(result => result.embedding);
    const wcssResults = calculateWCSSForK(embeddings, maxPossibleClusters);
    const optimalK = findOptimalK(wcssResults);

    const ans = kmeans(embeddings, optimalK, {
      initialization: 'kmeans++',
    });
    console.log('Clustering complete.');
    const clusters: { text: string }[][] = Array.from({ length: optimalK }, () => []);

    for (let i = 0; i < ans.clusters.length; i++) {
      const clusterIndex = ans.clusters[i];
      const originalText = data.results[i].text;
      clusters[clusterIndex].push({ text: originalText });
    }

    clusters.forEach((cluster, index) => {
      console.log(`\nCluster ${index + 1} (${cluster.length} items)`);
      cluster.forEach(item => {
        console.log(`- "${item.text}"`);
      });
    });

    await fs.writeFile('clustering_results.json', JSON.stringify({
      optimalK,
      clusters,
      wcssValues: wcssResults
    }, null, 2));

  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
      } else {
        console.error('An error occurred:', error.message);
      }
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}
runClustering();
*/

/*
import { promises as fs } from 'fs';
import { kmeans } from 'ml-kmeans';

interface TextEmbedding {
  prompt: string;
  embedding: number[];
}

interface EmbeddingsData {
  [key: string]: TextEmbedding;
}

function calculateWCSS(embeddings: number[][], centroids: number[][], clusters: number[]): number {
  let wcss = 0;
  for (let i = 0; i < embeddings.length; i++) {
    const centroid = centroids[clusters[i]];
    const distance = embeddings[i].reduce((sum, val, j) => sum + Math.pow(val - centroid[j], 2), 0);
    wcss += distance;
  }
  return wcss;
}

function calculateWCSSForK(embeddings: number[][], maxClusters: number): { k: number; wcss: number }[] {
  const results: { k: number; wcss: number }[] = [];

  for (let k = 1; k <= maxClusters; k++) {
    const result = kmeans(embeddings, k, { initialization: 'kmeans++' });
    const wcss = calculateWCSS(embeddings, result.centroids, result.clusters);
    results.push({ k, wcss });
  }

  return results;
}

function findOptimalK(wcssResults: { k: number; wcss: number }[]): number {
  const deltas: number[] = [];
  for (let i = 1; i < wcssResults.length; i++) {
    deltas.push(wcssResults[i - 1].wcss - wcssResults[i].wcss);
  }

  for (let i = 1; i < deltas.length; i++) {
    if (deltas[i] < deltas[i - 1] * 0.5) {
      return wcssResults[i].k;
    }
  }

  return Math.min(10, wcssResults.length);
}

async function runClustering() {
  const filePath = './embeddings.json';
  const maxPossibleClusters = 15;

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: EmbeddingsData = JSON.parse(fileContent);

    const entries = Object.entries(data);
    if (entries.length === 0) {
      console.error('Error: No embeddings found.');
      return;
    }

    const embeddings = entries.map(([_, value]) => value.embedding);
    const prompts = entries.map(([_, value]) => value.prompt);

    const wcssResults = calculateWCSSForK(embeddings, maxPossibleClusters);
    const optimalK = findOptimalK(wcssResults);

    const ans = kmeans(embeddings, optimalK, {
      initialization: 'kmeans++',
    });
    console.log('Clustering complete.');

    const clusters: { prompt: string }[][] = Array.from({ length: optimalK }, () => []);

    for (let i = 0; i < ans.clusters.length; i++) {
      const clusterIndex = ans.clusters[i];
      clusters[clusterIndex].push({ prompt: prompts[i] });
    }
    clusters.forEach((cluster, index) => {
      console.log(`\nCluster ${index + 1} (${cluster.length} items)`);
      cluster.forEach(item => {
        console.log(`- "${item.prompt}"`);
      });
    });

  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
      } else {
        console.error('An error occurred:', error.message);
      }
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}

runClustering(); */