import { promises as fs } from 'fs';
import { GoogleGenAI } from "@google/genai";
import path from 'path';


async function processPromptsFromFile() {
    const promptsFile = 'prompts.txt';
    const outputFile = 'textanswers.json';
    const modelName = 'gemini-2.5-flash-lite';

    const ai = new GoogleGenAI({

        apiKey: "", //key here

    });

    try {
        const fileContent = await fs.readFile(promptsFile, 'utf-8');
        const prompts = fileContent.split('\n').filter(line => line.trim() !== '');

        if (prompts.length === 0) {
            console.error(`Error: The file "${promptsFile}" is empty or could not be read.`);
            return;
        }



        const outputData: { prompt: string, text: string }[] = [];

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
            } else {
                console.warn(`Failed to get a valid response for prompt ${index + 1}.`);
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

        await fs.writeFile(outputFile, JSON.stringify(outputData, null, 2));

        console.log(`All responses have been successfully written to "${outputFile}".`);

    } catch (error) {
        if (error instanceof Error) {
            if ((error as any).code === 'ENOENT') {
                console.error(`Error: The file "${promptsFile}" was not found.`);
            } else {
                console.error('An error occurred:', error.message);
            }
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}

processPromptsFromFile();
