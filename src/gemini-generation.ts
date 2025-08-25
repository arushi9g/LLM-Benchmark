import { promises as fs } from 'fs';
import { GoogleGenAI } from "@google/genai";
import path from 'path';

/**
 * Reads each line from a file, sends it as a separate prompt to the
 * specified Gemini model, and writes the model's responses to a new file.
 */
async function processPromptsFromFile() {
    const promptsFile = 'prompts.txt';
    const outputFile = 'textanswers.json';
    const modelName = 'gemini-2.5-flash-lite';
    // This assumes the API key is provided at runtime.
    const ai = new GoogleGenAI({

        apiKey: "AIzaSyD2pRiGxl7MfitqjYuJsPzUZmODeUUhpJo",

    });

    try {
        console.log(`Reading prompts from "${promptsFile}"...`);
        // Read the file content and split into an array of lines.
        const fileContent = await fs.readFile(promptsFile, 'utf-8');
        const prompts = fileContent.split('\n').filter(line => line.trim() !== '');

        if (prompts.length === 0) {
            console.error(`Error: The file "${promptsFile}" is empty or could not be read.`);
            return;
        }

        console.log(`Successfully loaded ${prompts.length} prompts.`);
        console.log(`Sending prompts to model: ${modelName}`);

        const outputData: { prompt: string, text: string }[] = [];

        // Loop through each prompt and send it to the model.
        for (const [index, prompt] of prompts.entries()) {
            console.log(`- Processing prompt ${index + 1}/${prompts.length}...`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
            });

            // Check for valid response and extract text.
            if (response && response.text) {
                outputData.push({
                    prompt: prompt,
                    text: response.text
                });
            } else {
                console.warn(`- Failed to get a valid response for prompt ${index + 1}.`);
                outputData.push({
                    prompt: prompt,
                    text: "Failed to get a valid response."
                });
            }

            // Pause for one minute after every 10 prompts to avoid rate limiting
            if ((index + 1) % 10 === 0 && (index + 1) < prompts.length) {
                console.log(`Pausing for 1 minute to avoid API rate limits...`);
                await new Promise(resolve => setTimeout(resolve, 60000));
                console.log(`Resuming processing.`);
            }
        }

        console.log(`Writing all responses to "${outputFile}"...`);
        // Join all responses into a single string and write to the output file.
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

// Run the main function
processPromptsFromFile();
