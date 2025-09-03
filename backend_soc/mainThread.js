// const express = require("express");


// const os = require("os");

// const app = express();
// const port = 5000;
// const THREAD_COUNT = 230;
// const totalcpus=os.cpus().length;

// const { Worker } = require("worker_threads");

// // const threads=os.cpus().lenght;
// // const threads=12;
// // Create a worker pool pointing to worker.js

// app.get("/", (req, res) => {
//   res.status(200).send("this page is non blocking");
// });

// function createWorker() {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker("./worker.js", {
//       workerData: { thread_count: THREAD_COUNT },
//     });

//     worker.on("message", (data) => {
//       // res.status(200).send(`result is ${data}`);
//       resolve(data);
//     });
//     worker.on("error", (err) => {
//       // res.status(404).send(`an  error occured ${err}`);
//       reject(err);
//     });
//   });
// }
// // API route
// app.get("/heavy", async (req, res) => {
//   try {
//     const workerPromises = [];
//     console.log('totoal',totalcpus);
    
//     for (let i = 0; i < THREAD_COUNT; i++) {
//       workerPromises.push(createWorker());
//     }

//     const thread_results = await Promise.all(workerPromises);
//     const total =thread_results.reduce((acc,val)=>acc+val,0)

//     res.status(200).send(`result is ${total}`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running at http://localhost:${port}`);
// });


const express = require('express');

const path = require('path');
const os = require('os');

const app = express();
const port = 5000;
const {Worker}=require('worker_threads');

// const threads=os.cpus().lenght;
const threads=2;




app.get('/',(req,res)=>{
    res.status(200).send("this page is non blocking")
})


app.get("/heavy", async (req, res) => {
  try {
    const limit = 50000000; 
    const worker = new Worker("./worker.js", { workerData: { threads,limit } });

    worker.on("message", (data) => {
      res.status(200).send(`Primes up to ${limit}: ${data} used thread ${threads}`);
      worker.terminate();
    });

    worker.on("error", (err) => {
      res.status(500).send(`Error: ${err}`);
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
