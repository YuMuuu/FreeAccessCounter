import { WebSocketClient, WebSocketServer } from "./deps.ts";
import { connect } from "./deps.ts";
import { v4 } from "./deps.ts";

const sockets = new Map<string, [string, WebSocketClient]>();

const redis = await connect({
  hostname: "0.0.0.0", //ENVで読めるようにする
  // hostname: "redis", //docker-composeで起動させるときはこっち
  port: 6379,
});

console.log("---server start---");

const wss = new WebSocketServer(8080);

wss.on("connection", function (ws: WebSocketClient) {
  console.log("socket connected!");
  const uid = v4.generate();

  console.log("uid", uid);
  // sockets.set(uid, ['', ws])

  ws.on("close", function () {
    console.log("ws closed");
    sockets.delete(uid);
  });

  ws.on("message", async function (message: string) {
    console.log(message);
    sockets.set(uid, [message, ws]);
    const value = await incrcount(message);
    console.log("value: " + value);
    if (typeof value == "number") {
      const responseMessage: string = value.toString();
      broadcastMessage(message, responseMessage);
    }
  });
});

async function incrcount(message: string): Promise<number> {
  return await redis.incr(message);
}

function broadcastMessage(pageValue: string, message: string) {
  sockets.forEach((value: [string, WebSocketClient]) => {
    const savedPageValue = value[0];
    const ws: WebSocketClient = value[1];
    if (!ws.isClosed && pageValue == savedPageValue) {
      ws.send(message);
    }
  });
}
