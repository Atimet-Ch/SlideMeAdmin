// server/models/Incident.js
const mongoose = require("mongoose");

// สร้าง Schema สำหรับ Incident
const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  reportedBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  reason: String,  // เฉพาะกรณีที่ปฏิเสธ
}, { timestamps: true });

// สร้าง Model จาก Schema
const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
