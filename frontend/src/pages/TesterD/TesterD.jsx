import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const TesterD = () => {
  const [jobs, setJobs] = useState([]);
  const userId = "user123";
  const driverId = "driver123";
  const roomId = `${userId}-${driverId}`;

  const fetchPendingJobs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/jobs?status=pending');
      console.log("📋 API response:", res.data);
      
      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        console.warn("⚠️ jobs is not an array:", res.data);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      setJobs([]);
    }
  };

  const handleAccept = async (userId, driverId) => {
    try {
      console.log("📝 Accepting job:", userId, driverId);
      await axios.post('http://localhost:3000/api/job-accept', { userId, driverId });

      socket.emit("jobAccepted", {
        roomId: `${userId}-${driverId}`,
        jobDetails: { userId, driverId, status: "accepted" }
      });
  
      alert(`✅ Accepted job for ${userId}`);
      fetchPendingJobs();
    } catch (error) {
      console.error("❌ Error accepting job:", error);
    }
  };

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    console.log("📡 Joined room:", roomId);

    fetchPendingJobs();

    socket.on("jobRequest", (data) => {
      console.log("📨 Received job request:", data);
      alert("📥 New job request received!");
      fetchPendingJobs();
    });

    socket.on("jobConfirmed", (data) => {
      console.log("📨 Received jobConfirmed:", data);
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    return () => {
      socket.off("jobRequest");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [roomId]);

  return (
    <div>
      <h2>TesterD: Accept Jobs as Driver</h2>
      <button onClick={fetchPendingJobs}>🔄 Refresh Jobs</button>
      <div>Room ID: {roomId}</div>
      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job, index) => (
            <li key={index}>
              <p>{job.userId}</p>
              <button onClick={() => handleAccept(job.userId, job.driverId)}>Accept</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending jobs</p>
      )}
    </div>
  );
};

export default TesterD;
