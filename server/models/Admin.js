// server/models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  user: String,
  pass: String,
  role: String,
  token: String,
});

module.exports = "Admin", adminSchema;