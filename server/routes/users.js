const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Approve user
router.post("/approve/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      approved: true,
      status: "อนุมัติแล้ว",
    });
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});


// Update status (block/unblock)
router.post("/status/:id", async (req, res) => {
  const { status, reason } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { status, reason });
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Block with time
router.post("/block/:id", async (req, res) => {
  const { blockUntil, reason } = req.body;
  await User.findByIdAndUpdate(req.params.id, { status: "block", blockUntil, reason });
  res.json({ success: true });
});

router.post("/block/:id", async (req, res) => {
  const { id } = req.params;
  const { blockUntil, reason } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        status: "block",
        blockUntil,
        reason,
      },
      { new: true } // ← สำคัญ! ให้ MongoDB return ค่าใหม่
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User blocked", user });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/reject/:id", async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    await User.findByIdAndUpdate(id, {
      approved: false,
      status: "ปฏิเสธ",
      reason,
    });
    res.json({ message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// routes/users.js
router.put("/status/:id", async (req, res) => {
  const { status, reason } = req.body;

  if (status === "block") {
    // ➕ ดึงเวลาที่ตั้งไว้
    const BlockSetting = require("../models/BlockSetting");
    const latestSetting = await BlockSetting.findOne().sort({ createdAt: -1 });

    const durationMs =
      ((latestSetting?.days || 0) * 86400000) +
      ((latestSetting?.hours || 0) * 3600000) +
      ((latestSetting?.minutes || 0) * 60000);

    const blockUntil = new Date(Date.now() + durationMs);

    // ➕ อัปเดตผู้ใช้พร้อมตั้ง blockUntil
    await User.findByIdAndUpdate(req.params.id, {
      status: "block",
      blockUntil,
      reason,
    });

    return res.status(200).json({ message: "User blocked" });
  }

  if (status === "unblock") {
    await User.findByIdAndUpdate(req.params.id, {
      status: "อนุมัติแล้ว",
      blockUntil: null,
      reason: "",
    });

    return res.status(200).json({ message: "User unblocked" });
  }

  // 🟡 สำหรับเปลี่ยนสถานะปกติ
  await User.findByIdAndUpdate(req.params.id, { status });
  res.status(200).json({ message: "User status updated" });
});

module.exports = router;
