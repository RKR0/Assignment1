const { parentPort, workerData } = require('worker_threads');

const { index, array } = workerData;
const sortedArray = [...array].sort((a, b) => a - b);

parentPort.postMessage(sortedArray);