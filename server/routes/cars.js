const express = require("express");
const Car = require("../models/Car.js");

const router = express.Router();

// Get All Cars
router.get('/', async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

// Create New Car
router.post('/', async (req, res) => {
  const newCar = new Car(req.body);
  await newCar.save();
  res.status(201).json(newCar);
});

// Update Car
router.put('/:id', async (req, res) => {
  const updated = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete Car
router.delete('/:id', async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;