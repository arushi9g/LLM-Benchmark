import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const fileContent = await fs.readFile('prompts.txt', 'utf-8');
    const prompts = fileContent.split('\n').filter(line => line.trim() !== '');

    if (prompts.length === 0) {
        console.error('No prompts found.');
        return;
    }

    const ai = new GoogleGenAI({
        apiKey: " ", //Insert key
    });

    async function generateAndSaveEmbeddings() {
        try {
            const modelName = 'gemini-embedding-001';

            const response = await ai.models.embedContent({
                model: modelName,
                contents: prompts.map(text => ({ text })),
            });

            if (!response.embeddings) {
                console.error('Error: No embeddings were returned from the API.');
                return;
            }

            const output = response.embeddings.map((embeddingData, index) => {

                const prompt = prompts[index];
                return {
                    prompt: prompt,
                    embedding: embeddingData.values
                };
            });

            await fs.writeFile('embeddings.json', JSON.stringify(output, null, 2));

            console.log('Embeddings successfully written to embeddings.json.');
        } catch (error) {
            console.error('An error occurred during embedding generation or file writing:', error);
        }
    }

    generateAndSaveEmbeddings();
}
main().catch(console.error);