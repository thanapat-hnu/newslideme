import express from 'express';
import pool from '../db.js';

const router = express.Router();
const towingList = [
  {
    providerId: 'T001',
    providerName: 'บริษัทลากรถด่วน',
    locations: {
      origin: { address: 'ถนนพหลโยธิน, กรุงเทพฯ' },
      destination: { address: 'อำเภอเมือง, เชียงใหม่' }
    },
    towTruckType: 'รถลากขนาดกลาง',
    price: 2500
  },
  {
    providerId: 'T002',
    providerName: 'ลากรถ24ชม.',
    locations: {
      origin: { address: 'ถนนสุขุมวิท, กรุงเทพฯ' },
      destination: { address: 'บางแสน, ชลบุรี' }
    },
    towTruckType: 'รถลากขนาดใหญ่',
    price: 3000
  },
];
// MOCK ข้อมูล history
const towingHistoryMock = [
  {
    providerId: 'T001',
    providerName: 'บริษัทลากรถด่วน',
    locations: {
      origin: { address: 'ถนนพหลโยธิน, กรุงเทพฯ' },
      destination: { address: 'อำเภอเมือง, เชียงใหม่' }
    },
    towTruckType: 'รถลากขนาดกลาง',
    price: 2500,
    randomDateTime: '2025-04-01 10:30',
    hasRated: false
  },
  {
    providerId: 'T002',
    providerName: 'ลากรถ24ชม.',
    locations: {
      origin: { address: 'ถนนสุขุมวิท, กรุงเทพฯ' },
      destination: { address: 'บางแสน, ชลบุรี' }
    },
    towTruckType: 'รถลากขนาดใหญ่',
    price: 3000,
    randomDateTime: '2025-04-03 14:45',
    hasRated: true
  }
];

//  เพิ่มเบอร์โทรลง MySQL
router.post('/insert-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phoneNumber]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: "เบอร์นี้มีอยู่ในระบบแล้ว" });
    }

    await pool.query("INSERT INTO users (phone) VALUES (?)", [phoneNumber]);
    return res.json({ success: true, message: "บันทึกเบอร์โทรศัพท์เรียบร้อย" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

// อัปเดตรายละเอียดผู้ใช้ตามเบอร์
router.post('/update-profile', async (req, res) => {
  const { phone, email, firstname, lastname, gender, profileImage } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบเบอร์โทรนี้ในระบบ" });
    }

    // ✅ เพิ่ม profileImage เข้า SQL ด้วย
    await pool.query(
      "UPDATE users SET email = ?, firstname = ?, lastname = ?, gender = ?, profileImage = ? WHERE phone = ?",
      [email, firstname, lastname, gender, profileImage || null, phone]
    );

    return res.json({ success: true, message: "อัปเดตข้อมูลโปรไฟล์เรียบร้อย" });

  } catch (err) {
    console.error("DB Update Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});


//  ตรวจสอบว่าเบอร์มีอยู่ในระบบหรือไม่
router.post('/check-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phoneNumber]);
    return res.json({ success: true, exists: rows.length > 0 });
  } catch (err) {
    console.error("Check Phone Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});


router.get('/get-user', async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้" });
    }

    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Get User Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

//  ลบบัญชีผู้ใช้ตามเบอร์โทร
router.post('/delete-user', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "กรุณาระบุเบอร์โทรศัพท์" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "ไม่พบผู้ใช้" });
    }

    await pool.query("DELETE FROM users WHERE phone = ?", [phone]);
    return res.json({ success: true, message: "ลบบัญชีผู้ใช้เรียบร้อยแล้ว" });

  } catch (err) {
    console.error("Delete User Error:", err.message);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});



router.get('/towing-list', (req, res) => {
  res.json(towingList);
});

router.get('/get-history', (req, res) => {
  res.json({ success: true, data: towingHistoryMock });
});

router.get('/customer-orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log('Requested orderId:', orderId);

  if (!orderId) {
    return res.status(400).json({ 
      success: false, 
      message: "กรุณาระบุรหัสออเดอร์" 
    });
  }

  try {
    // ทดสอบการเชื่อมต่อฐานข้อมูล
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    const query = `SELECT * FROM order_cus WHERE order_id = ?`;
    console.log('Executing query:', query, 'with orderId:', orderId);
    
    const [rows] = await pool.query(query, [orderId]);
    console.log('Query results:', rows);
    
    if (!rows || rows.length === 0) {
      console.log('No order found with ID:', orderId);
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลออเดอร์"
      });
    }

    const order = rows[0];
    console.log('Found order:', order);

    const formattedOrder = {
      orderId: order.order_id,
      providerId: order.personal_id,
      providerName: order.shop_name,
      locations: {
        origin: { address: order.origin },
        destination: { address: order.destination }
      },
      towTruckType: order.vehicle_type,
      price: order.price,
      orderDateTime: order.order_datetime,
      status: order.status
      // hasRated: order.has_rated // ยกเลิกเพราะไม่มีคอลัมน์นี้ใน DB
    };

    return res.json({ 
      success: true, 
      data: formattedOrder
    });

  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message 
    });
  }
});


router.get('/get-history/:personalId', async (req, res) => {
  const { personalId } = req.params;
  console.log('Fetching history for personalId:', personalId);

  try {
    // ตรวจสอบการเชื่อมต่อฐานข้อมูล
    const testQuery = 'SELECT 1';
    await pool.query(testQuery);
    console.log('Database connection successful');

    const query = `
      SELECT 
        history_id,
        personal_id,
        order_datetime,
        shop_name,
        origin,
        destination,
        vehicle_type,
        status,
        price,
        move_at
      FROM order_history 
      WHERE personal_id = ? 
      ORDER BY order_datetime DESC
    `;
    console.log('Executing query:', query);
    console.log('With personalId:', personalId);
    
    const [rows] = await pool.query(query, [personalId]);
    console.log('Query results:', rows);
    
    if (rows.length === 0) {
      console.log('No history found for personalId:', personalId);
      return res.json({ 
        success: true, 
        data: [] 
      });
    }

    const formattedHistory = rows.map(order => ({
      historyId: order.history_id,
      personalId: order.personal_id,
      orderDateTime: order.order_datetime,
      providerName: order.shop_name,
      locations: {
        origin: { address: order.origin },
        destination: { address: order.destination }
      },
      vehicleType: order.vehicle_type,
      status: order.status,
      price: order.price,
      moveAt: order.move_at
    }));

    return res.json({ 
      success: true, 
      data: formattedHistory
    });

  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message 
    });
  }
});

router.get('/history/:historyId', async (req, res) => {
  const { historyId } = req.params;
  console.log('Requested historyId:', historyId);

  try {
    // เพิ่ม logging
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    const query = `
      SELECT * FROM history_cus 
      WHERE history_id = ?
    `;
    console.log('Executing query:', query, 'with historyId:', historyId);
    
    const [rows] = await pool.query(query, [historyId]);
    console.log('Query results:', rows);
    
    if (rows.length === 0) {
      console.log('No history found with ID:', historyId);
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลประวัติ"
      });
    }

    const history = rows[0];
    console.log('Found history:', history);

    const formattedHistory = {
      historyId: history.history_id,
      personalId: history.personal_id,
      orderDateTime: history.order_datetime,
      providerName: history.shop_name,
      locations: {
        origin: { address: history.origin },
        destination: { address: history.destination }
      },
      vehicleType: history.vehicle_type,
      status: history.status,
      price: history.price,
      moveAt: history.move_at
    };

    return res.json({ 
      success: true, 
      data: formattedHistory
    });

  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message 
    });
  }
});

router.get('/histories', async (req, res) => {
    try {
        const query = `
            SELECT * FROM history_cus 
            WHERE history_id BETWEEN 9 AND 13 
            ORDER BY history_id DESC
        `;
        
        const [rows] = await pool.query(query);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูลประวัติ"
            });
        }

        const formattedHistories = rows.map(history => ({
            historyId: history.history_id,
            personalId: history.personal_id,
            orderDateTime: history.order_datetime,
            providerName: history.shop_name,
            locations: {
                origin: { address: history.origin },
                destination: { address: history.destination }
            },
            vehicleType: history.vehicle_type,
            status: history.status,
            price: history.price,
            moveAt: history.move_at
        }));

        return res.json({ 
            success: true, 
            data: formattedHistories
        });

    } catch (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ 
            success: false, 
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message 
        });
    }
});

// Driver Order API
router.get('/driver/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const query = `SELECT * FROM order_cus WHERE order_id = ?`;
    const [rows] = await pool.query(query, [orderId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลออเดอร์"
      });
    }

    const order = rows[0];
    const formattedOrder = {
      orderId: order.order_id,
      providerId: order.personal_id,
      providerName: order.shop_name,
      locations: {
        origin: { address: order.origin },
        destination: { address: order.destination }
      },
      towTruckType: order.vehicle_type,
      price: order.price,
      orderDateTime: order.order_datetime,
      status: order.status
    };

    return res.json({ 
      success: true, 
      data: formattedOrder
    });

  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message 
    });
  }
});

// Driver History API
router.get('/driver/history/:historyId', async (req, res) => {
  const { historyId } = req.params;

  try {
    const query = `SELECT * FROM history_cus WHERE history_id = ?`;
    const [rows] = await pool.query(query, [historyId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลประวัติ"
      });
    }

    const history = rows[0];
    const formattedHistory = {
      historyId: history.history_id,
      personalId: history.personal_id,
      orderDateTime: history.order_datetime,
      providerName: history.shop_name,
      locations: {
        origin: { address: history.origin },
        destination: { address: history.destination }
      },
      vehicleType: history.vehicle_type,
      status: history.status,
      price: history.price,
      moveAt: history.move_at
    };

    return res.json({ 
      success: true, 
      data: formattedHistory
    });

  } catch (err) {
    console.error("Database Error:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message 
    });
  }
});

export default router;
