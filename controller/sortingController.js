
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');

function sortSequentially(arrays) {
    return arrays.map(arr => [...arr].sort((a, b) => a - b));
  }
  
  function sortConcurrently(arrays, callback) {
    const sortedArrays = new Array(arrays.length);
    let completedWorkers = 0;

    function workerCallback(index, sorted) {
        sortedArrays[index] = sorted;
        completedWorkers++;

        if (completedWorkers === arrays.length) {
            callback(sortedArrays);
        }
    }

    for (let i = 0; i < arrays.length; i++) {
        const worker = new Worker(path.join(__dirname, 'sortWorker.js'), { workerData: { index: i, array: arrays[i] } });

        worker.on('message', sorted => {
            workerCallback(i, sorted); // Use the let variable i here
        });
    }
}

function processSingle(req, res) {
    const { to_sort } = req.body;
  
    const startTime = process.hrtime.bigint();
    const sortedArrays = sortSequentially(to_sort);
    const timeTaken = process.hrtime.bigint() - startTime;
  
    res.json({ sorted_arrays: sortedArrays, time_ns: timeTaken.toString() });
  }
  
  function processConcurrent(req, res) {
    const { to_sort } = req.body;
  
    const startTime = process.hrtime.bigint();
    sortConcurrently(to_sort, sortedArrays => {
      const timeTaken = process.hrtime.bigint() - startTime;
      res.json({ sorted_arrays: sortedArrays, time_ns: timeTaken.toString() });
    });
  }

  module.exports = { processSingle, processConcurrent };
