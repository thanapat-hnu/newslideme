// routes/Login.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// สร้าง token แบบง่าย
const generateToken = (userData) => {
  const tokenData = {
    name: userData.first_name ? `${userData.first_name} ${userData.last_name}` : null,
    phone: userData.phone_number || null,
    email: userData.email || null,
    timestamp: new Date().getTime()
  };
  
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
};

router.post("/loginDriver", async (req, res) => {
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
      return res.status(401).json({ 
        success: false,
        message: "อีเมลหรือเลขบัตรประชาชนไม่ถูกต้อง" 
      });
    }

    const token = generateToken(rows[0]);

    return res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
    });
  }
});

// เพิ่ม endpoint สำหรับถอดรหัส token
router.post("/decode-token", (req, res) => {
  try {
    const { token } = req.body;
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return res.json({ success: true, data: decoded });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
});

export default router;
