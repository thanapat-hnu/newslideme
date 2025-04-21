export const generateRoomId = (userId, driverId) => {
  return [userId, driverId].sort().join("-");
};

// ตัวอย่างฟังก์ชันสำหรับเก็บและดึงข้อความจากฐานข้อมูล
// ไฟล์นี้ต้องสร้างแยก เช่น messageService.js

// Mock array สำหรับเก็บข้อมูลข้อความ
let mockDatabase = [];

// บันทึกข้อความลงใน "ฐานข้อมูล" (จริงๆคือ array mock)
export async function saveMessage(roomId, message) {
  try {
    // สร้างข้อความใหม่และเก็บลง mock database
    const newMessage = {
      roomId,
      senderId: message.sender,
      text: message.text,
      timestamp: new Date(message.timestamp),
    };

    mockDatabase.push(newMessage);  // บันทึกข้อความ
    console.log("Message saved:", newMessage);

    return newMessage;  // คืนค่าข้อความที่บันทึก
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

// ดึงประวัติข้อความจาก "ฐานข้อมูล" (จริงๆคือ array mock)
export async function fetchMessagesFromDatabase(roomId) {
  try {
    // หาเฉพาะข้อความที่ตรงกับ roomId
    const messages = mockDatabase.filter(msg => msg.roomId === roomId);
    
    console.log("Messages fetched:", messages);
    
    return messages.map(msg => ({
      sender: msg.senderId,
      text: msg.text,
      timestamp: msg.timestamp.getTime(),  // แปลงเป็น timestamp
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}