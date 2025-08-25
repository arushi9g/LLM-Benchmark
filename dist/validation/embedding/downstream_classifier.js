"use strict";
/*
import { promises as fs } from 'fs';
import * as tf from '@tensorflow/tfjs-node';
import { kmeans } from 'ml-kmeans';

// --- Type Definitions for the JSON structure ---

// Represents a single result object in the JSON file
interface EmbeddingResult {
    text: string;
    embedding: number[];
}

// Represents the overall structure of the embeddings.json file
interface EmbeddingsFile {
    modelUsed: string;
    totalTexts: number;
    successful: number;
    results: EmbeddingResult[];
}


async function trainClassifier(embeddings: number[][], labels: number[]): Promise<number> {
    const xs = tf.tensor2d(embeddings);
    const numClasses = Math.max(...labels) + 1;
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), numClasses);

    // Get the number of output units from the shape of the one-hot encoded labels
    const outputUnits = ys.shape[1];

    // Check if outputUnits is a valid number to prevent the TypeScript error
    if (outputUnits === undefined) {
        throw new Error("Could not determine the number of classes from the labels.");
    }

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape: [embeddings[0].length], activation: 'relu' }));
    // Use the validated outputUnits variable
    model.add(tf.layers.dense({ units: outputUnits, activation: 'softmax' }));

    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });

    await model.fit(xs, ys, { epochs: 10, batchSize: 4, verbose: 0 });

    const evalResult = model.evaluate(xs, ys);
    const accuracy = (await (evalResult as tf.Tensor[])[1].data())[0];
    return accuracy;
}


async function runClusteringAndClassification() {
    const filePath = './embeddings.json';
    const numberOfClusters = 10;

    try {
        // --- 1. Load and Parse the Data ---
        console.log(`Reading embeddings from ${filePath}...`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data: EmbeddingsFile = JSON.parse(fileContent);

        if (!data.results || data.results.length === 0) {
            console.error('Error: No results found in the JSON file.');
            return;
        }

        // Extract the embedding vectors from the data
        const embeddings = data.results.map(result => result.embedding);
        console.log(`Successfully loaded ${embeddings.length} embeddings.`);

        // --- 2. Perform K-Means Clustering to get labels ---
        console.log(`Running K-Means clustering to generate labels for ${numberOfClusters} clusters...`);
        const ans = kmeans(embeddings, numberOfClusters, {
            initialization: 'kmeans++', // A smart way to initialize cluster centers
        });
        console.log('Clustering complete. Using cluster IDs as labels for training.');

        // --- 3. Train the TensorFlow.js Classifier ---
        console.log('Starting TensorFlow.js classifier training...');
        const accuracy = await trainClassifier(embeddings, ans.clusters);
        console.log('Classifier training complete.');
        console.log(`Final training accuracy: ${accuracy.toFixed(4)}`);

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
runClusteringAndClassification();

// run this command in terminal: npx ts-node src/validation/embedding/downstream_classifier.ts

*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const tf = __importStar(require("@tensorflow/tfjs-node"));
const ml_kmeans_1 = require("ml-kmeans");
async function trainClassifier(embeddings, labels) {
    const xs = tf.tensor2d(embeddings);
    const numClasses = Math.max(...labels) + 1;
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), numClasses);
    const outputUnits = ys.shape[1];
    if (outputUnits === undefined) {
        throw new Error("Could not determine the number of classes from the labels.");
    }
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape: [embeddings[0].length], activation: 'relu' }));
    model.add(tf.layers.dense({ units: outputUnits, activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });
    await model.fit(xs, ys, { epochs: 10, batchSize: 4, verbose: 0 });
    const evalResult = model.evaluate(xs, ys);
    const accuracy = (await evalResult[1].data())[0];
    return accuracy;
}
async function runClusteringAndClassification() {
    const filePath = './embeddings.json';
    const numberOfClusters = 10;
    try {
        console.log(`Reading embeddings from ${filePath}...`);
        const embeddingsData = JSON.parse(await fs_1.promises.readFile(filePath, 'utf-8'));
        if (!embeddingsData || embeddingsData.length === 0) {
            console.error('Error: No results found in the JSON file.');
            return;
        }
        const embeddings = embeddingsData.map(item => item.embedding);
        console.log(`Successfully loaded ${embeddings.length} embeddings.`);
        console.log(`Running K-Means clustering to generate labels for ${numberOfClusters} clusters...`);
        const ans = (0, ml_kmeans_1.kmeans)(embeddings, numberOfClusters, {
            initialization: 'kmeans++',
        });
        console.log('Clustering complete. Using cluster IDs as labels for training.');
        console.log('Starting TensorFlow.js classifier training...');
        const accuracy = await trainClassifier(embeddings, ans.clusters);
        console.log('Classifier training complete.');
        console.log(`Final training accuracy: ${accuracy.toFixed(4)}`);
    }
    catch (error) {
        if (error instanceof Error) {
            if ('code' in error && error.code === 'ENOENT') {
                console.error(`Error: The file at ${filePath} was not found.`);
                console.error('Please make sure "embeddings.json" is in the same directory as the script.');
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
runClusteringAndClassification();
// run this command in terminal: npx ts-node src/validation/embedding/downstream_classifier.ts
