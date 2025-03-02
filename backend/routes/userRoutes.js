const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur enregistré" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;