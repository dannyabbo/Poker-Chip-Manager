import { createServer } from "node:http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("createRoom", (tableData, callback) => {
      // Implement room creation logic here
      const roomCode = Math.random().toString(36).substring(7);
      const hostId = socket.id;
      // Save room data to your data store
      callback({ roomCode, hostId });
    });

    // Add other event handlers here
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
