// All-Routes/map.route.js
import express from "express";
import axios from "axios";
import pool from "../db.js";

const router = express.Router();

const mockProviders = [
  {
    id: "P001",
    name: "ลากเร็วทันใจ",
    price: 1500,
    carType: "Flatbed",
  },
  {
    id: "P002",
    name: "ลากด่วน24ชม.",
    price: 1800,
    carType: "Hook & Chain",
  },
];

// 🔍 ค้นหาสถานที่ (ใช้ Longdo API)
router.get("/search-location", async (req, res) => {
  const { keyword } = req.query;
  try {
    const response = await axios.get(
      "https://search.longdo.com/mapsearch/json/search",
      {
        params: {
          key: "1b4327452cc20e14a37e40cc130bd03a",
          keyword,
        },
      }
    );
    res.json(response.data.data);
  } catch (err) {
    console.error("❌ Error searching location:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

// 🔁 Reverse Geocode
router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat,
          lon,
          "accept-language": "th",
        },
      }
    );
    const address = response.data.address || {};
    res.json({
      name:
        address.neighbourhood ||
        address.suburb ||
        address.city ||
        "ไม่ทราบพื้นที่",
      road: address.road || "ไม่ทราบถนน",
      soi: address.suburb || address.neighbourhood || "ไม่ทราบซอย",
    });
  } catch (err) {
    console.error("❌ Error reverse geocode:", err);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
});

// ✅ /api/save-location
router.post("/save-location", (req, res) => {
  const { type, lat, lng } = req.body; // type = 'origin' | 'destination'
  console.log(`📍 Saved location [${type}]:`, lat, lng);
  res.json({ message: "Location saved" });
});

// ✅ /api/search-log
router.post("/search-log", (req, res) => {
  const { keyword } = req.body;
  console.log("🔎 Search logged:", keyword);
  res.json({ message: "Search keyword logged" });
});

// ✅ /api/providers
router.get("/providers", (req, res) => {
  const { lat, lng } = req.query;
  const mockProviders = [
    {
      id: "P001",
      name: "ลากเร็วทันใจ",
      price: 1500,
      carType: "Flatbed",
      location: { lat: lat, lng: lng },
    },
    {
      id: "P002",
      name: "ลากด่วน24ชม.",
      price: 1800,
      carType: "Hook & Chain",
      location: { lat: lat, lng: lng },
    },
  ];
  res.json(mockProviders);
});

// ✅ /api/book-service

router.post("/book-service", async (req, res) => {
  const { origin, destination, providerId, time, carType, phone } = req.body;

  try {
    // ✅ ดึง id_user จาก users table ด้วยเบอร์โทร
    const [userRows] = await pool.query(
      "SELECT id_user FROM users WHERE phone = ?",
      [phone]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้จากเบอร์โทรนี้" });
    }

    const id_user = userRows[0].id_user;

    // ✅ ค้นหา provider
    const matchedProvider = mockProviders.find((p) => p.id === providerId);
    if (!matchedProvider) {
      return res
        .status(404)
        .json({ message: "ไม่พบผู้ให้บริการตามรหัสที่ระบุ" });
    }

    const price = matchedProvider.price;
    const order_datetime = new Date(time)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // ✅ เพิ่มข้อมูลการจองและรับ order_id ที่เพิ่มใหม่
    const [result] = await pool.query(
      `
      INSERT INTO order_cus (
        order_datetime,
        shop_name,
        origin,
        destination,
        vehicle_type,
        status,
        price,
        id_user,
        phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        order_datetime,
        matchedProvider.name,
        `lat:${origin.lat},lng:${origin.lng}`,
        `lat:${destination.lat},lng:${destination.lng}`,
        carType,
        "รอรับออเดอร์",
        price,
        id_user,
        phone,
      ]
    );

    const order_id = result.insertId;

    console.log("✅ บันทึกการจองสำเร็จ order_id =", order_id);

    res.json({
      message: "✅ Booking confirmed",
      booking: {
        order_id, // ✅ ส่งกลับไปด้วย
        origin,
        destination,
        providerId,
        providerName: matchedProvider.name,
        carType,
        time,
        price,
        id_user,
        phone,
      },
    });
  } catch (err) {
    console.error("❌ Error booking:", err.message);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

router.get('/orders', async (req, res) => {
  const { order_id } = req.query;

  if (!order_id) {
    return res.status(400).json({ success: false, message: "กรุณาระบุ order_id" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        o.order_id,
        o.shop_name,
        o.origin,
        o.destination,
        o.vehicle_type,
        o.price,
        o.order_datetime,
        o.phone,
        o.status,
        u.firstname,
        u.lastname
      FROM order_cus o
      LEFT JOIN users u ON o.id_user = u.id_user
      WHERE o.order_id = ?
    `, [order_id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบคำสั่งจองนี้" });
    }

    res.json({
      success: true,
      order: rows[0]
    });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ success: false, message: "ดึงข้อมูลล้มเหลว", error: err.message });
  }
});


function formatMySQLDatetime(isoDate) {
  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}


router.post("/move-to-history", async (req, res) => {
  const {
    order_id, personal_id, order_datetime, shop_name,
    origin, destination, vehicle_type, status,
    price, id_user, phone, moved_at
  } = req.body;

  try {
    await pool.query(`
      INSERT INTO history_cus (
        order_id, personal_id, order_datetime, shop_name,
        origin, destination, vehicle_type, status,
        price, id_user, phone, moved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      order_id,
      personal_id,
      formatMySQLDatetime(order_datetime), // ✅ แปลงรูปแบบให้ถูกต้อง
      shop_name,
      origin,
      destination,
      vehicle_type,
      status,
      price,
      id_user,
      phone,
      formatMySQLDatetime(moved_at) // ✅ แปลงรูปแบบให้ถูกต้อง
    ]);

    res.json({ success: true, message: "✅ บันทึกลง history_cus แล้ว" });
  } catch (err) {
    console.error("❌ INSERT INTO history_cus failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});




export default router;
