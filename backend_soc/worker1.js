// const { workerData, parentPort } = require("worker_threads");


// function getSquare(number) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(number * number);
//     }, 1000);
//   });
// }


// (async () => {
//   const square = await getSquare(workerData.number);
//   parentPort.postMessage(square);
// })();

module.exports=async function (number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(number * number);
    }, 1000);
  });
}