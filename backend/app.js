// app.js
import express from "express";
import cors from "cors";
import phoneRoutes from "./All-Routes/routes.js";
import mapRoutes from "./All-Routes/mapRoutes.js";
import chatRoutes from './All-Routes/chatroute.js';
import { swaggerUi, swaggerSpec } from './swagger.js';

import { initSocket } from "./socketServer.js";
import { createServer } from "http";

import register from "./driverRoutes/registerPersonal.js";
import register2 from "./driverRoutes/RegisterVehicle.js";
import loginDriver from "./driverRoutes/login.js";
import getPersonal from "./driverRoutes/getPersonal.js";

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", phoneRoutes);
app.use("/api", mapRoutes);
app.use('/api/chat', chatRoutes);

// driver routes
app.use("/api/drivers", register);
app.use("/api/drivers", register2);
app.use("/api/drivers", loginDriver);
app.use("/api/drivers", getPersonal);

const otps = {};
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function validateOTP(phoneNumber, otp) {
  return otps[phoneNumber] === otp;
}

/**
 * @swagger
 * /api/generate-otp:
 *   post:
 *     summary: ส่งรหัส OTP ไปยังหมายเลขโทรศัพท์
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "0891234567"
 *     responses:
 *       200:
 *         description: ส่ง OTP สำเร็จ
 *       400:
 *         description: เบอร์โทรศัพท์ไม่ถูกต้อง
 */
app.post("/api/generate-otp", (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }
  const otp = generateOTP();
  otps[phoneNumber] = otp;
  console.log(`OTP สำหรับ ${phoneNumber}: ${otp}`);
  return res.json({ success: true, message: "ส่ง OTP สำเร็จ", otp });
});

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: ตรวจสอบ OTP ว่าถูกต้องหรือไม่
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - otp
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "0891234567"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: ยืนยัน OTP สำเร็จ
 *       400:
 *         description: OTP ไม่ถูกต้อง หรือข้อมูลไม่ครบ
 */
app.post("/api/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "ต้องระบุเบอร์โทรศัพท์และ OTP" });
  }
  if (validateOTP(phoneNumber, otp)) {
    delete otps[phoneNumber];
    return res.json({ success: true, message: "ยืนยัน OTP สำเร็จ" });
  } else {
    return res.status(400).json({ success: false, message: "OTP ไม่ถูกต้อง" });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  console.log(`Chat endpoint available at http://localhost:${port}/api/chat/messages`);
  initSocket(server, app);
});
