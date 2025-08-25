"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const promises_1 = __importDefault(require("fs/promises"));
async function main() {
    // Read prompts from prompts.txt
    const fileContent = await promises_1.default.readFile('prompts.txt', 'utf-8');
    const prompts = fileContent.split('\n').filter(line => line.trim() !== '');
    if (prompts.length === 0) {
        console.error('No prompts found in prompts.txt');
        return;
    }
    const ai = new genai_1.GoogleGenAI({
        apiKey: "AIzaSyD2pRiGxl7MfitqjYuJsPzUZmODeUUhpJo",
    });
    /**
 * Generates embeddings for a list of prompts and saves them to a JSON file
 * in the specified format.
 */
    async function generateAndSaveEmbeddings() {
        try {
            const modelName = 'gemini-embedding-001';
            console.log(`Generating embeddings with model: ${modelName}`);
            // Call the embedding API to get the embeddings
            const response = await ai.models.embedContent({
                model: modelName,
                contents: prompts.map(text => ({ text })),
            });
            // Check if embeddings were returned successfully
            if (!response.embeddings) {
                console.error('Error: No embeddings were returned from the API.');
                return;
            }
            // Map the embeddings directly to the output format.
            // This approach is more robust and resolves the TypeScript error.
            const output = response.embeddings.map((embeddingData, index) => {
                // We assume the API returns embeddings in the same order as the prompts.
                // We retrieve the corresponding prompt using the index.
                const prompt = prompts[index];
                return {
                    prompt: prompt,
                    embedding: embeddingData.values
                };
            });
            // Write the new output structure to the embeddings.json file
            // The null, 2 arguments are for pretty-printing the JSON
            await promises_1.default.writeFile('embeddings.json', JSON.stringify(output, null, 2));
            console.log('Embeddings successfully written to embeddings.json in the requested format.');
        }
        catch (error) {
            console.error('An error occurred during embedding generation or file writing:', error);
        }
    }
    // Execute the main function
    generateAndSaveEmbeddings();
}
main().catch(console.error);
