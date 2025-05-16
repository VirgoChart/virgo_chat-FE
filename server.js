import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(5200, () => {
  console.log("🚀 Server is running on port 5200");
});

const callRooms = {};

io.on("connection", (socket) => {
  console.log("🔵 User connected:", socket.id);

  socket.on("join-call", (callId) => {
    socket.join(callId);
    if (!callRooms[callId]) callRooms[callId] = [];
    callRooms[callId].push(socket.id);
    console.log(`📞 User ${socket.id} joined call ${callId}`);
  });

  socket.on("send-signal", ({ callId, signalData }) => {
    socket.to(callId).emit("receive-signal", { signalData });
  });

  socket.on("leave-call", (callId) => {
    socket.leave(callId);
    callRooms[callId] = callRooms[callId]?.filter((id) => id !== socket.id);
    console.log(`❌ User ${socket.id} left call ${callId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    for (const callId in callRooms) {
      callRooms[callId] = callRooms[callId].filter((id) => id !== socket.id);
    }
  });
});
