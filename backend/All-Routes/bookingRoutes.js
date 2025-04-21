import express from 'express';
const router = express.Router();

// ✅ mock bookings memory store
const mockBookings = [];

// ✅ Accept job (update status to 'accepted')
router.post("/job-accept", async (req, res) => {
  const { userId, driverId } = req.body;
  const roomId = `${userId}-${driverId}`;

  console.log(`🚀 Accepting job for room: ${roomId}`);

  try {
    // Update job in mock data
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

    io.to(roomId).emit("jobConfirmed", {
      roomId,
      status: "accepted",
      message: `Driver accepted job for user ${userId}`,
    });
    console.log(`📣 Job accepted, emitted to room: ${roomId}`);

    res.json({ message: "Job accepted", roomId });
  } catch (error) {
    console.error("❌ Error accepting job:", error);
    res.status(500).json({ message: "Error processing job acceptance" });
  }
});

// ✅ Confirm booking (create job)
router.post('/confirm', async (req, res) => {
  const { startLocation, endLocation, serviceType, dateTime, userId, driverId } = req.body;

  if (!startLocation || !endLocation || !serviceType || !dateTime) {
    return res.status(400).json({ message: 'Incomplete booking data' });
  }

  try {
    const newBooking = {
      startLocation,
      endLocation,
      serviceType,
      dateTime,
      userId,
      driverId,
      status: 'pending'
    };

    mockBookings.push(newBooking); // ✅ store booking in memory

    const roomId = `${userId}-${driverId}`;
    const io = req.app.get('socketio');
    io.to(roomId).emit('jobConfirmed', {
      message: 'Your booking has been confirmed',
      booking: newBooking,
      roomId
    });

    console.log(`📋 New booking created and emitted to room: ${roomId}`);
    res.status(201).json({ message: 'Booking confirmed', booking: newBooking });
  } catch (error) {
    console.error('❌ Error confirming booking:', error);
    res.status(500).json({ message: 'Booking confirmation failed' });
  }
});

// ✅ Get all bookings (optionally filter by status)
router.get('/jobs', (req, res) => {
  const { status } = req.query;
  const result = status
    ? mockBookings.filter(job => job.status === status)
    : mockBookings;

  console.log("📋 Sending job list:", result);
  res.json(result);
});

export default router;
