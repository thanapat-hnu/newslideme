// socketServer.js
import { Server } from "socket.io";
import { sendJobSocket } from "./socketDriver/sendJobSocket.js";

export const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  app.set("socketio", io);

  io.on("connection", (socket) => {
    const ip = socket.handshake.address;
    // console.log(`🔌 New user connected: ${socket.id} from ${ip}`);

    // ✅ ส่ง socket เข้าไปให้ sendJobSocket แทน
    sendJobSocket(socket, io);

    socket.on("joinRoom", (roomId) => {
      console.log(`🟢 User joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on("chatMessage", ({ roomId, message }) => {
      console.log(`💬 Chat message in room ${roomId}:`, message);
      io.to(roomId).emit("receiveMessage", message);
    });

    socket.on("jobConfirmed", (data) => {
      console.log("📩 Job confirmed:", data);
      io.to(data.roomId).emit("jobConfirmed", data);
    });

    socket.on("jobAccepted", ({ roomId, jobDetails }) => {
      console.log(`✅ Driver accepted job for room: ${roomId}`);
      io.to(roomId).emit("jobConfirmed", {
        message: `Driver accepted the job!`,
        jobDetails,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });
};
