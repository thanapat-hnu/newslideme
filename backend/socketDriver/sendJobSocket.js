// socketDriver/sendJobSocket.js

export const sendJobSocket = (socket) => {
  socket.on("jobRequest", (data) => {
    console.log("📩 Job request:", data);
    socket.emit("jobRequest", data);
  });
};