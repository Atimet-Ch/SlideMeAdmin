const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // ไฟล์โมเดลที่เราจะสร้างต่อไป
const multer = require('multer');
const path = require('path');

// การตั้งค่าการอัปโหลดรูป
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // โฟลเดอร์เก็บรูป
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST เพิ่มรายการใหม่
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const item = new Item({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      image: req.file ? req.file.filename : ''
    });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT แก้ไข
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };
    if (req.file) updateData.image = req.file.filename;
    const updated = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;