/*
import * as tsnejs from 'tsne-js';

export function runTSNE(embeddings: number[][]): number[][] {
    const model = new tsnejs.tSNE({ dim: 2, perplexity: 30.0 });
    model.initDataRaw(embeddings);
    for (let i = 0; i < 500; i++) model.step();
    return model.getSolution();

    
} 
*/


/*
import * as ml from 'ml-kmeans';

export function clusterEmbeddings(embeddings: number[][], k = 2) {
  return ml.kmeans(embeddings, k);
}
*/