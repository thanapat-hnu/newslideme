import express from "express";
import pool from "../db.js"; 

const router = express.Router();

router.post("/registerPersonal", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      idCardNumber,
      birthDate,
      phoneNumber,
      email,
      address,
      idCardImage,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !idCardNumber ||
      !birthDate ||
      !phoneNumber ||
      !email ||
      !address
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    // Check for existing user (duplicate id card, phone number, or email)
    const [existingUser] = await pool.query(
      "SELECT * FROM personal_info WHERE id_card_number = ? OR phone_number = ? OR email = ?",
      [idCardNumber, phoneNumber, email]
    );

    if (existingUser.length > 0) {
      if (existingUser[0].id_card_number === idCardNumber) {
        return res
          .status(400)
          .json({ message: "เลขบัตรประชาชนนี้ถูกใช้งานแล้ว" });
      }
      if (existingUser[0].phone_number === phoneNumber) {
        return res
          .status(400)
          .json({ message: "เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว" });
      }
      if (existingUser[0].email === email) {
        return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
      }
    }

    // If idCardImage is a file (binary data), ensure it's properly handled
    let idCardImageBinary = null;
    if (idCardImage) {
      // Assuming idCardImage is base64 encoded image
      idCardImageBinary = Buffer.from(idCardImage, "base64");
    }

    // Insert new personal info
    const [result] = await pool.query(
      `INSERT INTO personal_info (
          first_name, 
          last_name, 
          id_card_number, 
          birth_date, 
          phone_number, 
          email, 
          address, 
          id_card_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        idCardNumber,
        birthDate,
        phoneNumber,
        email,
        address,
        idCardImageBinary,
      ]
    );

    return res.status(201).json({
      message: "บันทึกข้อมูลส่วนตัวสำเร็จ",
      personalId: result.insertId,
    });
  } catch (error) {
    console.error("Personal registration error:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการบันทึกข้อมูลส่วนตัว",
      error: error.message,
    });
  }
});

export default router; // Use export default for ESM
