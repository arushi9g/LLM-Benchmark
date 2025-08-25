"use strict";
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
const genai_1 = require("@google/genai");
const fs = __importStar(require("fs"));
// Initialize Gemini
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || "your-api-key-here"
});
async function transcribeTTSOutputs(inputPath, outputPath) {
    try {
        // Read and parse the input file
        const rawData = fs.readFileSync(inputPath, 'utf-8');
        const jsonData = JSON.parse(rawData);
        const entries = Array.isArray(jsonData) ? jsonData : [jsonData];
        // Prepare results array
        const results = [];
        for (const [index, entry] of entries.entries()) {
            if (!entry.base64Audio) {
                console.log(`Skipping entry ${index} - no base64Audio found`);
                continue;
            }
            console.log(`Processing entry ${index + 1}/${entries.length}`);
            try {
                // Create the Gemini request payload
                const contents = [
                    { text: "Transcribe this audio file verbatim. Return only the raw transcription with no additional commentary." },
                    {
                        inlineData: {
                            mimeType: "audio/mp3", // Change if your audio is different
                            data: entry.base64Audio
                        }
                    }
                ];
                // Send to Gemini
                const response = await ai.models.generateContent({
                    model: "gemini-1.5-flash", // or "gemini-2.5-flash"
                    contents: contents,
                });
                // Get the transcription
                const transcription = response.text;
                // Store results
                results.push({
                    originalPrompt: entry.prompt,
                    transcription: transcription,
                    timestamp: entry.timestamp || new Date().toISOString()
                });
                console.log(`Successfully transcribed entry ${index + 1}`);
            }
            catch (error) {
                console.error(`Error processing entry ${index + 1}:`, error);
                results.push({
                    originalPrompt: entry.prompt,
                    error: error instanceof Error ? error.message : String(error),
                    timestamp: entry.timestamp || new Date().toISOString()
                });
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        // Save all results
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`Transcription complete! Results saved to ${outputPath}`);
    }
    catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}
// Get file paths from command line
const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
    console.log('Usage: ts-node transcribe.ts <input-file> <output-file>');
    console.log('Example: ts-node transcribe.ts tts_outputs.json transcriptions.json');
    process.exit(1);
}
// Run the transcription
transcribeTTSOutputs(inputPath, outputPath);
