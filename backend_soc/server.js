const ampq=require('amqplib');

const {Server}=require('socket.io')
const express=require('express');
const {createServer}=require('http');
const { Worker } = require('worker_threads');
const dotenv=require('dotenv')

dotenv.config();
const Queue="Random_number" 

const app=express();
const server=createServer(app);
const io= new Server(server,{
    cors :
    {
        origin: "http://localhost:5173"
    } 
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
           
//         channel.prefetch(8);
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
//         },{noAck:false})
       
//     }catch(err){
//         console.log(err)
//         setTimeout(GetRandomNum, 5000);
//     }

//  }

const THREAD_COUNT = 4;

function createWorker(number) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker1.js", { workerData: { number } });

    worker.on("message", (square) => {
      io.emit("newSquare", { number, square });
      console.log(`Processed ${number} -> Square: ${square}`);
      resolve({ number, square });
    });

    worker.on("error", reject);
  });
}


async function GetRandomNum() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // let RabbitMQ deliver up to 8 messages
    channel.prefetch(8);
    await channel.assertQueue(Queue, { durable: false });

    const batch = [];

    channel.consume(
      Queue,
      async (msg) => {
        if (msg !== null) {
          const number = parseInt(msg.content.toString(), 10);
          batch.push({ msg, number });
      
          // when we have THREAD_COUNT messages, process them
          if (batch.length === THREAD_COUNT) {
            const workerPromises = batch.map((item) =>
              createWorker(item.number)
            );

            const results = await Promise.all(workerPromises);
            console.log("All workers finished:", results);

            // ack all messages after finishing
            batch.forEach((item) => channel.ack(item.msg));
            batch.length = 0; // reset batch
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error(err);
    setTimeout(GetRandomNum, 5000);
  }
}

 GetRandomNum();

 
 
server.listen(4000,()=>{
    console.log("WebSocket server running on http://localhost:4000");
    
})
