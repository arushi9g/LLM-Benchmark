/*import * as tf from '@tensorflow/tfjs';
import { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';

interface BertScoreOptions {
    lang?: string;
    modelType?: string;
    numLayers?: number;
    verbose?: boolean;
}

interface BertScoreResult {
    precision: number;
    recall: number;
    f1: number;
}

class BertScore {
    private model: UniversalSentenceEncoder | null = null;
    private options: BertScoreOptions;

    constructor(options: BertScoreOptions = {}) {
        this.options = {
            lang: 'en',
            modelType: 'universal-sentence-encoder',
            numLayers: 1,
            verbose: false,
            ...options
        };
    }

    async initialize(): Promise<void> {
        if (!this.model) {
            if (this.options.verbose) {
                console.log('Loading Universal Sentence Encoder...');
            }
            this.model = await UniversalSentenceEncoder.load();
            if (this.options.verbose) {
                console.log('Model loaded successfully');
            }
        }
    }

    private async getEmbeddings(sentences: string[]): Promise<tf.Tensor2D> {
        if (!this.model) {
            throw new Error('Model not initialized. Call initialize() first.');
        }
        return this.model.embed(sentences);
    }

    private cosineSimilarity(a: tf.Tensor2D, b: tf.Tensor2D): tf.Tensor2D {
        const aNormalized = a.div(a.norm(2, 1, true));
        const bNormalized = b.div(b.norm(2, 1, true));
        return tf.matMul(aNormalized, bNormalized.transpose());
    }

    async compute(
        candidates: string[],
        references: string[]
    ): Promise<BertScoreResult[]> {
        if (candidates.length !== references.length) {
            throw new Error('Candidates and references must have the same length');
        }

        await this.initialize();

        if (this.options.verbose) {
            console.log('Computing embeddings for candidates...');
        }
        const candidateEmbeddings = await this.getEmbeddings(candidates);

        if (this.options.verbose) {
            console.log('Computing embeddings for references...');
        }
        const referenceEmbeddings = await this.getEmbeddings(references);

        if (this.options.verbose) {
            console.log('Calculating cosine similarities...');
        }
        const similarityMatrix = this.cosineSimilarity(
            candidateEmbeddings,
            referenceEmbeddings
        );

        // Get the diagonal (pairwise similarities)
        const pairwiseSimilarities = tf.diag(similarityMatrix).arraySync() as number[];

        // Calculate precision, recall, and F1
        const results: BertScoreResult[] = [];
        for (const sim of pairwiseSimilarities) {
            results.push({
                precision: sim,
                recall: sim,
                f1: sim // Since precision == recall, F1 is the same
            });
        }

        // Clean up tensors to avoid memory leaks
        tf.dispose([candidateEmbeddings, referenceEmbeddings, similarityMatrix]);

        return results;
    }
}

// Example usage:
async function example() {
    const bertScore = new BertScore({ verbose: true });

    const candidates = [
        "The quick brown fox jumps over the lazy dog",
        "This is a sample sentence"
    ];

    const references = [
        "The fast brown fox leaps over the sleepy dog",
        "This is an example sentence"
    ];

    const results = await bertScore.compute(candidates, references);

    console.log("BERT Scores:");
    results.forEach((result, i) => {
        console.log(`Sentence ${i + 1}:`);
        console.log(`  Precision: ${result.precision.toFixed(4)}`);
        console.log(`  Recall:    ${result.recall.toFixed(4)}`);
        console.log(`  F1:        ${result.f1.toFixed(4)}`);
    });
}

example().catch(console.error);*/