// // server/routes/incidents.js
// const express = require("express");
// const Incident = require("../models/Incident");
// const router = express.Router();

// // Route สำหรับ GET /api/incidents
// router.get("/api/incidents", async (req, res) => {
//   try {
//     const incidents = await Incident.find();  // ดึงข้อมูลทั้งหมดจาก MongoDB
//     res.json(incidents);  // ส่งข้อมูลกลับไปยัง client
//   } catch (error) {
//     res.status(500).send("There was an error fetching incidents");
//   }
// });

// module.exports = router;

const express = require("express");
const Incident = require("../models/Incident");

const router = express.Router();

// Get All Incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching incidents", error: err });
  }
});

// Create New Incident
router.post('/', async (req, res) => {
  try {
    const newIncident = new Incident(req.body);
    await newIncident.save();
    res.status(201).json(newIncident);
  } catch (err) {
    res.status(400).json({ message: "Error creating incident", error: err });
  }
});

// Update Incident
router.put('/:id', async (req, res) => {
  try {
    const updatedIncident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedIncident) return res.status(404).json({ message: "Incident not found" });
    res.json(updatedIncident);
  } catch (err) {
    res.status(400).json({ message: "Error updating incident", error: err });
  }
});

// Delete Incident
router.delete('/:id', async (req, res) => {
  try {
    const deletedIncident = await Incident.findByIdAndDelete(req.params.id);
    if (!deletedIncident) return res.status(404).json({ message: "Incident not found" });
    res.json({ message: 'Incident deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: "Error deleting incident", error: err });
  }
});

module.exports = router;
