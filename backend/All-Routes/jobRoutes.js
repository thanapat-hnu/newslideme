// POST /api/job-accept
router.post("/job-accept", async (req, res) => {
    const { userId, driverId } = req.body;
    const roomId = `${userId}-${driverId}`;
  
    console.log(`🚀 Accepting job for room: ${roomId}`);
  
    try {
      const job = mockBookings.find(
        (j) => j.userId === userId && j.driverId === driverId && j.status === "pending"
      );
      if (job) {
        job.status = "accepted";
      }
  
      const io = req.app.get("socketio");
      if (!io) {
        console.error("❌ Socket.IO instance not found in app");
        return res.status(500).json({ message: "Socket communication error" });
      }
  
      console.log("📡 Emitting jobConfirmed to room:", roomId);
      io.to(roomId).emit("jobConfirmed", {
        roomId,
        status: "accepted",
        message: `Driver accepted job for user ${userId}`,
      });
      res.json({ message: "Job accepted", roomId });
    } catch (error) {
      console.error("❌ Error accepting job:", error);
      res.status(500).json({ message: "Error processing job acceptance" });
    }
  });
  