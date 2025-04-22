const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  role: { type: String },
  phone_number: { type: String },
  approved: { type: Boolean },
  status: { type: String, default: "ปกติ" },
  reason: { type: String },
  blockUntil: { type: Date },
});


module.exports = mongoose.model("User", userSchema);
