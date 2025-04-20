// routes/Login.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const clientIp = req.headers["client"] || req.socket.remoteAddress;
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  console.log("==========================================");
  console.log(`📥 [${now}] Login`);
  console.log(`🌐 IP Address: ${clientIp}`);
  console.log("➡️ Request Body:", {
    email: req.body.email,
    idCardNumber: req.body.idCardNumber,
  });
  console.log("==========================================");
  try {
    const { email, idCardNumber } = req.body;

    if (!email || !idCardNumber) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM personal_info WHERE email = ? AND id_card_number = ?`,
      [email, idCardNumber]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "อีเมลหรือเลขบัตรประชาชนไม่ถูกต้อง" });
    }

    const user = rows[0];
    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: user.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      error: error.message,
    });
  }
});

export default router;
