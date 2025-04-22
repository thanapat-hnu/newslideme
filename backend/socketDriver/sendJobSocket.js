// socketDriver/sendJobSocket.js

export const sendJobSocket = (socket, io) => {
  socket.on("jobRequest", (data) => {
    console.log("📩 Job request:", data);

    io.emit("jobRequest", data);
  });

  socket.on("sendJob", (data) => {
    console.log("📩 Send job:", data);

    io.emit("sendJob", data);
  });

  socket.on("statusUpdate", (data) => {
    console.log("📩 Status update:", data);

    io.emit("statusUpdate", data);
  });

  socket.on("idPersonal", (id) => {
    console.log("📩 ID personal:", id);

    io.emit("idPersonal", id);
  });
};
