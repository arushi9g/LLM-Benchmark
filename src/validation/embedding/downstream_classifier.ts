import { promises as fs } from 'fs';
import * as tf from '@tensorflow/tfjs-node';
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


async function trainClassifier(embeddings: number[][], labels: number[]): Promise<number> {
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
    const accuracy = (await (evalResult as tf.Tensor[])[1].data())[0];
    return accuracy;
}


async function runClusteringAndClassification() {
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

        const accuracy = await trainClassifier(embeddings, ans.clusters);
        console.log(`Final training accuracy: ${accuracy.toFixed(4)}`);

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
runClusteringAndClassification();

// run this command in terminal: npx ts-node src/validation/embedding/downstream_classifier.ts


/*

import { promises as fs } from 'fs';
import * as tf from '@tensorflow/tfjs-node';
import { kmeans } from 'ml-kmeans';


interface EmbeddingResult {
    prompt: string;
    embedding: number[];
}
async function trainClassifier(embeddings: number[][], labels: number[]): Promise<number> {
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
    const accuracy = (await (evalResult as tf.Tensor[])[1].data())[0];
    return accuracy;
}

async function runClusteringAndClassification() {
    const filePath = './embeddings.json';
    const numberOfClusters = 10;

    try {
        const embeddingsData = JSON.parse(
            await fs.readFile(filePath, 'utf-8')
        ) as EmbeddingResult[];

        if (!embeddingsData || embeddingsData.length === 0) {
            console.error('Error: No results found in the JSON file.');
            return;
        }

        const embeddings = embeddingsData.map(item => item.embedding);
        const ans = kmeans(embeddings, numberOfClusters, {
            initialization: 'kmeans++',
        });
        const accuracy = await trainClassifier(embeddings, ans.clusters);
        console.log(`Final training accuracy: ${accuracy.toFixed(4)}`);

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

runClusteringAndClassification();

// run this command in terminal: npx ts-node src/validation/embedding/downstream_classifier.ts

*/
