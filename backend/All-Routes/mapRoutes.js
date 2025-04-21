// All-Routes/map.route.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// 🔍 ค้นหาสถานที่ (ใช้ Longdo API)
router.get('/search-location', async (req, res) => {
  const { keyword } = req.query;
  try {
    const response = await axios.get('https://search.longdo.com/mapsearch/json/search', {
      params: {
        key: '1b4327452cc20e14a37e40cc130bd03a',
        keyword,
      },
    });
    res.json(response.data.data);
  } catch (err) {
    console.error('❌ Error searching location:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

// 🔁 Reverse Geocode
router.get('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat,
        lon,
        'accept-language': 'th',
      },
    });
    const address = response.data.address || {};
    res.json({
      name: address.neighbourhood || address.suburb || address.city || 'ไม่ทราบพื้นที่',
      road: address.road || 'ไม่ทราบถนน',
      soi: address.suburb || address.neighbourhood || 'ไม่ทราบซอย',
    });
  } catch (err) {
    console.error('❌ Error reverse geocode:', err);
    res.status(500).json({ message: 'Reverse geocoding failed' });
  }
});

// ✅ /api/save-location
router.post('/save-location', (req, res) => {
  const { type, lat, lng } = req.body; // type = 'origin' | 'destination'
  console.log(`📍 Saved location [${type}]:`, lat, lng);
  res.json({ message: 'Location saved' });
});

// ✅ /api/search-log
router.post('/search-log', (req, res) => {
  const { keyword } = req.body;
  console.log('🔎 Search logged:', keyword);
  res.json({ message: 'Search keyword logged' });
});

// ✅ /api/providers
router.get('/providers', (req, res) => {
  const { lat, lng } = req.query;
  const mockProviders = [
    {
      id: 'P001',
      name: 'ลากเร็วทันใจ',
      price: 1500,
      carType: 'Flatbed',
      location: { lat: lat, lng: lng },
    },
    {
      id: 'P002',
      name: 'ลากด่วน24ชม.',
      price: 1800,
      carType: 'Hook & Chain',
      location: { lat: lat, lng: lng },
    },
  ];
  res.json(mockProviders);
});

// ✅ /api/book-service
router.post('/book-service', (req, res) => {
  const { origin, destination, providerId, time, carType } = req.body;

  console.log('📦 Booking service:', {
    origin,
    destination,
    providerId,
    carType, 
    time,
  });

  res.json({ message: 'Booking confirmed' });
});

// ✅ /api/history
router.post('/history', (req, res) => {
  const { userId, action, detail } = req.body;
  console.log('🕘 Save history:', { userId, action, detail });
  res.json({ message: 'History saved' });
});

export default router;
