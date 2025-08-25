import OpenAI from "openai";
import fs from 'fs/promises';
import path from 'path';

interface EmbeddingResult {
    prompt: string;
    embedding: number[];
}

async function main() {
    try {
        const openai = new OpenAI({
            apiKey: " " //Insert key here
        });

        const promptsText = await fs.readFile('prompts.txt', 'utf-8');
        const prompts = promptsText.split('\n').filter(prompt => prompt.trim() !== '');

        if (prompts.length === 0) {
            throw new Error('No prompts found in prompts.txt');
        }

        const results: EmbeddingResult[] = [];

        for (const prompt of prompts) {
            try {
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-large",
                    input: prompt,
                    encoding_format: "float"
                });

                if (!response.data[0]?.embedding) {
                    console.warn(`No embedding generated for prompt: ${prompt}`);
                    continue;
                }

                results.push({
                    prompt,
                    embedding: response.data[0].embedding
                });

            } catch (error) {
                console.error(`Error processing prompt "${prompt.substring(0, 50)}...":`,
                    error instanceof Error ? error.message : error);
            }
        }

        await fs.writeFile('embeddings.json', JSON.stringify(results, null, 2));

    } catch (error) {
        console.error('error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();