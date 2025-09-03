const { workerData, parentPort } = require("worker_threads");

// function getSquare(number){

//     return  number * number;

// }

function getSquare(number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(number * number);
    }, 1000);
  });
}

// const sqaure=await getSquare(workerData.number)
// parentPort.postMessage(sqaure)

(async () => {
  const square = await getSquare(workerData.number);
  parentPort.postMessage(square);
})();
