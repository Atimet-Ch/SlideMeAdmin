// server/routes/admins.js
const express = require("express");
const Admin = require("../models/Admin");

const router = express.Router();

async function verifyUser(user, pass) {
  try {
    const userFound = await Admin.findOne({ user, pass });
    return userFound ? { role: userFound.role, token: userFound.token } : null;
  } catch (err) {
    console.error("Error verifying user:", err);
    return null;
  }
}

router.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  const verified = await verifyUser(user, pass);

  if (verified) {
    res.json(verified);
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = {
  router,
  verifyUser,
};
