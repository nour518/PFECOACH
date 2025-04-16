const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Coach = require("../models/Coach");
const router = express.Router();

const createError = (message, statusCode) => {
  const error = new Error(message);
  // Correction de la logique de status
  error.statusCode = statusCode;
  error.status = statusCode.toString().startsWith("4") ? "fail" : "error"; // La logique correcte
  return error;
};

const DEFAULT_COACH_ID = "67f15d3bd6e21e924d548522";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    const coach = await Coach.findById(DEFAULT_COACH_ID);
    if (!coach) {
      return res.status(500).json({ message: "Coach par défaut introuvable." });
    }

    coach.subscribers.push(savedUser._id);
    await coach.save();

    res.status(201).json({ message: "Inscription réussie", user: savedUser });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createError("Email et mot de passe sont requis", 400));
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return next(createError("Email incorrect", 401));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError("Mot de passe incorrect", 401));
    }
    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );
    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coach: user.coach || null,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err);
    next(createError("Une erreur est survenue lors de la connexion", 500));
  }
});

router.get("/me", authMiddleware.protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("coach", "name email");
    if (!user) {
      return next(createError("Utilisateur non trouvé", 404));
    }
    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coach: user.coach || null,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err);
    next(createError("Une erreur est survenue lors de la récupération du profil", 500));
  }
});

module.exports = router;
