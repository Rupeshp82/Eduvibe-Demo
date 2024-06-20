import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Setting up socket.io");

    const io = new Server(res.socket.server);
    
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
        console.log("Broadcasting message:", msg);
        io.to(roomId).emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io already set up");
  }
  res.end();
};

export default ioHandler;
