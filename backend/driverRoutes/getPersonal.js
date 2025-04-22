import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/getPersonal", async (req, res) => {
  const email = req.query.email;
  try {
    const [rows] = await pool.query("SELECT * FROM personal_info where email = ?", [
      email,
    ]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
