// server/routes/incidents.js
const express = require("express");
const Incident = require("../models/Incident");
const router = express.Router();

// Route สำหรับ GET /api/incidents
router.get("/api/incidents", async (req, res) => {
  try {
    const incidents = await Incident.find();  // ดึงข้อมูลทั้งหมดจาก MongoDB
    res.json(incidents);  // ส่งข้อมูลกลับไปยัง client
  } catch (error) {
    res.status(500).send("There was an error fetching incidents");
  }
});

module.exports = router;