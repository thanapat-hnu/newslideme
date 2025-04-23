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


/**
 * @swagger
 * /search-location:
 *   get:
 *     summary: ค้นหาสถานที่ด้วยคำค้น keyword โดยใช้ Longdo Map API
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: คำค้นหาสำหรับสถานที่ เช่น ชื่อสถานที่หรือที่อยู่
 *     responses:
 *       200:
 *         description: คืนผลลัพธ์สถานที่ที่ค้นพบ
 *       500:
 *         description: เกิดข้อผิดพลาดขณะค้นหา
 */
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
/**
 * @swagger
 * /reverse-geocode:
 *   get:
 *     summary: แปลงพิกัดเป็นที่อยู่โดยใช้ OpenStreetMap Nominatim
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: พิกัดละติจูด
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: พิกัดลองจิจูด
 *     responses:
 *       200:
 *         description: คืนชื่อพื้นที่ ถนน และซอย
 *       500:
 *         description: เกิดข้อผิดพลาดขณะดึงข้อมูลจาก Nominatim
 */
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

/**
 * @swagger
 * /reverse-geocode-longdo:
 *   get:
 *     summary: แปลงพิกัดเป็นที่อยู่โดยใช้ Longdo Map API
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: พิกัดละติจูด
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: พิกัดลองจิจูด
 *     responses:
 *       200:
 *         description: คืนข้อมูลที่อยู่จาก Longdo
 *       500:
 *         description: เกิดข้อผิดพลาดขณะดึงข้อมูลจาก Longdo
 */
router.get("/reverse-geocode-longdo", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await axios.get(
      "https://api.longdo.com/map/services/address",
      {
        params: {
          key: "1b4327452cc20e14a37e40cc130bd03a",
          lon: lng,
          lat: lat,
        },
      }
    );
    console.log("Longdo reverse geocode result:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error reverse geocode with Longdo:", err);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
});


// ✅ /api/save-location
/**
 * @swagger
 * /save-location:
 *   post:
 *     summary: บันทึกพิกัดตำแหน่งต้นทางหรือปลายทาง
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - lat
 *               - lng
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [origin, destination]
 *                 example: origin
 *                 description: ประเภทของตำแหน่ง (ต้นทางหรือปลายทาง)
 *               lat:
 *                 type: number
 *                 example: 13.7563
 *               lng:
 *                 type: number
 *                 example: 100.5018
 *     responses:
 *       200:
 *         description: บันทึกพิกัดเรียบร้อย
 */
router.post("/save-location", (req, res) => {
  const { type, lat, lng } = req.body;
  console.log(`📍 Saved location [${type}]:`, lat, lng);
  res.json({ message: "Location saved" });
});

/**
 * @swagger
 * /search-log:
 *   post:
 *     summary: บันทึกคำค้นหาที่ผู้ใช้ใช้ค้นหา
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: เซ็นทรัลเวิลด์
 *     responses:
 *       200:
 *         description: บันทึกคำค้นหาเรียบร้อย
 */
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



/**
 * @swagger
 * /book-service:
 *   post:
 *     summary: จองบริการลากรถ
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - providerId
 *               - time
 *               - carType
 *               - phone
 *             properties:
 *               origin:
 *                 type: object
 *                 properties:
 *                   lat: { type: number, example: 13.736717 }
 *                   lng: { type: number, example: 100.523186 }
 *               destination:
 *                 type: object
 *                 properties:
 *                   lat: { type: number, example: 13.7563 }
 *                   lng: { type: number, example: 100.5018 }
 *               providerId:
 *                 type: string
 *                 example: T001
 *               time:
 *                 type: string
 *                 example: "2025-05-01T10:00:00"
 *               carType:
 *                 type: string
 *                 example: "รถลากขนาดกลาง"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *     responses:
 *       200:
 *         description: จองบริการเรียบร้อยแล้ว
 *       404:
 *         description: ไม่พบผู้ใช้หรือผู้ให้บริการ
 *       500:
 *         description: เกิดข้อผิดพลาดขณะบันทึกการจอง
 */

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


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: ดูรายละเอียดคำสั่งจองจาก order_id
 *     tags: [Booking]
 *     parameters:
 *       - in: query
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสคำสั่งจองที่ต้องการค้นหา
 *     responses:
 *       200:
 *         description: คืนข้อมูลคำสั่งจอง
 *       400:
 *         description: ไม่ได้ส่ง order_id
 *       404:
 *         description: ไม่พบคำสั่งจองในระบบ
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */

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


/**
 * @swagger
 * /move-to-history:
 *   post:
 *     summary: ย้ายคำสั่งจองไปยังประวัติการให้บริการ (history_cus)
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - personal_id
 *               - order_datetime
 *               - shop_name
 *               - origin
 *               - destination
 *               - vehicle_type
 *               - status
 *               - price
 *               - id_user
 *               - phone
 *               - moved_at
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 1001
 *               personal_id:
 *                 type: string
 *                 example: "P001"
 *               order_datetime:
 *                 type: string
 *                 example: "2025-05-01T10:00:00"
 *               shop_name:
 *                 type: string
 *                 example: "ลากรถด่วน"
 *               origin:
 *                 type: string
 *                 example: "lat:13.736717,lng:100.523186"
 *               destination:
 *                 type: string
 *                 example: "lat:13.7563,lng:100.5018"
 *               vehicle_type:
 *                 type: string
 *                 example: "รถลากขนาดกลาง"
 *               status:
 *                 type: string
 *                 example: "เสร็จสิ้น"
 *               price:
 *                 type: number
 *                 example: 2500
 *               id_user:
 *                 type: integer
 *                 example: 1
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               moved_at:
 *                 type: string
 *                 example: "2025-05-01T11:00:00"
 *     responses:
 *       200:
 *         description: บันทึกข้อมูลลง history_cus สำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดระหว่างการบันทึก
 */
function formatMySQLDatetimeB(datetimeString) {
  const date = new Date(datetimeString);
  return date.toISOString().slice(0, 19).replace("T", " ");
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
        personal_id, order_datetime, shop_name,
        origin, destination, vehicle_type, status,
        price, moved_at, order_id, id_user, phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      personal_id,
      formatMySQLDatetime(order_datetime),
      shop_name,
      origin,
      destination,
      vehicle_type,
      status,
      price,
      formatMySQLDatetime(moved_at),
      order_id,
      id_user,
      phone
    ]);

    res.json({ success: true, message: "✅ บันทึกลง history_cus แล้ว" });
  } catch (err) {
    console.error("❌ INSERT INTO history_cus failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});




export default router;
