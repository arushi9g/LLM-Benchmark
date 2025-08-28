"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const genai_1 = require("@google/genai");

async function processPromptsFromFile() {
    const promptsFile = 'prompts.txt';
    const outputFile = 'textanswers.json';
    const modelName = 'gemini-2.5-flash-lite';
    const ai = new genai_1.GoogleGenAI({
        apiKey: " ", //put api key here
    });
    try {

        const fileContent = await fs_1.promises.readFile(promptsFile, 'utf-8');
        const prompts = fileContent.split('\n').filter(line => line.trim() !== '');
        if (prompts.length === 0) {
            console.error(`Error: The file "${promptsFile}" is empty or could not be read.`);
            return;
        }

        const outputData = [];
        for (const [index, prompt] of prompts.entries()) {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
            });

            if (response && response.text) {
                outputData.push({
                    prompt: prompt,
                    text: response.text
                });
            }
            else {
                console.warn(`- Failed to get a valid response for prompt ${index + 1}.`);
                outputData.push({
                    prompt: prompt,
                    text: "Failed to get a valid response."
                });
            }
            if ((index + 1) % 10 === 0 && (index + 1) < prompts.length) {
                console.log(`Delay...`);
                await new Promise(resolve => setTimeout(resolve, 60000));
                console.log(`Resuming...`);
            }
        }

        await fs_1.promises.writeFile(outputFile, JSON.stringify(outputData, null, 2));
        console.log(`All responses have been successfully written to "${outputFile}".`);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.code === 'ENOENT') {
                console.error(`Error: The file "${promptsFile}" was not found.`);
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

processPromptsFromFile();
