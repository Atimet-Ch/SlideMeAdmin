const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  id: Number,
  title: String,
  completed: Number
});

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;
