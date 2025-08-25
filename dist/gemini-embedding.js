"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const promises_1 = __importDefault(require("fs/promises"));
async function main() {

    const fileContent = await promises_1.default.readFile('prompts.txt', 'utf-8');
    const prompts = fileContent.split('\n').filter(line => line.trim() !== '');
    if (prompts.length === 0) {
        console.error('No prompts found.');
        return;
    }
    const ai = new genai_1.GoogleGenAI({
        apiKey: " ", //api key
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

            await promises_1.default.writeFile('embeddings.json', JSON.stringify(output, null, 2));
            console.log('Embeddings successfully written to embeddings.json.');
        }
        catch (error) {
            console.error('An error occurred during embedding generation or file writing:', error);
        }
    }
    generateAndSaveEmbeddings();
}
main().catch(console.error);
