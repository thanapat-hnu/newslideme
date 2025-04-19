import express from 'express';
const router = express.Router();

// ✅ ส่งข้อมูลการยืนยันการจอง
router.post('/confirm', (req, res) => {
  const { startLocation, endLocation, serviceType, dateTime } = req.body;
  if (!startLocation || !endLocation || !serviceType || !dateTime) {
    return res.status(400).json({ message: 'ข้อมูลการจองไม่ครบถ้วน' });
  }
  // บันทึกข้อมูลการจอง (mock)
  res.status(201).json({ message: 'การจองถูกยืนยันเรียบร้อย' });
});

// ✅ ตรวจสอบข้อมูลการจองที่ยืนยันแล้ว
router.get('/confirm/:id', (req, res) => {
  const { id } = req.params;
  const booking = {}; // ดึงข้อมูลการจองจากฐานข้อมูลด้วย id (mock)
  res.json(booking);
});

export default router;