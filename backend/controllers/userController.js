const express = require("express");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  return error;
};

// ✅ Inscription
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(createError("Tous les champs sont requis", 400));
    }

    if (!validator.isEmail(email)) {
      return next(createError("Veuillez fournir un email valide", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(createError("Cet email est déjà utilisé.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "user",
    });

    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'inscription :", err);
    next(createError("Une erreur est survenue lors de l'inscription", 500));
  }
});

// ✅ Connexion
router.post("/login", async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("🔍 Tentative de connexion avec l'email :", email);

    if (!email) {
      return next(createError("Veuillez fournir un email", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    console.log("🔎 Utilisateur trouvé :", user ? user.email : "Aucun utilisateur trouvé");

    if (!user) {
      console.log("⚠️ Email incorrect pour :", normalizedEmail);
      return next(createError("Email incorrect", 401));
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
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err);
    next(createError("Une erreur est survenue lors de la connexion", 500));
  }
});

// ✅ Profil utilisateur
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
        coach: user.coach,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err);
    next(createError("Une erreur est survenue lors de la récupération du profil", 500));
  }
});

module.exports = router;
