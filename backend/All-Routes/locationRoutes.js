import express from 'express';
const router = express.Router();

// ✅ บันทึกตำแหน่งต้นทาง
router.post('/start', (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ message: 'ข้อมูลตำแหน่งต้นทางไม่ครบถ้วน' });
  }
  // บันทึกข้อมูลตำแหน่งต้นทาง (mock)
  res.status(201).json({ message: 'ตำแหน่งต้นทางถูกบันทึกเรียบร้อย' });
});

// ✅ บันทึกตำแหน่งปลายทาง
router.post('/end', (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ message: 'ข้อมูลตำแหน่งปลายทางไม่ครบถ้วน' });
  }
  // บันทึกข้อมูลตำแหน่งปลายทาง (mock)
  res.status(201).json({ message: 'ตำแหน่งปลายทางถูกบันทึกเรียบร้อย' });
});

// ✅ ดึงข้อมูลตำแหน่งต้นทาง
router.get('/start', (req, res) => {
  const startLocation = {}; // ดึงข้อมูลตำแหน่งต้นทางจากฐานข้อมูล (mock)
  res.json(startLocation);
});

// ✅ ดึงข้อมูลตำแหน่งปลายทาง
router.get('/end', (req, res) => {
  const endLocation = {}; // ดึงข้อมูลตำแหน่งปลายทางจากฐานข้อมูล (mock)
  res.json(endLocation);
});

export default router;