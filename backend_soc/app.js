const ampq = require("amqplib");

const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");

const Queue = "Random_number";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

function getSquare(number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(number * number);
    }, 1000);
  });
}

async function GetRandomNum() {
  try {
    const conection = await ampq.connect("amqp://localhost");
    const channel = await conection.createChannel();

    channel.prefetch(1);
    await channel.assertQueue(Queue, { durable: false });

    channel.consume(
      Queue,
      async (num) => {
        if (num !== null) {
          const number = parseInt(num.content.toString(), 10);

          const square = await getSquare(number);

          io.emit("newSqaure", { number, square });
        //   console.log(`Received ${number}  Sqaure:${square}`);
            console.log(
            `Worker ${process.pid} processed: ${number}, square: ${square}`
          );

          channel.ack(num);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

GetRandomNum();

server.listen(4000, () => {
  console.log(`Worker ${process.pid} WebSocket server running on http://localhost:4000`);
});
