const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  image: String,
});

module.exports = mongoose.model('Item', itemSchema);
