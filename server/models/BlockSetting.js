const mongoose = require('mongoose');

const blockSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'setting',
  },
  blockEnabled: {
    type: Boolean,
    default: false,
  },
  blockMessage: {
    type: String,
    default: 'System is under maintenance.',
  },
  blockUntil: {
    type: Date,  // ใช้ Date ในการเก็บเวลา
    default: null,
  },
});

module.exports = mongoose.model('BlockSetting', blockSettingSchema);
