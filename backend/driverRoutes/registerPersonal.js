import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/registerPersonal", async (req, res) => {
  const clientIp = req.headers["client"] || req.socket.remoteAddress;
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  console.log("==========================================");
  console.log(`📥 [${now}] Personal Registration`);
  console.log(`🌐 IP Address: ${clientIp}`);
  console.log("➡️ Request Body:", {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    idCardNumber: req.body.idCardNumber,
    birthDate: req.body.birthDate,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    idCardImage: req.body.idCardImage,
  });
  console.log("==========================================");
  try {
    const {
      firstName,
      lastName,
      idCardNumber,
      birthDate,
      phoneNumber,
      email,
      idCardImage,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !idCardNumber ||
      !birthDate ||
      !phoneNumber ||
      !email
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    // Check for existing user (duplicate id card, phone number, or email)
    const [existingUser] = await pool.query(
      "SELECT * FROM personal_info WHERE id_card_number = ? OR phone_number = ? OR email = ?",
      [idCardNumber, phoneNumber, email]
    );

    const errorsUser = {};
    const fieldsUser = {};

    if (existingUser.length > 0) {
      const existingIdCardnumber = existingUser.find(
        (user) => user.id_card_number === idCardNumber
      );
      const existingPhoneNumber = existingUser.find(
        (user) => user.phone_number === phoneNumber
      );
      const existingEmail = existingUser.find((user) => user.email === email);

      if (existingIdCardnumber) {
        errorsUser.idCardNumber = "บัตรประชาชนนี้มีอยู่ในระบบแล้ว";
        fieldsUser.idCardNumber = true;
      }
      if (existingPhoneNumber) {
        errorsUser.phoneNumber = "เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว";
        fieldsUser.phoneNumber = true;
      }
      if (existingEmail) {
        errorsUser.email = "อีเมลนี้มีอยู่ในระบบแล้ว";
        fieldsUser.email = true;
      }
      return res.status(400).json({ messages: errorsUser, fields: fieldsUser });
    }

    // If idCardImage is a file (binary data), ensure it's properly handled
    let idCardImageBinary = null;
    // if (idCardImage) {
    //   // Assuming idCardImage is base64 encoded image
    //   idCardImageBinary = Buffer.from(idCardImage, "base64");
    // }

    // Insert new personal info
    const [result] = await pool.query(
      `INSERT INTO personal_info (
          first_name,
          last_name,
          id_card_number,
          birth_date,
          phone_number,
          email,
          id_card_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        idCardNumber,
        birthDate,
        phoneNumber,
        email,
        idCardImageBinary,
      ]
    );

    console.log("Data saved successfully:", result);
    console.log("==========================================");
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

export default router;
