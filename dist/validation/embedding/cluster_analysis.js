"use strict";

const fs_1 = require("fs");
const ml_kmeans_1 = require("ml-kmeans");

function calculateWCSS(embeddings, centroids, clusters) {
  let wcss = 0;
  for (let i = 0; i < embeddings.length; i++) {
    const centroid = centroids[clusters[i]];
    const distance = embeddings[i].reduce((sum, val, j) => sum + Math.pow(val - centroid[j], 2), 0);
    wcss += distance;
  }
  return wcss;
}

function calculateWCSSForK(embeddings, maxClusters) {
  const results = [];
  for (let k = 1; k <= maxClusters; k++) {
    const result = (0, ml_kmeans_1.kmeans)(embeddings, k, { initialization: 'kmeans++' });
    const wcss = calculateWCSS(embeddings, result.centroids, result.clusters);
    results.push({ k, wcss });
  }
  return results;
}

function findOptimalK(wcssResults) {
  const deltas = [];
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
    const fileContent = await fs_1.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const entries = Object.entries(data);
    if (entries.length === 0) {
      console.error('Error: No embeddings found in the JSON file.');
      return;
    }

    const embeddings = entries.map(([_, value]) => value.embedding);
    const prompts = entries.map(([_, value]) => value.prompt);
    const wcssResults = calculateWCSSForK(embeddings, maxPossibleClusters);
    const optimalK = findOptimalK(wcssResults);

    const ans = (0, ml_kmeans_1.kmeans)(embeddings, optimalK, {
      initialization: 'kmeans++',
    });

    const clusters = Array.from({ length: optimalK }, () => []);
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
  }
  catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
      }
      else {
        console.error('An error occurred:', error.message);
      }
    }
    else {
      console.error('An unknown error occurred:', error);
    }
  }
}

runClustering();


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


async function runClustering() {
  const filePath = './embeddings.json';
  const numberOfClusters = 10;

  try {

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: EmbeddingsFile = JSON.parse(fileContent);

    if (!data.results || data.results.length === 0) {
      console.error('Error: No results found in the JSON file.');
      return;
    }

    
    const embeddings = data.results.map(result => result.embedding);
    const ans = kmeans(embeddings, numberOfClusters, {
      initialization: 'kmeans++',
    });
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
      console.error('An unknown error occurred:', error);
    }
  }
}

runClustering();
*/
Object.defineProperty(exports, "__esModule", { value: true });
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
    // --- 1. Load and Parse the Data ---
    console.log(`Reading embeddings from ${filePath}...`);
    // The new format is a top-level array, so we parse it directly.
    const embeddingsData = JSON.parse(
      await fs.readFile(filePath, 'utf-8')
    ) as EmbeddingResult[];

    if (!embeddingsData || embeddingsData.length === 0) {
      console.error('Error: No results found in the JSON file.');
      return;
    }

    // Extract the embedding vectors from the data
    const embeddings = embeddingsData.map(item => item.embedding);
    console.log(`Successfully loaded ${embeddings.length} embeddings.`);

    // --- 2. Perform K-Means Clustering ---
    console.log(`Running K-Means clustering for ${numberOfClusters} clusters...`);
    const ans = kmeans(embeddings, numberOfClusters, {
      initialization: 'kmeans++', // A smart way to initialize cluster centers
    });
    console.log('Clustering complete.');

    const clusters: { prompt: string }[][] = Array.from({ length: numberOfClusters }, () => []);

    // Assign each prompt to its corresponding cluster
    for (let i = 0; i < ans.clusters.length; i++) {
      const clusterIndex = ans.clusters[i];
      const originalPrompt = embeddingsData[i].prompt;
      clusters[clusterIndex].push({ prompt: originalPrompt });
    }

    // Print the results
    console.log('\n--- Clustering Results ---');
    clusters.forEach((cluster, index) => {
      console.log(`\n--- Cluster ${index + 1} (${cluster.length} items) ---`);
      cluster.forEach(item => {
        console.log(`- "${item.prompt}"`);
      });
    });

  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
        console.error('Please make sure "embeddings.json" is in the same directory as the script.');
      } else {
        console.error('An error occurred:', error.message);
      }
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}

// Run the main function
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

// Function to calculate WCSS (Within-Cluster Sum of Squares)
function calculateWCSS(embeddings: number[][], centroids: number[][], clusters: number[]): number {
  let wcss = 0;
  for (let i = 0; i < embeddings.length; i++) {
    const centroid = centroids[clusters[i]];
    const distance = embeddings[i].reduce((sum, val, j) => sum + Math.pow(val - centroid[j], 2), 0);
    wcss += distance;
  }
  return wcss;
}

// Function to calculate WCSS for different k values
function calculateWCSSForK(embeddings: number[][], maxClusters: number): { k: number; wcss: number }[] {
  const results: { k: number; wcss: number }[] = [];

  for (let k = 1; k <= maxClusters; k++) {
    const result = kmeans(embeddings, k, { initialization: 'kmeans++' });
    const wcss = calculateWCSS(embeddings, result.centroids, result.clusters);
    results.push({ k, wcss });
  }

  return results;
}

// Function to find the elbow point
function findOptimalK(wcssResults: { k: number; wcss: number }[]): number {
  // Calculate the differences between consecutive WCSS values
  const deltas: number[] = [];
  for (let i = 1; i < wcssResults.length; i++) {
    deltas.push(wcssResults[i - 1].wcss - wcssResults[i].wcss);
  }

  // Find the point where the decrease becomes less significant
  for (let i = 1; i < deltas.length; i++) {
    if (deltas[i] < deltas[i - 1] * 0.5) { // Threshold can be adjusted
      return wcssResults[i].k;
    }
  }

  // Default to the k that explains most of the variance if no clear elbow found
  return Math.min(10, wcssResults.length);
}

async function runClustering() {
  const filePath = './embeddings.json';
  const maxPossibleClusters = 15; // Maximum number of clusters to test for elbow method

  try {
    // --- 1. Load and Parse the Data ---
    console.log(`Reading embeddings from ${filePath}...`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data: EmbeddingsFile = JSON.parse(fileContent);

    if (!data.results || data.results.length === 0) {
      console.error('Error: No results found in the JSON file.');
      return;
    }

    const embeddings = data.results.map(result => result.embedding);
    console.log(`Successfully loaded ${embeddings.length} embeddings.`);

    // --- 2. Determine Optimal Number of Clusters ---
    console.log('Calculating optimal number of clusters using Elbow Method...');
    const wcssResults = calculateWCSSForK(embeddings, maxPossibleClusters);
    const optimalK = findOptimalK(wcssResults);
    console.log(`Optimal number of clusters determined: ${optimalK}`);

    // --- 3. Perform K-Means Clustering with Optimal K ---
    console.log(`Running K-Means clustering for ${optimalK} clusters...`);
    const ans = kmeans(embeddings, optimalK, {
      initialization: 'kmeans++',
    });
    console.log('Clustering complete.');

    // --- 4. Organize and Display Results ---
    const clusters: { text: string }[][] = Array.from({ length: optimalK }, () => []);

    for (let i = 0; i < ans.clusters.length; i++) {
      const clusterIndex = ans.clusters[i];
      const originalText = data.results[i].text;
      clusters[clusterIndex].push({ text: originalText });
    }

    console.log('\n--- Clustering Results ---');
    clusters.forEach((cluster, index) => {
      console.log(`\n--- Cluster ${index + 1} (${cluster.length} items) ---`);
      cluster.forEach(item => {
        console.log(`- "${item.text}"`);
      });
    });

    // Optional: Save results to a file
    await fs.writeFile('clustering_results.json', JSON.stringify({
      optimalK,
      clusters,
      wcssValues: wcssResults
    }, null, 2));
    console.log('\nResults saved to clustering_results.json');

  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ENOENT') {
        console.error(`Error: The file at ${filePath} was not found.`);
        console.error('Please make sure "embeddings.json" is in the same directory as the script.');
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