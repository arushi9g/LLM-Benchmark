/*import * as tf from '@tensorflow/tfjs-node';

export async function trainClassifier(embeddings: number[][], labels: number[]): Promise<number> {
    const xs = tf.tensor2d(embeddings);
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), Math.max(...labels) + 1);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, inputShape: [embeddings[0].length], activation: 'relu' }));
    model.add(tf.layers.dense({ units: ys.shape[1], activation: 'softmax' }));

    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });

    await model.fit(xs, ys, { epochs: 10, batchSize: 4, verbose: 0 });
    const evalResult = model.evaluate(xs, ys);
    const accuracy = (await evalResult[1].data())[0];
    return accuracy;
} */