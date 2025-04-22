const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron"); // ✅ ต้องเพิ่ม
const dotenv = require('dotenv');
const path = require('path');

const User = require("./models/User");
const blockRoutes = require("./routes/block");
const userRoutes = require("./routes/users");
const itemsRoute = require('./routes/items');
const incidentRoutes = require("./routes/incidents");

const app = express();
const PORT = 5000;

dotenv.config();
app.use(bodyParser.json());

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use("/block", blockRoutes);
app.use("/users", userRoutes);
app.get("/api/users", async (req, res) => {
  const users = await User.find().limit(30);
  res.json(users);
});
app.use('/api/items', itemsRoute);
app.use("/api/incidents", incidentRoutes);

// MongoDB Connect
mongoose.connect("mongodb://localhost:27017/userDB" || "mongodb://localhost:27017/incident_db" || process.env.MONGO_URI);

// ⏰ Auto-Unblock Logic (ทุก 5 นาที)
cron.schedule("*/5 * * * *", async () => {
  const now = new Date();
  const usersToUnblock = await User.find({
    status: "block",
    blockUntil: { $lte: now },
  });

  for (const user of usersToUnblock) {
    await User.findByIdAndUpdate(user._id, {
      status: "อนุมัติแล้ว",
      blockUntil: null,
    });
    console.log(`Auto-unblocked user ${user._id}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
