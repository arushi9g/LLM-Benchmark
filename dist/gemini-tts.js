"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
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
const fs_1 = require("fs");
const path = __importStar(require("path"));

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function pcmToWav(pcmData, sampleRate) {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    let offset = 0;
    view.setUint32(offset, 0x52494646, false);
    offset += 4;
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    view.setUint32(offset, 0x57415645, false);
    offset += 4;

    view.setUint32(offset, 0x666d7420, false);
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitsPerSample, true);
    offset += 2;

    view.setUint32(offset, 0x64617461, false);
    offset += 4;
    view.setUint32(offset, dataSize, true);
    offset += 4;

    for (let i = 0; i < pcmData.length; i++) {
        view.setInt16(offset, pcmData[i], true);
        offset += 2;
    }
    return new Blob([view], { type: 'audio/wav' });
}

async function textToSpeech(text, voiceName) {
    var _a, _b, _c, _d, _e, _f;
    const payload = {
        contents: [{
            parts: [{ text: text }]
        }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName }
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };
    const apiKey = " "; //key here
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    const part = (_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0];
    const audioData = (_e = part === null || part === void 0 ? void 0 : part.inlineData) === null || _e === void 0 ? void 0 : _e.data;
    const mimeType = (_f = part === null || part === void 0 ? void 0 : part.inlineData) === null || _f === void 0 ? void 0 : _f.mimeType;
    if (!audioData || !mimeType || !mimeType.startsWith("audio/")) {
        throw new Error('Failed to get audio data from API response.');
    }

    const match = mimeType.match(/rate=(\d+)/);
    if (!match) {
        throw new Error('Could not determine sample rate from mime type.');
    }
    const sampleRate = parseInt(match[1], 10);
    const pcmData = base64ToArrayBuffer(audioData);

    const pcm16 = new Int16Array(pcmData);
    const wavBlob = pcmToWav(pcm16, sampleRate);
    const audioBuffer = await wavBlob.arrayBuffer();
    return Buffer.from(audioBuffer);
}

async function runPromptsToTTS() {
    const promptsFile = 'prompts.txt';
    const outputDir = 'audio_output_puck_flash';
    try {
        const fileContent = await fs_1.promises.readFile(promptsFile, 'utf-8');
        const prompts = fileContent.split('\n').filter(line => line.trim() !== '');
        if (prompts.length === 0) {
            console.error(`Error: "${promptsFile}" is empty.`);
            return;
        }

        await fs_1.promises.mkdir(outputDir, { recursive: true });
        for (const [index, prompt] of prompts.entries()) {
            try {
                const audioBuffer = await textToSpeech(prompt, 'Puck');
                const fileName = path.join(outputDir, `prompt-${index + 1}.wav`);
                await fs_1.promises.writeFile(fileName, audioBuffer);
                console.log(`- Saved audio to "${fileName}"`);
            }
            catch (error) {
                console.error(`- Failed to generate audio for prompt #${index + 1}:`, error);
            }

            if ((index + 1) % 8 === 0 && (index + 1) < prompts.length) {
                console.log(`Delay...`);
                await new Promise(resolve => setTimeout(resolve, 60000));
                console.log(`Resuming...`);
            }
        }
        console.log(`\n"${outputDir}" directory for your audio files.`);
    }
    catch (error) {
        if (error instanceof Error && error.code === 'ENOENT') {
            console.error(`Error: The file "${promptsFile}" was not found.`);
        }
        else {
            console.error('An error occurred:', error);
        }
    }
}
runPromptsToTTS();
