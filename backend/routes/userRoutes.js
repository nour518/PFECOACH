const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// ✅ Inscription
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = await User.create({ name, email, password, role });
    const token = user.generateAuthToken();

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// ✅ Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Identifiants invalides" });

    const token = user.generateAuthToken();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
});

// ✅ Profil
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("coach", "name email");
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      diagnostic: user.diagnostic,
      planAction: user.planAction,
      coach: user.coach,
    },
  });
});

module.exports = router;