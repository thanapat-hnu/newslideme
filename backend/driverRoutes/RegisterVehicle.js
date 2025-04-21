import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/registerVehicle", async (req, res) => {
  const clientIp = req.headers["client"] || req.socket.remoteAddress;
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  console.log("==========================================");
  console.log(`📥 [${now}] Vehicle Registration`);
  console.log(`🌐 IP Address: ${clientIp}`);
  console.log("➡️ Request Body:", {
    personalId: req.body.personalId,
    licenseNumber: req.body.licenseNumber,
    plateNumber: req.body.plateNumber,
    vehicleType: req.body.vehicleType,
    vehicleBrand: req.body.vehicleBrand,
    vehicleModel: req.body.vehicleModel,
    licenseType: req.body.licenseType,
    licenseExpiryDate: req.body.licenseExpiryDate,
    licenseImage: req.body.licenseImage,
    vehicleImage: req.body.vehicleImage,
    plateImage: req.body.plateImage,
  });
  console.log("==========================================");
  try {
    const {
      personalId,
      licenseType,
      licenseNumber,
      licenseExpiryDate,
      licenseImage,
      vehicleType,
      vehicleBrand,
      vehicleModel,
      plateNumber,
      vehicleImage,
      plateImage,
    } = req.body;

    // Validate required fields
    if (
      !licenseType ||
      !licenseNumber ||
      !licenseExpiryDate ||
      !vehicleType ||
      !vehicleBrand ||
      !vehicleModel ||
      !plateNumber
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    // Check for existing license or plate number
    const [existingVehicle] = await pool.query(
      "SELECT * FROM vehicle_info WHERE license_number = ? OR plate_number = ?",
      [licenseNumber, plateNumber]
    );

    const errorsVehicle = {};
    const fieldsVehicle = {};

    if (existingVehicle.length > 0) {
      const existingLicense = existingVehicle.find(
        (vehicle) => vehicle.license_number === licenseNumber
      );
      const existingPlate = existingVehicle.find(
        (vehicle) => vehicle.plate_number === plateNumber
      );
      if (existingLicense) {
        errorsVehicle.license_number = "เลขใบขับขี่ถูกใช้ไปแล้ว";
        fieldsVehicle.license_number = true;
      }
      if (existingPlate) {
        errorsVehicle.plate_number = "เลขทะเบียนถูกใช้ไปแล้ว";
        fieldsVehicle.plate_number = true;
      }
      return res
        .status(400)
        .json({ messages: errorsVehicle, fields: fieldsVehicle });
    }

    // Insert vehicle info
    const [result] = await pool.query(
      `INSERT INTO vehicle_info (
                personal_id,
                license_type,
                license_number,
                license_expiry_date,
                license_image,
                vehicle_type,
                vehicle_brand,
                vehicle_model,
                plate_number,
                vehicle_image,
                plate_image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personalId,
        licenseType,
        licenseNumber,
        licenseExpiryDate,
        licenseImage || "", // fallback เป็นค่าว่าง
        vehicleType,
        vehicleBrand,
        vehicleModel,
        plateNumber,
        vehicleImage || "", // fallback
        plateImage || "", // fallback
      ]
    );

    console.log("Data saved successfully:", result);
    console.log("==========================================");
    
    return res.status(201).json({
      message: "บันทึกข้อมูลพาหนะสำเร็จ",
      vehicleId: result.insertId,
    });
  } catch (error) {
    console.error("Vehicle registration error:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการบันทึกข้อมูลพาหนะ",
      error: error.message,
    });
  }
});

export default router; // Export router using ESM syntax
