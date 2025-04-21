// socketDriver/sendJobSocket.js

export const sendJobSocket = (socket, io) => {
  socket.on("jobRequest", (data) => {
    console.log("📩 Job request:", data);

    io.emit("jobRequest", data);
  });
};
