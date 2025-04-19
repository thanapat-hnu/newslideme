import express from 'express';
const router = express.Router();

// จำลองข้อมูลเบื้องต้น
let services = [
  { id: 1, name: 'บริการลากจูง', type: 'Flatbed' },
  { id: 2, name: 'บริการแบก', type: 'Hook' },
];

let bookings = [
  {
    id: 1,
    from: { lat: 13.75, lng: 100.5 },
    to: { lat: 13.77, lng: 100.6 },
    serviceType: 'Flatbed',
    date: '2025-04-20',
  },
];

let locations = [
  { id: 1, name: 'สนามหลวง', lat: 13.7563, lng: 100.5018 },
  { id: 2, name: 'อนุสาวรีย์ชัย', lat: 13.7698, lng: 100.5421 },
];

// ✅ GET /api/services – ดึงข้อมูลประเภทบริการ
router.get('/services', (req, res) => {
  res.json(services);
});

// ✅ POST /api/bookings – สร้างการจองใหม่
router.post('/bookings', (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    ...req.body,
  };
  bookings.push(newBooking);
  res.status(201).json({ message: 'สร้างการจองเรียบร้อย', booking: newBooking });
});

// ✅ GET /api/bookings – ดึงข้อมูลการจองที่มีอยู่
router.get('/bookings', (req, res) => {
  res.json(bookings);
});

// ✅ GET /api/locations – ดึงข้อมูลสถานที่
router.get('/locations', (req, res) => {
  res.json(locations);
});

export default router;