const express = require("express");
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("event:message", ({ roomId, message, participant, date }) => {
      const msg = {
        message,
        participant,
        date,
      };
      io.to(roomId).emit("message", {
        message: message,
        participant: participant,
        date: date,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
