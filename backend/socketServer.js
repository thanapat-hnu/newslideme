import { Server } from "socket.io";
import { sendJobSocket } from "./socketDriver/sendJobSocket.js";

// Mock database using in-memory array
const messageStore = {};

// Function to generate room ID based on user and driver IDs
const generateRoomId = (userId, driverId) => {
  return [userId, driverId].sort().join("-");
};

// เตรียมไว้เพื่อต่อ pool.query ในอนาคต
const saveMessageToDb = async (roomId, message) => {
  try {
    // เตรียมสำหรับ pool.query
    /*
    await pool.query(
      'INSERT INTO messages (room_id, sender_id, message_text, timestamp) VALUES ($1, $2, $3, $4)',
      [roomId, message.sender, message.text, new Date(message.timestamp)]
    );
    */
    
    // เก็บข้อมูลใน array แทน
    if (!messageStore[roomId]) {
      messageStore[roomId] = [];
    }
    messageStore[roomId].push(message);
    
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

// เตรียมไว้เพื่อต่อ pool.query ในอนาคต
const fetchMessagesFromDb = async (roomId) => {
  try {
    // เตรียมสำหรับ pool.query
    /*
    const result = await pool.query(
      'SELECT sender_id as sender, message_text as text, timestamp FROM messages WHERE room_id = $1 ORDER BY timestamp ASC',
      [roomId]
    );
    return result.rows.map(row => ({
      sender: row.sender,
      text: row.text,
      timestamp: row.timestamp.getTime()
    }));
    */
    
    // ส่งข้อมูลจาก array แทน
    return messageStore[roomId] || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // ควรระบุโดเมนเป้าหมายที่แน่นอนในการใช้งานจริง
      methods: ["GET", "POST"],
      credentials: true // เพิ่ม credentials support
    }
  });
  
  app.set("socketio", io);
  
  io.on("connection", (socket) => {
    const ip = socket.handshake.address;
    // console.log(`🔌 New user connected: ${socket.id} from ${ip}`);

    // ✅ ส่ง socket เข้าไปให้ sendJobSocket แทน
    sendJobSocket(socket, io);

    socket.on("joinRoom", ({ userId, driverId }) => {
      const roomId = generateRoomId(userId, driverId);
      console.log(`🟢 User ${socket.id} joined room: ${roomId}`);
      socket.join(roomId);
    });
    
    socket.on("chatMessage", async ({ userId, driverId, message }) => {
      const roomId = generateRoomId(userId, driverId);
      console.log(`💬 Chat message in room ${roomId}:`, message);
      
      try {
        // บันทึกข้อความลง array mock-up
        await saveMessageToDb(roomId, message);
        
        // ส่งข้อความไปยังทุกคนในห้อง
        io.to(roomId).emit("receiveMessage", message);
      } catch (error) {
        console.error("Error handling chat message:", error);
        socket.emit("error", "Failed to send message");
      }
    });
    
    // Typing indicator events
    socket.on("typing", ({ userId, driverId, user }) => {
      const roomId = generateRoomId(userId, driverId);
      console.log(`👆 User ${user} is typing in room ${roomId}`);
      // ส่งให้ทุกคนในห้องยกเว้นผู้ส่ง
      socket.to(roomId).emit("userTyping", { user });
    });
    
    socket.on("stopTyping", ({ userId, driverId, user }) => {
      const roomId = generateRoomId(userId, driverId);
      console.log(`✋ User ${user} stopped typing in room ${roomId}`);
      socket.to(roomId).emit("userStopTyping", { user });
    });
    
    // Get message history
    socket.on("getMessageHistory", async ({ userId, driverId }) => {
      const roomId = generateRoomId(userId, driverId);
      try {
        const messages = await fetchMessagesFromDb(roomId);
        socket.emit("messageHistory", { roomId, messages });
      } catch (error) {
        console.error("Error fetching message history:", error);
        socket.emit("error", "Failed to fetch message history");
      }
    });
    
    // Booking confirm
    socket.on("jobConfirmed", ({ userId, driverId, ...data }) => {
      const roomId = generateRoomId(userId, driverId);
      console.log("📩 Job confirmed:", data);
      io.to(roomId).emit("jobConfirmed", data);
    });
    
    // Job accept
    socket.on("jobAccepted", ({ userId, driverId, jobDetails }) => {
      const roomId = generateRoomId(userId, driverId);
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
