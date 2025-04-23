const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true },
  reportedBy: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  reason: String // เฉพาะกรณีที่ปฏิเสธ
}, { timestamps: true });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;