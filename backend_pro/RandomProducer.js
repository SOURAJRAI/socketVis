const ampq = require("amqplib");
const express = require("express");

const app = express();

const Queue = "Random_number";
const dotenv=require('dotenv')

dotenv.config();

// async function generateRandom() {
//   try {
//     const connection = await ampq.connect(AMQP_URL);


//     const channel = await connection.createChannel();

//     const random_number = Math.floor(Math.random() * 100);

//     const exchange = "number_exchange";
//     const routingKey = "random_num";

//     await channel.assertExchange(exchange, "direct", { durable: false });

//     await channel.assertQueue(Queue, { durable: false });

//     await channel.bindQueue(Queue, exchange, routingKey);

//     channel.publish(
//       exchange,
//       routingKey,
//       Buffer.from(random_number.toString())
//     );
//     setTimeout(() => {
//         connection.close();
//     }, 5000);

//     console.log("Random number", random_number);
//   } catch (err) {
//     console.log(err);
//   }
// }



async function generateRandom() {
  try{

    let connection=await ampq.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    let channel= await connection.createChannel();

    await channel.assertQueue(Queue,{durable:false});
    
    setInterval(() => {
      const random_number = Math.floor(Math.random() * 100);
      channel.sendToQueue(Queue,Buffer.from(random_number.toString()))
      console.log("sent Number",random_number);
    }, 100);
  }catch(err){
    console.log(err);
    setTimeout(()=>generateRandom,5000)
  }

}

app.listen(3000, () => {
  // setInterval(() => {
    generateRandom();
  // }, 1000);

  console.log("Producer listening on 3000");
});
