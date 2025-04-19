import express from 'express';
const router = express.Router();

// ✅ ดึงข้อมูลพิกัดของสถานที่ที่เก็บไว้
router.get('/locations', (req, res) => {
  // ดึงข้อมูลพิกัดจากฐานข้อมูล (หรือ mock data)
  const locations = []; // ตัวอย่าง mock data
  res.json(locations);
});

// ✅ บันทึกพิกัดใหม่ที่ผู้ใช้เลือก
router.post('/locations', (req, res) => {
  const { lat, lng, name } = req.body;
  if (!lat || !lng || !name) {
    return res.status(400).json({ message: 'ข้อมูลพิกัดไม่ครบถ้วน' });
  }

  // บันทึกพิกัด (mock save)
  res.status(201).json({ message: 'พิกัดถูกบันทึกเรียบร้อย' });
});

// ✅ ดึงข้อมูลพิกัดเฉพาะจากฐานข้อมูล
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const location = {}; // ค้นหาพิกัดจากฐานข้อมูลด้วย id (mock data)
  res.json(location);
});

export default router;