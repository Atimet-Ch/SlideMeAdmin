const express = require('express');
const router = express.Router();
const BlockSetting = require('../models/BlockSetting');

// GET block setting
router.get('/setting', async (req, res) => {
  try {
    const setting = await BlockSetting.findOne({ key: 'setting' });
    const currentTime = new Date();
    
    if (setting && setting.blockUntil && setting.blockUntil < currentTime) {
      // หากเวลาปัจจุบันเกิน `blockUntil` ให้ปลดบล็อก
      setting.blockEnabled = false;
      setting.blockMessage = 'ระบบพร้อมใช้งานแล้ว';
      setting.blockUntil = null;  // ล้างค่าของ blockUntil
      await setting.save();
    }
    
    res.json(setting);
  } catch (err) {
    console.error('Error fetching block setting:', err);
    res.status(500).json({ error: 'Failed to fetch block setting' });
  }
});


// POST or update block setting
router.post('/setting', async (req, res) => {
  const { blockEnabled, blockMessage } = req.body;

  try {
    const updated = await BlockSetting.findOneAndUpdate(
      { key: 'setting' },
      { blockEnabled, blockMessage },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Error saving block setting:', err);
    res.status(500).json({ error: 'Failed to save block setting' });
  }
});

// GET block time setting for frontend
router.get('/get', async (req, res) => {
  try {
    const setting = await BlockSetting.findOne({ key: 'setting' });
    const { blockEnabled, blockMessage } = setting || {};
    const match = blockMessage?.match(/(\d+)\s*วัน\s*(\d+)\s*ชม\.\s*(\d+)\s*นาที/);
    const [ , days = 0, hours = 0, minutes = 0 ] = match?.map(Number) || [];
    res.json({ days, hours, minutes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch block time' });
  }
});

// POST save block time
router.post('/save', async (req, res) => {
  const { days = 0, hours = 0, minutes = 0 } = req.body;
  
  // คำนวณเวลา blockUntil
  const totalMs =
    ((days || 0) * 24 * 60 * 60 +
      (hours || 0) * 60 * 60 +
      (minutes || 0) * 60) *
    1000;
  
  const blockUntil = new Date(Date.now() + totalMs);

  const message = `ระบบจะถูกบล็อกเป็นเวลา ${days} วัน ${hours} ชม. ${minutes} นาที`;
  
  try {
    const setting = await BlockSetting.findOneAndUpdate(
      { key: 'setting' },
      { blockEnabled: true, blockMessage: message, blockUntil },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save block time' });
  }
});


router.get('/latest', async (req, res) => {
  try {
    const setting = await BlockSetting.findOne({ key: 'setting' });
    const match = setting?.blockMessage?.match(/(\d+)\s*วัน\s*(\d+)\s*ชม\.\s*(\d+)\s*นาที/);
    const [ , days = 0, hours = 0, minutes = 0 ] = match?.map(Number) || [];
    res.json({ days, hours, minutes });
  } catch (err) {
    res.status(500).json({ error: 'Cannot fetch block time' });
  }
});



module.exports = router;