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
const fs = __importStar(require("fs"));
function calculateWER(ref, hyp) {
    // Normalization function with special handling for common substitutions
    const normalize = (str) => {
        // Common substitutions that shouldn't be penalized as heavily
        const substitutions = {
            '&': 'and',
            '1': 'one',
            '2': 'two',
            '3': 'three',
            '4': 'four',
            '5': 'five',
            '6': 'six',
            '7': 'seven',
            '8': 'eight',
            '9': 'nine',
            '0': 'zero',
            '$': 'dollar',
            '%': 'percent',
            '€': 'euro',
            '£': 'pound',
            '¥': 'yen',
            '+': 'plus',
            '=': 'equals',
            '@': 'at',
            '#': 'hash',
            'x': 'times',
            '×': 'times',
            'w/': 'with',
            'w/o': 'without'
        };
        return str.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .split(' ')
            .map(word => substitutions[word] || word)
            .join(' ')
            .trim();
    };
    const refNorm = normalize(ref);
    const hypNorm = normalize(hyp);
    const refWords = refNorm.split(' ').filter(word => word.length > 0);
    const hypWords = hypNorm.split(' ').filter(word => word.length > 0);
    // Handle empty reference case
    if (refWords.length === 0) {
        return hypWords.length === 0 ? 0 : 1;
    }
    // Initialize distance matrix with custom costs
    const d = Array(refWords.length + 1)
        .fill(null)
        .map(() => Array(hypWords.length + 1).fill(0));
    // Base cases
    for (let i = 0; i <= refWords.length; i++)
        d[i][0] = i;
    for (let j = 0; j <= hypWords.length; j++)
        d[0][j] = j;
    // Fill distance matrix with custom weights
    for (let i = 1; i <= refWords.length; i++) {
        for (let j = 1; j <= hypWords.length; j++) {
            // Reduced penalty for common substitutions
            const isCommonSubstitution = (refWords[i - 1] === 'one' && hypWords[j - 1] === '1') ||
                (refWords[i - 1] === 'two' && hypWords[j - 1] === '2') ||
                // Add other common substitutions here
                false;
            const cost = (refWords[i - 1] === hypWords[j - 1] || isCommonSubstitution) ? 0 : 0.5; // Reduced penalty
            d[i][j] = Math.min(d[i - 1][j] + 1, // deletion (full penalty)
            d[i][j - 1] + 1, // insertion (full penalty)
            d[i - 1][j - 1] + cost // substitution (reduced penalty)
            );
        }
    }
    return d[refWords.length][hypWords.length] / refWords.length;
}
function processFiles() {
    try {
        // Read files
        const prompts = fs.readFileSync('prompts.txt', 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        const transcriptions = fs.readFileSync('transcriptions_only.txt', 'utf-8').split('\n').map(line => line.trim()).filter(line => line);
        // Check if we have matching counts
        if (prompts.length !== transcriptions.length) {
            console.error(`Mismatched line counts: prompts.txt has ${prompts.length} lines, transcriptions_only.txt has ${transcriptions.length} lines`);
            return;
        }
        // Calculate and print HWER for each pair (up to 50)
        const maxLines = Math.min(prompts.length, 50);
        console.log(`HWER Scores (1-${maxLines}):`);
        for (let i = 0; i < maxLines; i++) {
            const hwer = calculateWER(prompts[i], transcriptions[i]);
            console.log(hwer.toFixed(4)); // Print each score on its own line
        }
        // Additional statistics
        const hwerScores = [];
        for (let i = 0; i < maxLines; i++) {
            hwerScores.push(calculateWER(prompts[i], transcriptions[i]));
        }
        const averageHWER = hwerScores.reduce((sum, score) => sum + score, 0) / hwerScores.length;
        console.log(`\nAverage HWER: ${averageHWER.toFixed(4)}`);
        console.log(`Highest HWER: ${Math.max(...hwerScores).toFixed(4)}`);
        console.log(`Lowest HWER: ${Math.min(...hwerScores).toFixed(4)}`);
    }
    catch (error) {
        console.error('Error processing files:', error);
    }
}
processFiles();
