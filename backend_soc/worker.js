
// const {workerData,parentPort} =require('worker_threads');


//     let counter=0;
//     for (let i=0;i<20_000_000_000/workerData.thread_count;i++){

//         counter++;
//     }

//     parentPort.postMessage(counter);
const { workerData, parentPort } = require("worker_threads");

const {threads,limit}=workerData

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function countPrimes(limit) {
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) count++;
  }
  return count;
}


const result = countPrimes(limit);
parentPort.postMessage(result);
