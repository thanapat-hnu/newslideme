// socketServer.js
import { Server } from "socket.io";

export const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.set("socketio", io);

  io.on("connection", (socket) => {
    console.log("🔌 New user connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      console.log(`🟢 User joined room: ${roomId}`);
      socket.join(roomId);
    });

    // ✅ Chat messaging event
    socket.on("chatMessage", ({ roomId, message }) => {
      console.log(`💬 Chat message in room ${roomId}:`, message);
      io.to(roomId).emit("receiveMessage", message);
    });

    // ✅ Booking confirm
    socket.on("jobConfirmed", (data) => {
      console.log("📩 Job confirmed:", data);
      io.to(data.roomId).emit("jobConfirmed", data);
    });

    // ✅ Job accept
    socket.on("jobAccepted", ({ roomId, jobDetails }) => {
      console.log(`✅ Driver accepted job for room: ${roomId}`);
      io.to(roomId).emit("jobConfirmed", {
        message: `Driver accepted the job!`,
        jobDetails,
      });
      console.log("📡 jobConfirmed emitted to room:", roomId);
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });
};