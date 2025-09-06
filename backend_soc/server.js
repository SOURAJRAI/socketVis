const amqp = require("amqplib");

const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const { Worker } = require("worker_threads");
const dotenv = require("dotenv");

dotenv.config();
const Queue = "Random_number";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// function getSquare(number){
//     // return new Promise((resolve)=>{
//     //     setTimeout(() => {
//     //   resolve(number * number);
//     // }, 1000);

//     // });
//     return number * number;

// }

// async function GetRandomNum(){
//     try{

//         const conection=await ampq.connect( "amqp://localhost");
//         const channel=await conection.createChannel();

//         channel.prefetch(1);
//         await channel.assertQueue(Queue,{durable:false});

//         channel.consume(Queue, async(num)=>{
//             if(num !==null){

//                 // const number =parseInt(num.content.toString(),10);
//                 const number =parseInt(num.content.toString(),10);

//                 const worker=new Worker('./worker1.js',{
//                     workerData:{number:number}
//                 })

//                 //    const  square=await getSquare(number);
//                     worker.on("message",(square)=>{
//                         io.emit("newSqaure",{number,square});

//                         console.log(`Received ${number}  Sqaure:${square}`);
//                         channel.ack(num);
//                     })

//             }
//         })

//     }catch(err){
//         console.log(err)
//         setTimeout(GetRandomNum, 5000);
//     }

//  }

const Piscina = require("piscina");

const path = require("path");

const piscina = new Piscina({
  filename: path.resolve(__dirname, "worker1.js"),
  maxThreads: 8,
});

const resultsBuffer = [];

setInterval(() => {
  if (resultsBuffer.length > 0) {
    const result = resultsBuffer.shift();
    io.emit("newSqaure", result);
    console.log("sennding to frontend", result);
  }
}, 500);

async function GetRandomNum() {
  try {
    // const conection = await ampq.connect("amqp://localhost");
    const conection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conection.createChannel();

    // channel.prefetch(1);
    await channel.assertQueue(Queue, { durable: false });

    channel.consume(Queue, async (num) => {
      if (num !== null) {
        // const number =parseInt(num.content.toString(),10);
        const number = parseInt(num.content.toString(), 10);

        piscina
          .run(number)
          .then((square) => {
            resultsBuffer.push({ number, square });
            console.log(`Received ${number}, Square: ${square}`);
            channel.ack(num);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } catch (err) {
    console.log(err);
    setTimeout(GetRandomNum, 5000);
  }
}

GetRandomNum();

server.listen(4000, () => {
  console.log("WebSocket server running on http://localhost:4000");
});
