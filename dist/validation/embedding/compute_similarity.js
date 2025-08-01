"use strict";
class VectorUtils {
    /* Calculates the cosine similarity between two vectors */
    static cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error(`Vector dimensions don't match: ${vecA.length} vs ${vecB.length}`);
        }
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.hypot(...vecA);
        const magnitudeB = Math.hypot(...vecB);
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
    }
    /* dot product of two vectors */
    static dotProduct(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error(`Vector dimensions don't match: ${vecA.length} vs ${vecB.length}`);
        }
        return vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    }
    /* magnitude of a vector */
    static magnitude(vec) {
        return Math.hypot(...vec);
    }
    /* Normalizes a vector */
    static normalize(vec) {
        const mag = this.magnitude(vec);
        if (mag === 0) {
            return Array(vec.length).fill(0);
        }
        return vec.map(v => v / mag);
    }
    /* Converts cosine similarity to angular distance in degrees */
    static similarityToDegrees(similarity) {
        const clampedSimilarity = Math.max(-1, Math.min(1, similarity));
        return Math.acos(clampedSimilarity) * (180 / Math.PI);
    }
}
